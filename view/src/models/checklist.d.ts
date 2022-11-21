import { GeneralData } from './general-data';

export type Checklist = GeneralData & {
  createdBy: string;
  createdAt: Date | string;
  lastModified: Date | string;
  status: string;
};
