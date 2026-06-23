import { injectable } from "inversify";
import { ISuperAdminRepository } from "../../domain/repositories/super-admin-repository";
import { SuperAdminModal } from "../models/super-admin-model";

@injectable()
export class SuperAdminRepository implements ISuperAdminRepository {

    async validateLogin(email: string, password: string): Promise<boolean> {
        // Assignment expects static Super Admin credentials; env values can override these local defaults.
        const staticEmail = process.env.SUPER_ADMIN_EMAIL || "admin@byepo.com";
        const staticPassword = process.env.SUPER_ADMIN_PASSWORD || "password123";
        if (email === staticEmail && password === staticPassword) {
            return true;
        }

        const superAdmin = await SuperAdminModal.findOne({email});
        if(!superAdmin){
            return false;
        }
        return superAdmin.password === password;
    }

}
