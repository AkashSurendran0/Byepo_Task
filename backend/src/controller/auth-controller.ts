import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Types } from "mongoose";
import { OrganizationModal } from "../infrastructure/models/organization-model";
import { UserModal, UserRole } from "../infrastructure/models/user-model";

const signToken = (user: {
    _id: Types.ObjectId;
    email: string;
    role: UserRole;
    organization: Types.ObjectId;
}) =>
    jwt.sign(
        {
            id: user._id.toString(),
            email: user.email,
            role: user.role,
            organization: user.organization.toString(),
        },
        process.env.JWT_SECRET!,
        { expiresIn: "8h" }
    );

export class AuthController {
    signup = (role: UserRole) => async (req: Request, res: Response) => {
        try {
            const name = String(req.body.name || "").trim();
            const email = String(req.body.email || "").trim().toLowerCase();
            const password = String(req.body.password || "");
            const organizationId = String(req.body.organizationId || "");

            if (!name || !email || !password || !organizationId) {
                return res.status(400).json({ message: "All fields are required" });
            }

            if (password.length < 6) {
                return res.status(400).json({ message: "Password must be at least 6 characters" });
            }

            if (!Types.ObjectId.isValid(organizationId)) {
                return res.status(400).json({ message: "Invalid organization" });
            }

            const organization = await OrganizationModal.findById(organizationId);
            if (!organization) {
                return res.status(404).json({ message: "Organization not found" });
            }

            const existingUser = await UserModal.findOne({ email });
            if (existingUser) {
                return res.status(409).json({ message: "Email already registered" });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const user = await UserModal.create({
                name,
                email,
                password: hashedPassword,
                role,
                organization: organization._id,
            });

            const token = signToken({
                _id: user._id as Types.ObjectId,
                email: user.email,
                role: user.role,
                organization: user.organization,
            });

            res.status(201).json({
                message: "Signup successful",
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    organization: user.organization,
                },
            });
        } catch (error) {
            res.status(500).json({ message: "Internal server error" });
        }
    };

    login = (role: UserRole) => async (req: Request, res: Response) => {
        try {
            const email = String(req.body.email || "").trim().toLowerCase();
            const password = String(req.body.password || "");

            if (!email || !password) {
                return res.status(400).json({ message: "Email and password are required" });
            }

            const user = await UserModal.findOne({ email, role });
            if (!user) {
                return res.status(401).json({ message: "Invalid credentials" });
            }

            const isValid = await bcrypt.compare(password, user.password);
            if (!isValid) {
                return res.status(401).json({ message: "Invalid credentials" });
            }

            const token = signToken({
                _id: user._id as Types.ObjectId,
                email: user.email,
                role: user.role,
                organization: user.organization,
            });

            res.status(200).json({
                message: "Login successful",
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    organization: user.organization,
                },
            });
        } catch (error) {
            res.status(500).json({ message: "Internal server error" });
        }
    };
}
