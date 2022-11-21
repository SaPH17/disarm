import { permissions } from "../data/permissions";

export default class PermissionServices{
    static getPermissions(){
        return permissions;
    }
}