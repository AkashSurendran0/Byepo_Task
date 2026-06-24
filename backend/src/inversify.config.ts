import { Container } from "inversify"
import { TYPES } from "./TYPES"
import { SuperAdminController } from "./controller/super-admin-controller"
import { SuperAdminRepository } from "./infrastructure/repositories/super-admin-repository"
import { ValidateLogin } from "./use-case/super-admin/valildateLogin"
import { AuthController } from "./controller/auth-controller"
import { FeatureFlagController } from "./controller/feature-flag-controller"
import { OrganizationController } from "./controller/organization-controller"
import { UserRepository } from "./infrastructure/repositories/user-repository"
import { OrganizationRepository } from "./infrastructure/repositories/organization-repository"
import { FeatureFlagRepository } from "./infrastructure/repositories/feature-flag-repository"
import { ListOrganizations } from "./use-case/organization/listOrganizations"
import { ListOrganizationsForSelection } from "./use-case/organization/listOrganizationsForSelection"
import { SignupUser } from "./use-case/auth/signupUser"
import { LoginUser } from "./use-case/auth/loginUser"
import { ListFeatureFlags } from "./use-case/feature-flag/listFeatureFlags"
import { CreateFeatureFlag } from "./use-case/feature-flag/createFeatureFlag"
import { UpdateFeatureFlag } from "./use-case/feature-flag/updateFeatureFlag"
import { DeleteFeatureFlag } from "./use-case/feature-flag/deleteFeatureFlag"
import { CheckFeatureFlag } from "./use-case/feature-flag/checkFeatureFlag"
import { CreateOrganization } from "./use-case/organization/createOrganization"

const container=new Container()

container.bind(TYPES.SuperAdminController).to(SuperAdminController)
container.bind(TYPES.AuthController).to(AuthController)
container.bind(TYPES.FeatureFlagController).to(FeatureFlagController)
container.bind(TYPES.OrganizationController).to(OrganizationController)

container.bind(TYPES.IValidateLogin).to(ValidateLogin)
container.bind(TYPES.IListOrganizations).to(ListOrganizations)
container.bind(TYPES.IListOrganizationsForSelection).to(ListOrganizationsForSelection)
container.bind(TYPES.ISignupUser).to(SignupUser)
container.bind(TYPES.ILoginUser).to(LoginUser)
container.bind(TYPES.IListFeatureFlags).to(ListFeatureFlags)
container.bind(TYPES.ICreateFeatureFlag).to(CreateFeatureFlag)
container.bind(TYPES.IUpdateFeatureFlag).to(UpdateFeatureFlag)
container.bind(TYPES.IDeleteFeatureFlag).to(DeleteFeatureFlag)
container.bind(TYPES.ICheckFeatureFlag).to(CheckFeatureFlag)
container.bind(TYPES.ICreateOrganization).to(CreateOrganization)

container.bind(TYPES.ISuperAdminRepository).to(SuperAdminRepository)
container.bind(TYPES.IUserRepository).to(UserRepository)
container.bind(TYPES.IOrganizationRepository).to(OrganizationRepository)
container.bind(TYPES.IFeatureFlagRepository).to(FeatureFlagRepository)


export default container