import { GroupFormData } from '../../models/forms/group-form-data';
import GroupServices from '../../services/group-services';

export class GroupHandler {
  static async handleCreateGroupFormSubmit(
    data: GroupFormData,
    assignedUser: string[]
  ) {
    const body = {
      ...data,
      assigned_user: assignedUser,
      permissions: '{}',
    };
    try {
      return (await GroupServices.createGroup(body)).data;
    } catch (e) {
      throw e;
    }
  }

  static async handleDeleteGroupSubmit(selectedData: (string | number)) {
    const body = {
      id: selectedData,
    };
    try {
      return (await GroupServices.deleteGroupByIds(body)).data;
    } catch (e) {
      throw e;
    }
  }

  static async handleEditGroupFormSubmit(
    id: string | number,
    data: GroupFormData,
    assignedUser: string[]
  ) {
    const body = {
      name: data.name,
      description: data.description,
      assigned_user: assignedUser,
    };
    try {
      return (await GroupServices.editGroup(id, body)).data;
    } catch (e) {
      throw e;
    }
  }

  static async handleEditGroupPermissionSubmit(
    id: string | number,
    permissions: string
  ) {
    const body = {
      permissions: permissions,
    };
    try {
      return (await GroupServices.editGroupPermissions(id, body)).data;
    } catch (e) {
      throw e;
    }
  }

  static async handleAddUserToGroup(userIds: any, groupIds: any) {
    const body = {
      user_ids: userIds,
      group_ids: groupIds,
    };
    try {
      return (await GroupServices.addUserToGroup(body)).data;
    } catch (e) {
      throw e;
    }
  }
}
