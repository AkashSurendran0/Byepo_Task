import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { inject, injectable } from "inversify";
import { Types } from "mongoose";
import { TYPES } from "../../TYPES";
import { IUserRepository } from "../../domain/repositories/user-repository";
import { ILoginUser } from "../../domain/use-case/auth-usecase";
import { UseCaseResponse } from "../../domain/use-case/organization-usecase";
import { IUserModel, UserRole } from "../../infrastructure/models/user-model";

const signToken = (user: IUserModel) =>
    jwt.sign(
        {
            id: (user._id as Types.ObjectId).toString(),
            email: user.email,
            role: user.role,
            organization: user.organization.toString(),
        },
        process.env.JWT_SECRET!,
        { expiresIn: "8h" }
    );

@injectable()
export class LoginUser implements ILoginUser {
    constructor(
        @inject(TYPES.IUserRepository) private _userRepository: IUserRepository
    ) {}

    async execute(role: UserRole, data: {
        email?: unknown;
        password?: unknown;
    }): Promise<UseCaseResponse<Record<string, unknown>>> {
        const email = String(data.email || "").trim().toLowerCase();
        const password = String(data.password || "");

        if (!email || !password) {
            return { status: 400, body: { message: "Email and password are required" } };
        }

        const user = await this._userRepository.findByEmailAndRole(email, role);
        if (!user) {
            return { status: 401, body: { message: "Invalid credentials" } };
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return { status: 401, body: { message: "Invalid credentials" } };
        }

        const token = signToken(user);
        return {
            status: 200,
            body: {
                message: "Login successful",
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    organization: user.organization,
                },
            },
        };
    }
}
