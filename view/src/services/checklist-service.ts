import { checklists } from '../data/checklist';

export default class ChecklistService {
  static getChecklists() {
    return checklists;
  }
}
