import { checklists } from '../data/checklist';

export default class ChecklistService {
  static getChecklists() {
    return checklists;
  }
  static getOneChecklist(id: string | number) {
    return checklists.find(
      (checklist) => (checklist.id as string) === (id as string)
    );
  }
}
