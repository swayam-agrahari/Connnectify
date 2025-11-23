import type { Request, Response, NextFunction } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export interface AuthenticatedRequest extends Request {
    user?: {
        userId: string;
        email?: string | undefined;
    };
}

export const authMiddleware = (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): void => {
    try {
        console.log("Auth middleware: accessing cookies:", req.cookies);
        const token = req.cookies?.session;
        console.log("Auth middleware: token from cookie:", token);

        if (!token) {
            console.warn("Auth middleware: missing JWT cookie.");
            res.status(401).json({ error: "Authentication token missing" });
            return;
        }

        // Verify and decode the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload & {
            userId: string;
            email?: string;
        };

        // Attach decoded data to request
        req.user = {
            userId: decoded.userId,
            email: decoded.email,
        };

        next();
    } catch (err: any) {
        console.error("JWT verification error:", err.message);
        res.status(401).json({ error: "Invalid or expired token" });
    }
};
