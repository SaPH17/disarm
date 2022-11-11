import SelectedDetail from '../../../components/selected-detail';
import PrimaryButton from '../../../components/primary-button';
import ActionButton, {
  ActionButtonItem,
} from '../../../components/action-button';
import { Link, useNavigate } from 'react-router-dom';
import TableCheckbox from '../../../components/table-checkbox';
import { useState } from 'react';

const content = [
  {
    id: 1,
    name: 'Bambang',
    groups: 'Role A, Role B',
    status: 'Idle',
    assignedProjects: '-',
    directSupervisor: 'Memeng',
  },
  {
    id: 2,
    name: 'Mamang',
    groups: 'Role B',
    status: 'Idle',
    assignedProjects: '-',
    directSupervisor: 'Memeng',
  },
  {
    id: 3,
    name: 'Memeng',
    groups: 'Role A',
    status: 'Review',
    assignedProjects: '-',
    directSupervisor: '-',
  },
  {
    id: 4,
    name: 'Revaldi',
    groups: 'Role B',
    status: 'Review',
    assignedProjects: '-',
    directSupervisor: 'Memeng',
  },
];

const title = ['name', 'groups', 'status'];

const contentTitle = [
  'name',
  'status',
  'groups',
  'assignedProjects',
  'directSupervisor',
];

export default function ManageUserIndex() {
  const [selectedUser, setSelectedUser] = useState<any[]>([
    {
      id: -1,
      name: '-',
      status: '-',
      groups: '-',
      assignedProjects: '-',
      directSupervisor: '-',
    },
  ]);
  const navigate = useNavigate();
  const items: ActionButtonItem[] = [
    {
      id: '1',
      name: 'Edit User',
      url: `/`,
    },
    {
      id: '2',
      name: 'Delete User',
      url: '/',
    },
    {
      id: '3',
      name: 'Add Group',
      url: '/',
    },
    {
      id: '4',
      name: 'Assign Project',
      url: '/',
    },
    {
      id: '5',
      name: 'View All Project',
      url: '/',
    },
  ];

  return (
    <>
      <div className="text-xl font-semibold">Manage User</div>
      <div className="flex flex-row gap-2 sm:gap-4 justify-between">
        <Link to="/users/create">
          <PrimaryButton content="Create User" />
        </Link>

        <ActionButton items={items} />
      </div>

      <div className="flex flex-col gap-1 sm:gap-2">
        <div className="text-lg font-semibold">Users</div>
        <TableCheckbox
          title={title}
          content={content}
          onCheckedFunction={(user: any) => {
            setSelectedUser([...selectedUser, user]);
          }}
          onUncheckedFunction={(user: any) => {
            setSelectedUser(selectedUser.filter((item) => item !== user));
          }}
          onClickFunction={(user: any) => {
            navigate(`/users/${user.id}`);
          }}
        />
      </div>

      <SelectedDetail
        title={'User Detail'}
        contentTitle={contentTitle}
        content={selectedUser[selectedUser.length - 1]}
      >
        <div className="flex items-center gap-4">
          <div>
            <Link to="/" className={'underline'}>
              View All Report
            </Link>
          </div>
          <div>
            <Link to="/">
              <PrimaryButton content="Edit" />
            </Link>
          </div>
        </div>
      </SelectedDetail>
    </>
  );
}
