import { UserFormData } from '../../models/forms/user-form-data';
import UserServices from '../../services/user-services';

export class CreateUserHandler {
  static async handleCreateUserFormSubmit(
    data: UserFormData,
    selectedGroups: string[]
  ) {
    const body = {
      ...data,
      groups: selectedGroups,
    };
    try {
      return (await UserServices.createUser(body)).data;
    } catch (e) {
      throw e;
    }
  }
}
