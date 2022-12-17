import { GeneralData } from './general-data';
import { User } from './user';

export type Checklist = GeneralData & {
  created_at: Date | string;
  updated_at: Date | string;
  status: string;
  sections: ChecklistSection[] | string;
  User?: User;
};

export type ChecklistSection = {
  name: string;
  details: ChecklistSectionDetail[];
};

export type ChecklistSectionDetail = {
  id: string;
  detail: string;
  tool: string;
  procedure: string;
};
