import { UserFormData } from "../../models/forms/user-form-data";
import AuthServices from "../../services/auth-services";
import UserServices from "../../services/user-services";

export class DeleteUsersHandler {
  static async handleDeleteUserSubmit(selectedData: (string | number)[]) {
    const body = {
      ids: selectedData
    }
    console.log(body)
    try {
      return (await UserServices.deleteUserByIds(body)).data;
    } catch (e) {
      throw e;
    }
  }
}