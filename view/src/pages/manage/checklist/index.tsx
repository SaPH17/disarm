import Table from '../../../components/table';
import SelectedDetail from '../../../components/selected-detail';
import PrimaryButton from '../../../components/primary-button';
import { useNavigate } from 'react-router-dom';
import ActionButton, {
  ActionButtonItem,
} from '../../../components/action-button';

const content = [
  {
    id: 1,
    name: 'Checklist A',
    lastModified: '18/10/2022',
    createdBy: 'Bambang',
    status: 'Inactive',
  },
  {
    id: 2,
    name: 'Checklist B',
    lastModified: '18/10/2022',
    createdBy: 'Bambang',
    status: 'Inactive',
  },
  {
    id: 3,
    name: 'Checklist C',
    lastModified: '18/10/2022',
    createdBy: 'Bambang',
    status: 'Active',
  },
  {
    id: 4,
    name: 'Checklist D',
    lastModified: '18/10/2022',
    createdBy: 'Bambang',
    status: 'Active',
  },
];

const items: ActionButtonItem[] = [
  {
    id: '1',
    name: 'Edit Group',
    url: '/',
  },
  {
    id: '2',
    name: 'Delete Group',
    url: '/',
  },
  {
    id: '3',
    name: 'Assign User',
    url: '/',
  },
];

const title = ['id', 'name', 'lastModified', 'createdBy', 'status'];

const contentTitle = [
  'id',
  'name',
  'status',
  'createdBy',
  'createdAt',
  'lastModified',
];
const contentData = {
  id: 1,
  name: 'Bambang',
  createdBy: 'Bambang',
  createdAt: '18/10/2022',
  lastModified: '18/10/2022',
  status: 'Active',
};

export default function ManageChecklistIndex() {
  const navigate = useNavigate();

  return (
    <>
      <div className="text-xl font-semibold">Manage Checklist</div>
      <div className="flex flex-row gap-2 sm:gap-4 justify-between">
        <PrimaryButton content="Create Checklist" />
        <ActionButton items={items} />
      </div>
      <div className="flex flex-col gap-1 sm:gap-2">
        <div className="text-lg font-semibold">Checklists</div>
        <Table
          title={title}
          content={content}
          isClickable={true}
          onClickFunction={(checklist: any) => {
            navigate(`/checklist/${checklist.id}`);
          }}
        />
      </div>

      <SelectedDetail
        title={'Group Detail'}
        contentTitle={contentTitle}
        content={contentData}
      />
    </>
  );
}
