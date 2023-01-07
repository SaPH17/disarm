import AuthServices from '../../services/auth-services';

export class CheckLoginHandlers {
  static async handleLoginFormSubmit() {
    try {
      return (await AuthServices.checkLogin()).data;
    } catch (e) {
      throw e;
    }
  }
}
