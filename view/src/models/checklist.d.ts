import { GeneralData } from './general-data';

export type Checklist = GeneralData & {
  createdBy: string;
  createdAt: Date | string;
  lastModified: Date | string;
  status: string;
  sections: ChecklistSection[];
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
