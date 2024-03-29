import axios from 'axios';

export default class GroupServices {
  static async getGroups() {
    const { data } = await axios.get(
      `${import.meta.env.VITE_API_URL}/groups/`,
      {
        withCredentials: true,
      }
    );
    return data.groups;
  }

  static async getOneGroup(id: string | number | undefined) {
    if (id === undefined) return;
    const { data } = await axios.get(
      `${import.meta.env.VITE_API_URL}/groups/${id}`,
      {
        withCredentials: true,
      }
    );
    return data.group;
  }

  static async createGroup(body: object) {
    return axios.post(`${import.meta.env.VITE_API_URL}/groups/`, body, {
      withCredentials: true,
    });
  }

  static async deleteGroupByIds(body: object) {
    return axios.delete(`${import.meta.env.VITE_API_URL}/groups/`, {
      withCredentials: true,
      data: body,
    });
  }

  static async editGroup(id: string | number, body: object) {
    return axios.put(`${import.meta.env.VITE_API_URL}/groups/${id}`, body, {
      withCredentials: true,
    });
  }

  static async editGroupPermissions(id: string | number, body: object) {
    return axios.put(
      `${import.meta.env.VITE_API_URL}/groups/${id}/permissions`,
      body,
      {
        withCredentials: true,
      }
    );
  }

  static async addUserToGroup(body: object) {
    return axios.post(
      `${import.meta.env.VITE_API_URL}/groups/assign-user`,
      body,
      {
        withCredentials: true,
      }
    );
  }
}
