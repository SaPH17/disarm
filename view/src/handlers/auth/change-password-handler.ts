import AuthServices from '../../services/auth-services';

export class ChangePasswordHandlers {
  static async handleChangePasswordFormSubmit(data: object) {
    try {
      return (await AuthServices.changePassword(data)).data;
    } catch (e) {
      throw e;
    }
  }
}
