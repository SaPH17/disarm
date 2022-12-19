import { GroupFormData } from '../../models/forms/group-form-data';
import GroupServices from '../../services/group-services';

export class GroupHandler {
  static async handleCreateGroupFormSubmit(
    data: GroupFormData,
    assignedUser: string[]
  ) {
    const body = {
      ...data,
      assignedUser: assignedUser,
      permissions: '-',
    };
    try {
      return (await GroupServices.createGroup(body)).data;
    } catch (e) {
      throw e;
    }
  }

  static async handleDeleteGroupSubmit(selectedData: (string | number)[]) {
    const body = {
      ids: selectedData,
    };
    try {
      return (await GroupServices.deleteUserByIds(body)).data;
    } catch (e) {
      throw e;
    }
  }

  static async handleEditGroupSubmit(
    id: string | number,
    data: GroupFormData,
    assignedUser: string[]
  ) {
    const body = {
      name: data.name,
      description: data.description,
      parent_group_id: data.parentGroup,
      assigned_user: assignedUser,
    };
    console.log(body);
    try {
      return (await GroupServices.editGroup(id, body)).data;
    } catch (e) {
      throw e;
    }
  }
}
