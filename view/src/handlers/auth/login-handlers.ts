import AuthServices from "../../services/auth-services";

export type LoginFormData = {
  email: string;
  password: string;
}

export class LoginHandlers {
  static async handleLoginFormSubmit(data: LoginFormData) {
    try {
      const result = (await AuthServices.login(data)).data;
      if (!result.token) throw new Error('Invalid Credential');
      console.log(result.token);
      return result.token;
    } catch (e) {
      throw e;
    }
  }
}