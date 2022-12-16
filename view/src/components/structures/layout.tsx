import AuthorizedLayout from './authorized-layout';
import UnauthorizedLayout from './unauthorized-layout';

export default function Layout({ children }: any) {
  let isLoggedIn: boolean = false;

  return (
    <div>
      {isLoggedIn ? <AuthorizedLayout children={ children }/> : <UnauthorizedLayout children={ children }/>}
    </div>
  );
}
