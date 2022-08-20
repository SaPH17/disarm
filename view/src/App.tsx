import { useRecoilState } from "recoil";
import { user as userAtom } from './states/atoms';

function App() {
  const [user, setUser] = useRecoilState(userAtom);
  return (
    <div className="text-red-500">Hello World</div>
  );
}

export default App;
