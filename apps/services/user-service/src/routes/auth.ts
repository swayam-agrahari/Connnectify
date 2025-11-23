import express, { type Response } from "express";
import { LoginSchema, RegisterSchema, RequestPasswordResetSchema, ResetPasswordSchema } from "../../utils/zod-schema.ts";
import { hash, compare } from "bcrypt";
import { randomInt } from 'crypto';
import prisma from "../generated/index.ts";
import jwt from "jsonwebtoken";
import { sendEmail } from "@/utils/sendEmail.ts";
import { authMiddleware, type AuthenticatedRequest } from "@/utils/authMiddleware.ts";

export const authRouter = express.Router();



authRouter.get("/validate", (req, res) => {
    console.log("Received validation request");
    const token = req.cookies.session;
    console.log("Validating token:", token);
    if (!token) return res.status(401).json({ valid: false });

    try {
        jwt.verify(token, process.env.JWT_SECRET!);
        res.json({ valid: true });
    } catch (err) {
        res.status(401).json({ valid: false });
    }
});


authRouter.post("/register", async (req, res) => {
    const verificationCode = randomInt(100000, 999999).toString(); // for otp 6 digit 
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    console.log("called here ", req.body)
    const parsedResponse = RegisterSchema.safeParse(req.body);

    if (!parsedResponse.success) {
        return res.status(400).json({
            message: "Invalid request data",
            errors: parsedResponse.error,
        });
    }

    const hashedPassword = await hash(parsedResponse.data.password, 10);
    console.log("hashed password", hashedPassword);

    try {
        console.log("sending request to db")
        const user = await prisma.users.create({
            data: {
                email: parsedResponse.data.email,
                username: parsedResponse.data.username,
                password: hashedPassword,
                name: parsedResponse.data.name || "",
                profileImageUrl: parsedResponse.data.profileImageUrl || "",
                universityId: parsedResponse.data.universityId || "",
                isEmailVerified: false,
                verificationCode: verificationCode,
                verificationCodeExpiresAt: expiresAt,
            }
        })

        if (!user) {
            return res.status(500).json({
                message: "User registration failed",
            });
        }

        //send email with otp
        sendEmail(
            user.email,
            "Verify Your Email - Connectify",
            `
            <h2>Email Verification</h2>
            <p>Hello ${user.username},</p>
            <p>Your verification code is:</p>
            <h3>${verificationCode}</h3>
            <p>This code will expire in 10 minutes.</p>
            `
        ).catch(console.error);

        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET!,
            { expiresIn: "7d" } // optional, same as cookie
        );

        res.cookie("session", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax", // or "none" if cross-origin with https
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: "/",
            domain: "localhost", // optional for cross-subdomain
        });


        return res.status(200).json({
            message: "User registered successfully",
            userId: user.id,
            token: token,
            uid: user.universityId
        })
    } catch (error) {
        console.log("Error registering user:", error);

        res.status(400).json({
            message: "Error registering user, already exists?",
            error: error,
        });
    }





});

authRouter.post("/login", async (req, res) => {

    const parsedResponse = LoginSchema.safeParse(req.body);

    if (!parsedResponse.success) {
        return res.status(400).json({
            message: "Invalid request data",
            errors: parsedResponse.error,
        });
    }

    try {
        const user = await prisma.users.findUnique({
            where: {
                email: parsedResponse.data.email,
            }
        });

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        const isPasswordValid = await compare(parsedResponse.data.password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Invalid email or password",
            });
        }

        if (!user.isEmailVerified) {
            return res.status(403).json({ error: "Email not verified" });
        }

        const token = jwt.sign({
            userId: user.id,
            email: user.email,
        }, process.env.JWT_SECRET!);

        res.cookie("session", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax", // or "none" if cross-origin with https
            maxAge: 7 * 24 * 60 * 60 * 1000, //7 days
            path: "/",
            domain: "localhost", // optional for cross-subdomain
        });

        return res.status(200).json({
            message: "Login successful",
            userId: user.id,
            token: token,
            uid: user.universityId
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error logging in",
            error: error,
        });
    }
});


authRouter.post('/verify', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
    const { code } = req.body;
    console.log("in heree", code)
    const userId = req.user!.userId;
    console.log("user id", userId)

    if (!code) return res.status(400).json({ error: "Verification code is required" });

    const user = await prisma.users.findUnique({ where: { id: userId } });
    console.log("user fetched", user)
    if (!user) return res.status(404).json({ error: "User not found" });

    if (user.isEmailVerified) return res.status(200).json({ message: "Email already verified" });

    console.log("comparing codes", user.verificationCode, code)

    if (user.verificationCode !== code) return res.status(400).json({ error: "Invalid verification codeeee" });

    if (new Date() > user.verificationCodeExpiresAt!)
        return res.status(400).json({ error: "Verification code expired" });

    await prisma.users.update({
        where: { id: userId },
        data: { isEmailVerified: true, verificationCode: null, verificationCodeExpiresAt: null },
    });

    return res.status(200).json({ message: "Email verified successfully" });
});

