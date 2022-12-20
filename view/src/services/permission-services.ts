import axios from 'axios';

export default class PermissionServices {
  static async getPermissions() {
    const { data } = await axios.get(
      `${process.env.REACT_APP_API_URL}/permissions/`,
      {
        withCredentials: true,
      }
    );
    return data.permissions;
  }
}
