import axios from 'axios';

export default class ChecklistServices {
  static async getChecklists() {
    const { data } = await axios.get(
      `${process.env.REACT_APP_API_URL}/checklists/`,
      {
        withCredentials: true,
      }
    );
    return data.checklists;
  }
  static async getOneChecklist(id: string | number | undefined) {
    if (id === undefined) return null;
    const { data } = await axios.get(
      `${process.env.REACT_APP_API_URL}/checklists/${id}`,
      {
        withCredentials: true,
      }
    );
    return data.checklist;
  }

  static async createChecklist(body: object) {
    return axios.post(`${process.env.REACT_APP_API_URL}/checklists/`, body, {
      withCredentials: true,
    });
  }

  static async deleteChecklistByIds(body: object) {
    return axios.delete(`${process.env.REACT_APP_API_URL}/checklists/`, {
      withCredentials: true,
      data: body,
    });
  }

  static async editChecklist(body: object, id: string | number) {
    return axios.put(
      `${process.env.REACT_APP_API_URL}/checklists/${id}`,
      body,
      {
        withCredentials: true,
      }
    );
  }
}
