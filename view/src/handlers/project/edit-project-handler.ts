import { ProjectFormData } from '../../models/forms/project-form-data';
import ProjectServices from '../../services/project-services';

export class UpdateProjectHandler {
  static async handleUpdateProjectFormSubmit(
    data: ProjectFormData,
    id: string | number
  ) {
    const body = {
      ...data,
    };
    try {
      return (await ProjectServices.updateProject(body, id)).data;
    } catch (e) {
      throw e;
    }
  }
}
