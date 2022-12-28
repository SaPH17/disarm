import FindingServices from '../../services/finding-services';

export class FindingHandler {
  static async handleCreateFindingFormSubmit(data: any) {
    try {
      return (await FindingServices.createFinding(data)).data;
    } catch (e) {
      throw e;
    }
  }

  static async handleEditFinding(id: any, data: any) {
    try {
      return (await FindingServices.editFinding(id, data)).data;
    } catch (e) {
      throw e;
    }
  }
}
