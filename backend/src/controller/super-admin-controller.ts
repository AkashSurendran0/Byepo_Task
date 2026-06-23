import { Request, Response } from "express";
import { inject } from "inversify";
import { TYPES } from "../TYPES";
import { IValidateLogin } from "../domain/use-case/super-admin-usecase";
import jwt from 'jsonwebtoken'

export class SuperAdminController {

    constructor(
        @inject(TYPES.IValidateLogin) private _validateLogin: IValidateLogin
    ){}


    login = async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body;
            const isValid = await this._validateLogin.validate(email, password);
            if (!isValid) {
                return res.status(401).json({ message: "Invalid credentials" });
            }

            const token = jwt.sign({ email }, process.env.JWT_SECRET!, { expiresIn: '1h' });
            res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'strict' });

            res.status(200).json({ message: "Login successful" });
        } catch (error) {
            res.status(500).json({ message: "Internal server error" });
        }
    }

}