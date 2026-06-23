import { Container } from "inversify"
import { TYPES } from "./TYPES"
import { SuperAdminController } from "./controller/super-admin-controller"
import { SuperAdminRepository } from "./infrastructure/repositories/super-admin-repository"
import { ValidateLogin } from "./use-case/super-admin/valildateLogin"

const container=new Container()

container.bind(TYPES.SuperAdminController).to(SuperAdminController)

container.bind(TYPES.IValidateLogin).to(ValidateLogin)

container.bind(TYPES.ISuperAdminRepository).to(SuperAdminRepository)

export default container