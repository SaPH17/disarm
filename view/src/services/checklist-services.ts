import axios from 'axios';

export default class ChecklistServices {
  static async getChecklists() {
    const { data } = await axios.get(
      `${import.meta.env.VITE_API_URL}/checklists/`,
      {
        withCredentials: true,
      }
    );
    return data.checklists;
  }
  static async getOneChecklist(id: string | number | undefined) {
    if (id === undefined) return null;
    const { data } = await axios.get(
      `${import.meta.env.VITE_API_URL}/checklists/${id}`,
      {
        withCredentials: true,
      }
    );
    return data.checklist;
  }

  static async createChecklist(body: object) {
    return axios.post(`${import.meta.env.VITE_API_URL}/checklists/`, body, {
      withCredentials: true,
    });
  }

  static async deleteChecklistByIds(body: object) {
    return axios.delete(`${import.meta.env.VITE_API_URL}/checklists/`, {
      withCredentials: true,
      data: body,
    });
  }

  static async editChecklist(body: object, id: string | number) {
    return axios.put(
      `${import.meta.env.VITE_API_URL}/checklists/${id}`,
      body,
      {
        withCredentials: true,
      }
    );
  }
}
