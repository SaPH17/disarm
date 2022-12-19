import { GeneralData } from "./general-data";
import { Group } from "./group";

export type User = GeneralData & {
  groups: string;
  assignedProjects: string;
  supervisor_id: string;
  job?: string;
  created_at?: Date;
  email: string;
  username: string;
  direct_supervisor?: string;
  Groups? : Group[];
  Supervisor? : User;
}

export type UserSupervisor = {
  String: string;
  Valid: boolean;
}