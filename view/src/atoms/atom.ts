import { atom } from 'jotai';
import Cookies from 'universal-cookie';

const cookies = new Cookies();
const authCookies = cookies.get('auth');

const authAtom = atom(
  (new Date(authCookies?.expires) > new Date() && (authCookies?.is_password_changed === undefined ? true : authCookies?.is_password_changed) && cookies.get('auth') ) || null
);

export default authAtom;
