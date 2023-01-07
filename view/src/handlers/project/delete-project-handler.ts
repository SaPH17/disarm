import ProjectServices from '../../services/project-services';

export class DeleteProjectsHandler {
  static async handleDeleteProjectSubmit(selectedData: (string | number)[]) {
    const body = {
      ids: selectedData,
    };
    try {
      return (await ProjectServices.deleteProjectByIds(body)).data;
    } catch (e) {
      throw e;
    }
  }
}
