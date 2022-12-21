import axios from 'axios';
import { checklists } from '../data/checklist';

export default class ChecklistServices {
  static async getChecklists() {
    const {data} = await axios.get(`${process.env.REACT_APP_API_URL}/checklists/`, {
      withCredentials: true
    });
    return data.checklists;
  }
  static getOneChecklist(id: string | number) {
    return checklists.find(
      (checklist) => (checklist.id as string) === (id as string)
    );
  }

  static async createChecklist(body: object){
    return axios.post(`${process.env.REACT_APP_API_URL}/checklists/`, body, {
      withCredentials: true
    });
  }
}