authRouter.post("/request-password-reset", async (req, res) => {
    const parsedResponse = RequestPasswordResetSchema.safeParse(req.body);

    if (!parsedResponse.success) {
        return res.status(400).json({
            message: "Invalid email format",
            errors: parsedResponse.error.flatten().fieldErrors,
        });
    }

    const { email } = parsedResponse.data;

    try {
        const user = await prisma.users.findUnique({
            where: { email },
        });

        if (user && user.isEmailVerified) {
            const verificationCode = randomInt(100000, 999999).toString();
            const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

            await prisma.users.update({
                where: { email: user.email },
                data: {
                    verificationCode: verificationCode,
                    verificationCodeExpiresAt: expiresAt,
                },
            });

            console.log(`Password reset code for ${user.email} is: ${verificationCode}`);
            /*
            sendEmail(
              user.email,
              "Your Password Reset Code - Connectify",
              `...`
            ).catch(console.error);
            */
        }

        return res.status(200).json({
            message: "If your email is registered and verified, you will receive a code."
        });

    } catch (error) {
        console.log("Error in /request-password-reset:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

authRouter.post("/reset-password", async (req, res) => {
    const parsedResponse = ResetPasswordSchema.safeParse(req.body);

    if (!parsedResponse.success) {
        return res.status(400).json({
            message: "Invalid request data",
            errors: parsedResponse.error.flatten().fieldErrors,
        });
    }

    const { email, code, newPassword } = parsedResponse.data;

    try {
        const user = await prisma.users.findUnique({
            where: { email },
        });

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        if (user.verificationCode !== code) {
            return res.status(400).json({ message: "Invalid verification code." });
        }

        if (new Date() > user.verificationCodeExpiresAt!) {
            return res.status(400).json({ message: "Verification code has expired." });
        }

        const hashedPassword = await hash(newPassword, 10);

        await prisma.users.update({
            where: { email: user.email },
            data: {
                password: hashedPassword,
                verificationCode: null,         
                verificationCodeExpiresAt: null, 
            },
        });

        return res.status(200).json({ message: "Password reset successfully." });

    } catch (error) {
        console.log("Error in /reset-password:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

authRouter.post('/me', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
    console.log("in hereee")
    const userId = req.body.userId || req.user?.userId;
    if (!userId) {
        console.log("in here")
        return res.status(401).json({ error: "Unauthorized" });
    }

    try {
        const user = await prisma.users.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                username: true,
                name: true,
                profileImageUrl: true,
                universityId: true,
            }
        });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        return res.status(200).json({ user });
    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
});


authRouter.post("/bulk", async (req, res) => {
    console.log("callled here")
    const { ids } = req.body; // Expects { ids: ["user1", "user2"] }

    console.log("Bulk user fetch for IDs:", ids);
    const users = await prisma.users.findMany({
        where: { id: { in: ids } },
        select: { id: true, username: true, profileImageUrl: true, name: true } // Only public info
    });

    res.json({ users });
});

authRouter.get("/details", authMiddleware, async (req: AuthenticatedRequest, res) => {
    const userId = req.user?.userId;
    if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    try {
        const data = await prisma.users.findUnique({
            where: {
                id: userId
            },

        })

        if (!data) {
            return res.status(404).json({ error: "User not found" });
        }

        return res.status(200).json({ user: data });
    } catch (error) {
        console.log("error getting user", error)
        return res.status(403).json({
            "error": error
        })
    }
})


authRouter.post("/details", authMiddleware, async (req: AuthenticatedRequest, res: Response) => {

    try {
        const userId = req.user?.userId
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const { name, profileImageUrl } = req.body;
        const updatedUser = await prisma.users.update({
            where: {
                id: userId
            },
            data: {
                name: name,
                profileImageUrl: profileImageUrl
            }
        })

    } catch (error) {
        console.log("error updating user details", error);
        return res.status(500).json({ error: "Internal server error" });
    }
})

//find user by id
authRouter.get("/:userId/details", async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { userId } = req.params;
        console.log("Fetching user for userId:", userId);
        if (!userId) {
            return res.status(400).json({ error: "User ID not provided" });
        }

        const user = await prisma.users.findUnique({
            where: {
                id: userId
            },
            select: {
                id: true,
                username: true,
                profileImageUrl: true,
                name: true,
                universityId: true,
                createdAt: true,
                email: true,
            }
        })

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        return res.status(200).json({ user });
    } catch (error) {
        console.log("error fetching user by id", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});


authRouter.get("/:universityId/all", async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { universityId } = req.params;
        console.log("Fetching all users for universityId:", universityId);
        if (!universityId) {
            return res.status(400).json({ error: "University ID not provided" });
        }

        const users = await prisma.users.findMany({
            where: {
                universityId: universityId
            },
            select: {
                id: true,
                username: true,
                profileImageUrl: true,
                name: true,
                universityId: true
            }
        });

        return res.status(200).json({ users });
    } catch (error) {
        console.log("error fetching users by university id", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});

authRouter.post('/logout', (req, res) => {
    console.log("Logout request received");

    res.clearCookie('token', {
        httpOnly: true,
        secure: false,   // set true if using HTTPS in production
        sameSite: 'lax',
        path: '/',
    });

    return res.status(200).json({ message: 'Logged out successfully' });
});
