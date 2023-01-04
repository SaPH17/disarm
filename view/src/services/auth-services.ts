import axios from 'axios';

export default class AuthServices {
  static login(body: object) {
    return axios.post(`${process.env.REACT_APP_API_URL}/auth/login`, body, {
      withCredentials: true,
    });
  }

  static checkLogin() {
    return axios.get(`${process.env.REACT_APP_API_URL}/auth/check-login`, {
      withCredentials: true,
    });
  }

  static logout() {
    return axios.post(`${process.env.REACT_APP_API_URL}/auth/logout`, {
      withCredentials: true,
    });
  }

  static changePassword(body: object){
    return axios.patch(`${process.env.REACT_APP_API_URL}/auth/change-password`, body, {
      withCredentials: true,
    })
  }
}
