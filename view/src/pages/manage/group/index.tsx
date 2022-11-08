import Table from '../../../components/table';
import SelectedDetail from '../../../components/selected-detail';
import PrimaryButton from '../../../components/primary-button';
import ActionButton, {
  ActionButtonItem,
} from '../../../components/action-button';
import { useNavigate } from 'react-router-dom';

const content = [
  {
    id: 1,
    name: 'Role A',
    description: 'Role for admin',
  },
  {
    id: 2,
    name: 'Role B',
    description: 'Role for pentester',
  },
  {
    id: 3,
    name: 'Role C',
    description: 'Role for SysAdmin',
  },
  {
    id: 4,
    name: 'Role D',
    description: 'Role for others',
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

const title = ['name', 'description'];

const contentTitle = [
  'name',
  'description',
  'permissions',
  'directParentGroup',
];
const contentData = {
  name: 'Role A',
  description: 'Role for admin',
  Permissions: '- updateuser.*',
  directParentGroup: 'Role B',
};

export default function ManageGroupIndex() {
  const navigate = useNavigate();

  return (
    <>
      <div className="text-xl font-semibold">Manage Group</div>
      <div className="flex flex-row gap-2 sm:gap-4 justify-between">
        <PrimaryButton content="Create Group" />
        <ActionButton items={items} />
      </div>

      <div className="flex flex-col gap-1 sm:gap-2">
        <div className="text-lg font-semibold">Groups</div>
        <Table
          title={title}
          content={content}
          isClickable={true}
          onClickFunction={(group: any) => {
            navigate(`/manage/group/${group.id}`);
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
