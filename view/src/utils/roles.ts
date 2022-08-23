import { useRecoilState } from "recoil";
import { user as userAtom } from "../states/atoms";

function useRoleStatus(){
    const [user, setUser] = useRecoilState(userAtom);

    if (user === null) return "guest";
    
    return "";
}

export { useRoleStatus }