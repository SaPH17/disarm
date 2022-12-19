import { GeneralData } from "./general-data";
import { Group } from "./group";

export type User = GeneralData & {
  groups: string;
  assignedProjects: string;
  direct_supervisor_id: UserSupervisor;
  job?: string;
  created_at?: Date;
  email: string;
  username: string;
  directSupervisor?: string;
  Groups? : Group[];
}

export type UserSupervisor = {
  String: string;
  Valid: boolean;
}