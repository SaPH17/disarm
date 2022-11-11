import SelectedDetail from '../../../components/selected-detail';
import PrimaryButton from '../../../components/primary-button';
import ActionButton, {
  ActionButtonItem,
} from '../../../components/action-button';
import { useNavigate } from 'react-router-dom';
import TableCheckbox from '../../../components/table-checkbox';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const title = ['name', 'description'];

const content = [
  {
    id: 1,
    name: 'Role A',
    description: 'Role for admin',
    permissions: '- updateuser.*',
    directParentGroup: 'Role B',
  },
  {
    id: 2,
    name: 'Role B',
    description: 'Role for pentester',
    permissions: '- updateuser.*',
    directParentGroup: 'Role B',
  },
  {
    id: 3,
    name: 'Role C',
    description: 'Role for SysAdmin',
    permissions: '- updateuser.*',
    directParentGroup: 'Role B',
  },
  {
    id: 4,
    name: 'Role D',
    description: 'Role for others',
    permissions: '- updateuser.*',
    directParentGroup: 'Role B',
  },
];

const items: ActionButtonItem[] = [
  {
    id: '1',
    name: 'Delete Group',
    url: '/',
  },
  {
    id: '2',
    name: 'Assign User',
    url: '/',
  },
];

const contentTitle = [
  'name',
  'description',
  'permissions',
  'directParentGroup',
];

export default function ManageGroupIndex() {
  const [selectedGroup, setSelectedGroup] = useState<any[]>([
    {
      id: -1,
      name: '-',
      description: '-',
      permissions: '-',
      directParentGroup: '-',
    },
  ]);
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
        <TableCheckbox
          title={title}
          content={content}
          onCheckedFunction={(group: any) => {
            setSelectedGroup([...selectedGroup, group]);
          }}
          onUncheckedFunction={(group: any) => {
            setSelectedGroup(selectedGroup.filter((item) => item !== group));
          }}
          onClickFunction={(group: any) => {
            navigate(`/group/${group.id}`);
          }}
        />
      </div>

      <SelectedDetail
        title={'Group Detail'}
        contentTitle={contentTitle}
        content={selectedGroup[selectedGroup.length - 1]}
      >
        <Link to="/">
          <PrimaryButton content="Edit" />
        </Link>
      </SelectedDetail>
    </>
  );
}
