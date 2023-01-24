import ReportServices from '../../services/report-services';

export class GenerateReportHandler {
  static async handleGenerateReport(id: string | number) {
    try {
      return (await ReportServices.generateReport(id)).data;
    } catch (e) {
      throw e;
    }
  }
}
