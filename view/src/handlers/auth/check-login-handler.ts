import AuthServices from "../../services/auth-services";

export class CheckLoginHandlers {
  static async handleLoginFormSubmit() {
    try {
      const result = (await AuthServices.checkLogin()).data;
      console.log(result);
      return result;
    } catch (e) {
      throw e;
    }
  }
}