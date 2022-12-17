import SelectedDetail from '../../../components/selected-detail';
import PrimaryButton from '../../../components/primary-button';
import { useNavigate } from 'react-router-dom';
import ActionButton, {
  ActionButtonItem,
} from '../../../components/action-button';
import { Link } from 'react-router-dom';
import TableCheckbox from '../../../components/table-checkbox';
import { defaultChecklist } from '../../../data/default-values';
import { useState, useEffect } from 'react';
import ChecklistService from '../../../services/checklist-service';
import { Checklist } from '../../../models/checklist';

const items: ActionButtonItem[] = [
  {
    id: '1',
    name: 'Delete Checklist',
    url: '/',
  },
];

const title = ['name', 'lastModified', 'createdBy', 'status'];

const contentTitle = [
  'name',
  'status',
  'createdBy',
  'createdAt',
  'lastModified',
];

export default function ManageChecklistIndex() {
  const [checklists, setChecklists] = useState<Checklist[]>();
  const [selectedChecklist, setSelectedChecklist] = useState<Checklist[]>([
    // defaultChecklist,
  ]);
  const navigate = useNavigate();

  async function fetchChecklists() {
    const result = await ChecklistService.getChecklists();
    setChecklists(result);
  }

  useEffect(() => {
    fetchChecklists();
  }, []);

  return checklists ? (
    <>
      <div className="text-xl font-semibold">Manage Checklist</div>
      <div className="flex flex-row gap-2 sm:gap-4 justify-between">
        <Link to={'create'}>
          <PrimaryButton content="Create Checklist" />
        </Link>
        <ActionButton items={items} />
      </div>
      <div className="flex flex-col gap-1 sm:gap-2">
        <div className="text-lg font-semibold">Checklists</div>
        <TableCheckbox
          title={title}
          content={checklists as object[]}
          onCheckedFunction={(checklist: any) => {
            setSelectedChecklist([...selectedChecklist, checklist]);
          }}
          onUncheckedFunction={(checklist: any) => {
            setSelectedChecklist(
              selectedChecklist.filter((item) => item !== checklist)
            );
          }}
          onClickFunction={(checklist: any) => {
            navigate(`/checklists/${checklist.id}`);
          }}
        />
      </div>

      <SelectedDetail
        title={'Checklist Detail'}
        contentTitle={contentTitle}
        content={selectedChecklist[selectedChecklist.length - 1]}
      >
        <div className="flex items-center gap-4">
          <Link
            to={`/checklists/${
              selectedChecklist[selectedChecklist.length - 1].id
            }`}
            className={'underline'}
          >
            View Detail
          </Link>
          <Link to="/" className={'underline'}>
            Apply to Project
          </Link>
          <Link
            to={`/checklists/${
              selectedChecklist[selectedChecklist.length - 1].id
            }/edit`}
          >
            <PrimaryButton content="Edit" />
          </Link>
        </div>
      </SelectedDetail>
    </>
  ) : (
    <></>
  );
}
