import axios from 'axios';

export default class ReportServices {
  static async generateReport(id: string | number) {
    return axios.post(`${import.meta.env.VITE_API_URL}/reports/${id}`);
  }
}
