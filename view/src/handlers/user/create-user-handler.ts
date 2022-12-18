import { UserFormData } from "../../models/forms/user-form-data";
import AuthServices from "../../services/auth-services";
import UserServices from "../../services/user-services";

export class CreateUserHandler {
  static async handleCreateUserFormSubmit(data: UserFormData, selectedGroups: string[]) {
    const body = {
        ...data,
        groups: selectedGroups
    }
    try {
      const result = (await UserServices.createUser(body)).data;
      console.log(result);
      return result;
    } catch (e) {
      throw e;
    }
  }
}