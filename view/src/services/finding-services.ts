import axios from 'axios';

export default class FindingServices {
  static async createFinding(body: any) {
    console.log(body);
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
}
