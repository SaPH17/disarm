import { GeneralData } from "./general-data";

export type Group = GeneralData & {
  description: string;
  permissions: string;
  directParentGroup: string;
}