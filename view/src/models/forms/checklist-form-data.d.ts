
export type ChecklistFormData = {
    id: string|number;
    name: string;
    createdAt: Date;
    lastModified: Date;
    createdBy: string;
    status: string;
    sections: ChecklistSectionFormData[];
  };

export type ChecklistSectionFormData = {
    name: string;
    details: ChecklistDetailFormData[];
}

export type ChecklistDetailFormData = {
    id: string;
    detail: string;
    tool: string;
    procedure: string;
}