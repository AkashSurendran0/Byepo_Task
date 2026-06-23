import { Request, Response } from "express";
import { inject } from "inversify";
import { TYPES } from "../TYPES";
import { IValidateLogin } from "../domain/use-case/super-admin-usecase";
import jwt from 'jsonwebtoken'
import { OrganizationController } from "./organization-controller";

export class SuperAdminController {
    private _organizationController = new OrganizationController();

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

            const token = jwt.sign({ email, role: "super_admin" }, process.env.JWT_SECRET!, { expiresIn: '8h' });
            res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'strict' });

            res.status(200).json({ message: "Login successful", token });
        } catch (error) {
            res.status(500).json({ message: "Internal server error" });
        }
    }

    createOrganization = this._organizationController.create;

    listOrganizations = this._organizationController.listForSuperAdmin;

}
