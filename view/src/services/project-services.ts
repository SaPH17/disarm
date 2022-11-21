import { projects } from "../data/projects";

export default class ProjectServices {
  static getProjects(){
    return projects;
  }

  static getOneProject(id: string|number){
    return projects.find(project => (project.id as string) === (id as string));
  }
}