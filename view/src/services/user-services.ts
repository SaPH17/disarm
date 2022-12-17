import { users } from '../data/users';
import axios from 'axios';

export default class UserServices {
  static async getUsers() {
    const {data} = await axios.get(`${process.env.REACT_APP_API_URL}/users/`, {
      withCredentials: true
    });
    return data.users;
  }

  static getOneUser(id: string | number) {
    return users.find((user) => (user.id as string) === (id as string));
  }
}
