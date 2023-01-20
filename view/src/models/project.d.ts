import { Checklist } from './checklist';
import { GeneralData } from './general-data';

export type Project = GeneralData & {
  company: string;
  phase: string;
  report: string;
  description: string;
  Checklist?: Checklist;
  start_date: Date;
  end_date: Date;
  created_at: Date | string;
  updated_at: Date | string;
  Findings?: any[];
};
