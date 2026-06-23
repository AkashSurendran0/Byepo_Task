export interface IValidateLogin {
    validate(email: string, password: string): Promise<boolean>
}