import axios from 'axios';

export default class GroupServices {
  static async getGroups() {
    const { data } = await axios.get(
      `${process.env.REACT_APP_API_URL}/groups/`,
      {
        withCredentials: true,
      }
    );
    return data.groups;
  }

  static async getOneGroup(id: string | number | undefined) {
    if (id === undefined) return;
    const { data } = await axios.get(
      `${process.env.REACT_APP_API_URL}/groups/${id}`,
      {
        withCredentials: true,
      }
    );
    return data.group;
  }

  static async createGroup(body: object) {
    return axios.post(`${process.env.REACT_APP_API_URL}/groups/`, body, {
      withCredentials: true,
    });
  }

  static async deleteUserByIds(body: object) {
    return axios.delete(`${process.env.REACT_APP_API_URL}/groups/`, {
      withCredentials: true,
      data: body,
    });
  }

  static async editGroup(id: string | number, body: object) {
    return axios.put(`${process.env.REACT_APP_API_URL}/groups/${id}`, body, {
      withCredentials: true,
    });
  }

  static async editGroupPermissions(id: string | number, body: object) {
    return axios.put(
      `${process.env.REACT_APP_API_URL}/groups/${id}/permissions`,
      body,
      {
        withCredentials: true,
      }
    );
  }
}
