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
  updated_at: '-'
};

export const defaultGroup: Group = {
  id: -1,
  name: '-',
  description: '-',
  permissions: '-',
  directParentGroup: '-',
};

export const defaultUser: User = {
  id: -1,
  email: '-',
  username: '-',
  name: '-',
  direct_supervisor_id: {
    Valid: false,
    String: ''
  },
  groups: '-',
  assignedProjects: '-',
  directSupervisor: '-'
}

export const defaultChecklist = {
  id: -1,
  name: '-',
  createdBy: '-',
  createdAt: '-',
  lastModified: '-',
  status: '-',
  sections: [],
};
