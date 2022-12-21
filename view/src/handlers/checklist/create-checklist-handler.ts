import { ChecklistFormData } from "../../models/forms/checklist-form-data";
import ChecklistServices from "../../services/checklist-services";


export class CreateChecklistHandler {
  static async handleCreateChecklistFormSubmit(data: ChecklistFormData, sections: string) {
    const body = {
        name: data.name,
        sections: sections
    }
    try {
      return (await ChecklistServices.createChecklist(body)).data;
    } catch (e) {
      throw e;
    }
  }
}