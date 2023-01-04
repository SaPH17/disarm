import { ChecklistFormData } from '../../models/forms/checklist-form-data';
import ChecklistServices from '../../services/checklist-services';

export class EditChecklistHandler {
  static async handleEditChecklistFormSubmit(
    data: ChecklistFormData,
    sections: string,
    id: string | number
  ) {
    const body = {
      name: data.name,
      sections: sections,
    };
    try {
      return (await ChecklistServices.editChecklist(body, id)).data;
    } catch (e) {
      throw e;
    }
  }
}
