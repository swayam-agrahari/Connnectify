import type { Request, Response, NextFunction } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

// Extend Express Request
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
) => {
    try {
        const token = req.cookies.session; // cookie name

        console.log("backend auth middleware, token:", token);
        if (!token) {
            return res.status(401).json({ error: "Authentication token missing" });
        }

        // Tell TS that payload contains userId
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload & {
            userId: string;
            email?: string;
        };

        req.user = {
            userId: decoded.userId,
            email: decoded.email,
        };

        next();
    } catch (err) {
        console.error("JWT verification error:", err);
        return res.status(401).json({ error: "Invalid or expired token" });
    }
};
