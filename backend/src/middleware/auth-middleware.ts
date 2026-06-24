import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Types } from "mongoose";
import { UserRole } from "../infrastructure/models/user-model";

export type AuthRole = "super_admin" | UserRole;

export interface AuthPayload {
    id?: string;
    email: string;
    role: AuthRole;
    organization?: string;
}

export interface AuthRequest extends Request {
    auth?: AuthPayload;
}

const getToken = (req: Request) => {
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith("Bearer ")) {
        return authHeader.slice(7);
    }

    return undefined;
};

export const requireAuth =
    (...roles: AuthRole[]) =>
    (req: AuthRequest, res: Response, next: NextFunction) => {
        const token = getToken(req);
        if (!token) {
            return res.status(401).json({ message: "Authentication required" });
        }

        try {
            const payload = jwt.verify(token, process.env.JWT_SECRET!) as AuthPayload;
            if (!roles.includes(payload.role)) {
                return res.status(403).json({ message: "Access denied" });
            }

            req.auth = payload;
            next();
        } catch (error) {
            return res.status(401).json({ message: "Invalid or expired token" });
        }
    };

export const getAuthOrganizationId = (req: AuthRequest, res: Response) => {
    const organizationId = req.auth?.organization;
    if (!organizationId || !Types.ObjectId.isValid(organizationId)) {
        res.status(403).json({ message: "Organization access is required" });
        return undefined;
    }

    return new Types.ObjectId(organizationId);
};
