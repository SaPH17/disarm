import { FindingFormData } from '../../models/forms/finding-form-data';
import FindingServices from '../../services/finding-services';

export class FindingHandler {
  static async handleCreateFindingFormSubmit(data: any) {
    console.log(data);
    try {
      return (await FindingServices.createFinding(data)).data;
    } catch (e) {
      throw e;
    }
  }
}
