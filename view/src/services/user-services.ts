import axios from 'axios';

export default class UserServices {
  static async getUsers() {
    const { data } = await axios.get(
      `${process.env.REACT_APP_API_URL}/users/`,
      {
        withCredentials: true,
      }
    );
    return data.users;
  }

  static async getOneUser(id: string | number | undefined) {
    if (id === undefined) return null;
    const { data } = await axios.get(
      `${process.env.REACT_APP_API_URL}/users/${id}`,
      {
        withCredentials: true,
      }
    );
    return data.user;
  }

  static async createUser(body: object) {
    return axios.post(`${process.env.REACT_APP_API_URL}/users/`, body, {
      withCredentials: true,
    });
  }

  static async editUser(body: object, id: string | number) {
    return axios.put(`${process.env.REACT_APP_API_URL}/users/${id}`, body, {
      withCredentials: true,
    });
  }

  static async deleteUserByIds(body: object) {
    return axios.delete(`${process.env.REACT_APP_API_URL}/users/`, {
      withCredentials: true,
      data: body,
    });
  }

  static async resetPassword(id: string | number | undefined) {
    return axios.patch(
      `${process.env.REACT_APP_API_URL}/users/${id}/reset-password`,
      {
        withCredentials: true,
      }
    );
  }
}
