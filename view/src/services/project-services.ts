import axios from "axios";

export default class ProjectServices {
  static async getProjects(){
    const {data} = await axios.get(`${process.env.REACT_APP_API_URL}/projects/`, {
      withCredentials: true
    });
    return data.projects;
  }

  static async getOneProject(id: any){
    const {data} = await axios.get(`${process.env.REACT_APP_API_URL}/projects/${id}`, {
      withCredentials: true
    });
    return data.project;
  }
}