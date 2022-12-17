import { users } from '../data/users';
import axios from 'axios';

export default class UserServices {
  static async getUsers() {
    const {data} = await axios.get(`${process.env.REACT_APP_API_URL}/users/`, {
      withCredentials: true
    });
    return data.users;
  }

  static async getOneUser(id: string | number | undefined) {
    if (id === undefined) return null;
    const {data} = await axios.get(`${process.env.REACT_APP_API_URL}/users/${id}`, {
      withCredentials: true
    });
    return data.user;
  }
}
