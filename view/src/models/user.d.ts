import { GeneralData } from "./general-data";

export type User = GeneralData & {
  groups: string;
  status: string;
  assignedProjects: string;
  directSupervisor: string;
  job?: string;
  dateCreated?: string;
}