import { Group } from "../models/group";
import { Project } from "../models/project";
import { User } from "../models/user";

export const defaultProject : Project = {
  id: -1,
  name: '-',
  company: '-',
  checklist: '-',
  status: '-',
  phase: '-',
  report: '-',
  description: '-',
  assignedUser: '-'
}

export const defaultGroup: Group = {
  id: -1,
  name: '-',
  description: '-',
  permissions: '-',
  directParentGroup: '-',
}

export const defaultUser : User = {
  id: -1,
  name: '-',
  status: '-',
  groups: '-',
  assignedProjects: '-',
  directSupervisor: '-',
}