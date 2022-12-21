import ChecklistServices from "../../services/checklist-services";
import UserServices from "../../services/user-services";

export class DeleteChecklistsHandler {
  static async handleDeleteChecklistSubmit(selectedData: (string | number)[]) {
    const body = {
      ids: selectedData
    }
    try {
      return (await ChecklistServices.deleteChecklistByIds(body)).data;
    } catch (e) {
      throw e;
    }
  }
}