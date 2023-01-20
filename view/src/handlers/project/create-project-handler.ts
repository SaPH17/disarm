import moment from 'moment';
import { ProjectFormData } from '../../models/forms/project-form-data';
import ProjectServices from '../../services/project-services';

export class CreateProjectHandler {
  static async handleCreateProjectFormSubmit(data: ProjectFormData) {
    const body = {
      ...data,
      start_date: moment(data.startDate).format('YYYY-MM-DD'),
      end_date: moment(data.endDate).format('YYYY-MM-DD'),
    };
    try {
      return (await ProjectServices.createProject(body)).data;
    } catch (e) {
      throw e;
    }
  }
}
