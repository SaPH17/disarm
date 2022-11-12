import { GeneralData } from "./general-data";

export type Permission = GeneralData & {
    category: string;
    description: string;
}
