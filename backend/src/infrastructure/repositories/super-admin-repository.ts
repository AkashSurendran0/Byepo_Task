import { injectable } from "inversify";
import { ISuperAdminRepository } from "../../domain/repositories/super-admin-repository";
import { SuperAdminModal } from "../models/super-admin-model";

@injectable()
export class SuperAdminRepository implements ISuperAdminRepository {

    async validateLogin(email: string, password: string): Promise<boolean> {
        const superAdmin = await SuperAdminModal.findOne({email});
        if(!superAdmin){
            return false;
        }
        return superAdmin.password === password;
    }

}