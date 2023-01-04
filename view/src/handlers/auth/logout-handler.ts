import Cookies from 'universal-cookie';
import AuthServices from '../../services/auth-services';

export class LogoutHandlers {
  static async handleLogout() {
    try {
      // const result = (await AuthServices.logout()).data;
      this.removeCookie();
      // return result;
    } catch (e) {
      throw e;
    }
  }

  static removeCookie() {
    const expiredDate = new Date();
    expiredDate.setDate(expiredDate.getDate() - 1);
    const cookies = new Cookies();
    cookies.remove('auth', { path: '/' });
  }
}
