import { users } from "../data/users";

export default class UserService {
  static getUsers(){
    return users;
  }

  static getOneUser(id: string|number){
    return users.find(user => (user.id as string) === (id as string));
  }
}