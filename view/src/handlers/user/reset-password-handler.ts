import UserServices from "../../services/user-services";

export class ResetPasswordHandler {
  static async handleResetPassword(selectedData: string | number) {
    try {
      return (await UserServices.resetPassword(selectedData)).data;
    } catch (e) {
      throw e;
    }
  }
}