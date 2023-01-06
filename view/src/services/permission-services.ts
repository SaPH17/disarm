import axios from 'axios';

export default class PermissionServices {
  static async getPermissions() {
    const { data } = await axios.get(
      `${import.meta.env.VITE_API_URL}/permissions/`,
      {
        withCredentials: true,
      }
    );
    return data.permissions;
  }
}
