import UserServices from '../../services/user-services';

export class DeleteUsersHandler {
  static async handleDeleteUserSubmit(selectedData: (string | number)) {
    const body = {
      id: selectedData,
    };
    try {
      return (await UserServices.deleteUserByIds(body)).data;
    } catch (e) {
      throw e;
    }
  }
}
