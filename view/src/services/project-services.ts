import axios from 'axios';
import { toast } from 'react-toastify';

export default class ProjectServices {
  static async getProjects() {
    const { data } = await axios.get(
      `${import.meta.env.VITE_API_URL}/projects/`,
      {
        withCredentials: true,
      }
    );
    return data.projects;
  }

  static async getOneProject(id: any) {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/projects/${id}`,
        {
          withCredentials: true,
        }
      );
      return data.project;
    } catch (e) {
      return null;
    }
  }

  static async deleteProjectByIds(body: object) {
    return axios.delete(`${import.meta.env.VITE_API_URL}/projects/`, {
      withCredentials: true,
      data: body,
    });
  }

  static async createProject(body: object) {
    return axios.post(`${import.meta.env.VITE_API_URL}/projects/`, body, {
      withCredentials: true,
    });
  }

  static async updateProject(body: object, id: string | number) {
    return axios.put(`${import.meta.env.VITE_API_URL}/projects/${id}`, body, {
      withCredentials: true,
    });
  }

  static async updateProjectChecklist(body: object, id: string | number) {
    return axios.put(`${import.meta.env.VITE_API_URL}/projects/${id}/checklist`, body, {
      withCredentials: true,
    });
  }
}
