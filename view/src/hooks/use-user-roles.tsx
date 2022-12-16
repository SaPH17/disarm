import { useAtom } from 'jotai'
import authAtom from '../atoms/atom';

export function useUserRoles() {
   
    // some logic or api call to get the roles
    // for demonstration purposes it's just hard coded
    const userRoles: string[] = ['auth', 'guest'];

    // return the current user roles
    return userRoles;
}