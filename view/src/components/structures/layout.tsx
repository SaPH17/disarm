import AuthorizedLayout from './authorized-layout';
import UnauthorizedLayout from './unauthorized-layout';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

export default function Layout({ children }: any) {
  let isLoggedIn: boolean = false;

  return (
    <div>
      {isLoggedIn ? <AuthorizedLayout children={ children }/> : <UnauthorizedLayout children={ children }/>}
      <ToastContainer />
    </div>
  );
}
