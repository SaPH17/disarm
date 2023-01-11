import { GeneralData } from './general-data';
import { User } from './user';

export type Group = GeneralData & {
  description: string;
  permissions: string;
  users: User[];
  Users?: User[];
};
