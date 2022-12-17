import axios from 'axios';
import { groups } from '../data/groups';

export default class GroupServices {
  static async getGroups() {
    const {data} = await axios.get(`${process.env.REACT_APP_API_URL}/groups/`, {
      withCredentials: true
    });
    return data.groups;  
  }

  static getOneGroup(id: string | number) {
    return groups.find((group) => (group.id as string) === (id as string));
  }
}
