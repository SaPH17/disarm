import { groups } from "../data/groups";

export default class GroupServices {
  static getGroups(){
    return groups;
  }

  static getOneGroup(id: string|number){
    return groups.find(group => (group.id as string) === (id as string));
  }
}