import { atom } from "recoil";

export const user = atom<any|null>({
    key: "user",
    default: null
});