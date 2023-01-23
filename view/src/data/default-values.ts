import { Group } from '../models/group';
import { Project } from '../models/project';
import { User } from '../models/user';

export const defaultProject: Project = {
  id: '-',
  name: '-',
  company: '-',
  phase: '-',
  report: '-',
  description: '-',
  created_at: '-',
  updated_at: '-',
  projectPercentage: 0
};

export const defaultGroup: Group = {
  id: '-',
  name: '-',
  description: '-',
  permissions: '-',
  users: [],
};

export const defaultUser: User = {
  id: '-',
  email: '-',
  username: '-',
  name: '-',
  supervisor_id: '-',
  groups: '-',
  assignedProjects: '-',
  direct_supervisor: '-',
};

export const defaultChecklist = {
  id: '-',
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
