import { GeneralData } from './general-data';

export type Project = GeneralData & {
  company: string;
  checklist: string;
  phase: string;
  report: string;
  description: string;
  assignedUser?: string;
};
