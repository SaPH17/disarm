import moment from 'moment';
import { ProjectFormData } from '../../models/forms/project-form-data';
import ProjectServices from '../../services/project-services';

export class UpdateProjectChecklistHandler {
  static async handleUpdateProjectChecklistFormSubmit(
    body: object,
    id: string | number
  ) {
    try {
      return (await ProjectServices.updateProjectChecklist(body, id)).data;
    } catch (e) {
      throw e;
    }
  }
}
