import axios from 'axios';

export default class FindingServices {
  static async createFinding(body: any) {
    return await axios.post(
      `${process.env.REACT_APP_API_URL}/findings/`,
      body,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      }
    );
  }

  static async editFinding(id: any, body: any) {
    return await axios.put(
      `${process.env.REACT_APP_API_URL}/findings/${id}`,
      body,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      }
    );
  }

  static async getOneFinding(id: string | number | undefined) {
    if (id === undefined) return;
    const { data } = await axios.get(
      `${process.env.REACT_APP_API_URL}/findings/${id}`,
      {
        withCredentials: true,
      }
    );
    return data.finding;
  }
}
