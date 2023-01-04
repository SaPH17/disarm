import { useAtom } from 'jotai';
import { Navigate, Outlet } from 'react-router-dom';
import authAtom from '../../atoms/atom';

export function RolesAuthRoute({ roles }: { roles: string[] }) {
  const [auth, setAuth] = useAtom(authAtom);

  const canAccess = roles.includes(auth ? 'auth' : 'guest');

  return canAccess ? (
    <Outlet />
  ) : (
    <Navigate to={!canAccess && auth ? '/' : '/auth/login'} />
  );
}
