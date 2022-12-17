import { GeneralData } from "./general-data";

export type User = GeneralData & {
  groups: string;
  assignedProjects: string;
  direct_supervisor_id: UserSupervisor;
  job?: string;
  created_at?: Date;
  email: string;
  username: string;
  directSupervisor?: string;
}

export type UserSupervisor = {
  String: string;
  Valid: boolean;
}