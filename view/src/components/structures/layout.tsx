import AuthorizedLayout from './authorized-layout';
import UnauthorizedLayout from './unauthorized-layout';

export default function Example({ children }: any) {
  let isLoggedIn: boolean = true;

  return (
    <div>
      {isLoggedIn ? <AuthorizedLayout children={ children }/> : <UnauthorizedLayout children={ children }/>}
    </div>
  );
}
