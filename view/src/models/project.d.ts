import { GeneralData } from "./general-data"

export type Project = GeneralData & {
  company: string;
  standard: string;
  status: string;
  phase: string;
  report: string;
  assignedUser?: string;
}