import axios from 'axios';

export default class GroupServices {
  static async getGroups() {
    const {data} = await axios.get(`${process.env.REACT_APP_API_URL}/groups/`, {
      withCredentials: true
    });
    return data.groups;  
  }

  static async getOneGroup(id: string | number | undefined) {
    if (id === undefined) return;
    const {data} = await axios.get(`${process.env.REACT_APP_API_URL}/groups/${id}`, {
      withCredentials: true
    });
    return data.group;
  }
}
