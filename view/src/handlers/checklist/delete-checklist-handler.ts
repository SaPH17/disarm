import ChecklistServices from '../../services/checklist-services';

export class DeleteChecklistsHandler {
  static async handleDeleteChecklistSubmit(selectedData: (string | number)) {
    const body = {
      id: selectedData,
    };
    try {
      return (await ChecklistServices.deleteChecklistByIds(body)).data;
    } catch (e) {
      throw e;
    }
  }
}
