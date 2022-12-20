import { ProjectFormData } from "../../models/forms/project-form-data";
import ProjectServices from "../../services/project-services";

export class CreateProjectHandler {
  static async handleCreateProjectFormSubmit(data: ProjectFormData) {
    const body = {
        ...data,
    }
    try {
      return (await ProjectServices.createProject(body)).data;
    } catch (e) {
      throw e;
    }
  }
}