import AuthorizedLayout from './authorized-layout';
import UnauthorizedLayout from './unauthorized-layout';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { useAtom } from 'jotai';
import authAtom from '../../atoms/atom';

export default function Layout({ children }: any) {
  const [auth, setAuth] = useAtom(authAtom);

  return (
    <div>
      {auth ? <AuthorizedLayout children={ children }/> : <UnauthorizedLayout children={ children }/>}
      <ToastContainer />
    </div>
  );
}
