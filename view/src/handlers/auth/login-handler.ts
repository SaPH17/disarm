import Cookies from "universal-cookie";
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
      this.createCookie(result);
      
      const { token, ...rest } = result;
      return rest;
    } catch (e) {
      throw e;
    }
  }

  static createCookie(data: any) {
    const { token, ...rest } = data;
    const cookies = new Cookies();
    cookies.set('auth', JSON.stringify(rest), { path: '/' });
  }
}