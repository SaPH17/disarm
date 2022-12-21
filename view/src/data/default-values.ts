import { Group } from '../models/group';
import { Project } from '../models/project';
import { User } from '../models/user';

export const defaultProject: Project = {
  id: -1,
  name: '-',
  company: '-',
  phase: '-',
  report: '-',
  description: '-',
  created_at: '-',
  updated_at: '-',
};

export const defaultGroup: Group = {
  id: -1,
  name: '-',
  description: '-',
  permissions: '-',
  users: [],
  directParentGroup: '-',
};

export const defaultUser: User = {
  id: -1,
  email: '-',
  username: '-',
  name: '-',
  supervisor_id: '-',
  groups: '-',
  assignedProjects: '-',
  direct_supervisor: '-',
};

export const defaultChecklist = {
  id: -1,
  name: '-',
  created_at: '-',
  updated_at: '-',
  lastModified: '-',
  createdBy: '-',
  status: '-',
  sections: [],
  createdAt: '-',
};

export const defaultChecklistAccordion = {
  isEdited: true,
};
