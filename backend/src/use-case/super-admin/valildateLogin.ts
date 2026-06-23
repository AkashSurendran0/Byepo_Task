import { inject, injectable } from "inversify";
import { IValidateLogin } from "../../domain/use-case/super-admin-usecase";
import { TYPES } from "../../TYPES";
import { ISuperAdminRepository } from "../../domain/repositories/super-admin-repository";

@injectable()
export class ValidateLogin implements IValidateLogin {

    constructor(
        @inject(TYPES.ISuperAdminRepository) private _superAdminRepository: ISuperAdminRepository
    ){}

    async validate(email: string, password: string): Promise<boolean> {
        return this._superAdminRepository.validateLogin(email, password);
    }
        

}   