import moment from 'moment';
import { ProjectFormData } from '../../models/forms/project-form-data';
import ProjectServices from '../../services/project-services';

export class UpdateProjectHandler {
  static async handleUpdateProjectFormSubmit(
    data: ProjectFormData,
    id: string | number
  ) {
    const body = {
      ...data,
      start_date: moment(data.startDate).format('YYYY-MM-DD'),
      end_date: moment(data.endDate).format('YYYY-MM-DD'),
    };
    try {
      return (await ProjectServices.updateProject(body, id)).data;
    } catch (e) {
      throw e;
    }
  }
}
