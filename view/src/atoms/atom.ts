import { atom } from "jotai";
import Cookies from "universal-cookie";

const cookies = new Cookies();
const authCookies = cookies.get('auth');
console.log();

const authAtom = atom((new Date(authCookies?.expires) > new Date() && cookies.get('auth')) || null);

export default authAtom;