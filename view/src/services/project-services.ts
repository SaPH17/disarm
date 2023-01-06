import axios from 'axios';

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
    const { data } = await axios.get(
      `${import.meta.env.VITE_API_URL}/projects/${id}`,
      {
        withCredentials: true,
      }
    );
    return data.project;
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
}
