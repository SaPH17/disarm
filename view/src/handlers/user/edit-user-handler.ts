import { UserFormData } from "../../models/forms/user-form-data";
import UserServices from "../../services/user-services";

export class EditUserHandler {
  static async handleEditUserFormSubmit(data: UserFormData, id: string | number) {
    const body = {
        ...data
    }
    try {
      return (await UserServices.editUser(body, id)).data;
    } catch (e) {
      throw e;
    }
  }
}