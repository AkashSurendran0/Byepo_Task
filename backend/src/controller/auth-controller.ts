import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../TYPES";
import { ILoginUser, ISignupUser } from "../domain/use-case/auth-usecase";
import { UserRole } from "../infrastructure/models/user-model";

@injectable()
export class AuthController {
    constructor(
        @inject(TYPES.ISignupUser) private _signupUser: ISignupUser,
        @inject(TYPES.ILoginUser) private _loginUser: ILoginUser
    ) {}

    signup = (role: UserRole) => async (req: Request, res: Response) => {
        try {
            const result = await this._signupUser.execute(role, req.body);
            res.status(result.status).json(result.body);
        } catch (error) {
            res.status(500).json({ message: "Internal server error" });
        }
    };

    login = (role: UserRole) => async (req: Request, res: Response) => {
        try {
            const result = await this._loginUser.execute(role, req.body);
            res.status(result.status).json(result.body);
        } catch (error) {
            res.status(500).json({ message: "Internal server error" });
        }
    };
}
