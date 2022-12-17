import { useState } from 'react';
import { useQuery } from 'react-query';
import { Link, useNavigate } from 'react-router-dom';
import ActionButton, {
  ActionButtonItem,
} from '../../../components/action-button';
import PrimaryButton from '../../../components/primary-button';
import SelectedDetail from '../../../components/selected-detail';
import TableCheckbox from '../../../components/table-checkbox';
import { defaultUser } from '../../../data/default-values';
import { User } from '../../../models/user';
import UserServices from '../../../services/user-services';

const title = ['name', 'groups'];

const contentTitle = [
  'name',
  'groups',
  'assignedProjects',
  'email',
  'directSupervisor',
];

export default function ManageUserIndex() {
  const { data } = useQuery('users', UserServices.getUsers);
  const users =
    data?.map((r: User) => ({
      id: r.id,
      email: r.email,
      name: r.username,
      directSupervisor: (r.direct_supervisor_id as any).Valid
        ? r.direct_supervisor_id.String
        : '-',
      groups: 'Group A',
      assignedProjects: '-',
    })) || [];

  const [selectedUser, setSelectedUser] = useState<User[]>([
    {
      ...defaultUser,
    },
  ]);
  const navigate = useNavigate();
  const items: ActionButtonItem[] = [
    {
      id: '1',
      name: 'Delete User',
      url: '/',
    },
    {
      id: '2',
      name: 'Add to Group',
      url: '/',
    },
    {
      id: '3',
      name: 'Assign to Project',
      url: '/',
    },
  ];

  return (
    <>
      <div className="text-xl font-semibold">Manage User</div>
      <div className="flex flex-row justify-between gap-2 sm:gap-4">
        <Link to="/users/create">
          <PrimaryButton content="Create User" />
        </Link>

        <ActionButton items={items} />
      </div>

      <div className="flex flex-col gap-1 sm:gap-2">
        <div className="text-lg font-semibold">Users</div>
        {users && (
          <TableCheckbox
            title={title}
            content={users as object[]}
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
        )}
      </div>

      <SelectedDetail
        title={'User Detail'}
        contentTitle={contentTitle}
        content={selectedUser[selectedUser.length - 1]}
      >
        <div className="flex items-center gap-4">
          <div>
            <Link
              to={`/users/${selectedUser[selectedUser.length - 1].id}/edit`}
            >
              <PrimaryButton content="Edit" />
            </Link>
          </div>
        </div>
      </SelectedDetail>
    </>
  );
}
