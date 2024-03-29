export type ChecklistFormData = {
  name?: string;
  section?: string;
  isSubmit?: boolean;
  status?: string;
};

export type ChecklistSectionFormData = {
  name: string;
  details: ChecklistDetailFormData[];
};

export type ChecklistDetailFormData = {
  id: string;
  detail: string;
  tool: string;
  procedure: string;
};
