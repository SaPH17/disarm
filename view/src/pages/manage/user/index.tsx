import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ActionButton, {
  ActionButtonItem
} from '../../../components/action-button';
import PrimaryButton from '../../../components/primary-button';
import SelectedDetail from '../../../components/selected-detail';
import TableCheckbox from '../../../components/table-checkbox';
import { User } from '../../../models/user';
import UserServices from '../../../services/user-services';

const title = ['name', 'groups', 'status'];

const contentTitle = [
  'name',
  'status',
  'groups',
  'assignedProjects',
  'directSupervisor',
];

export default function ManageUserIndex() {
  const [users, setUsers] = useState<User[]>();
  const [selectedUser, setSelectedUser] = useState<User[]>([
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
      name: 'Delete User',
      url: '/',
    },
    {
      id: '2',
      name: 'Add Group',
      url: '/',
    },
    {
      id: '3',
      name: 'Assign Project',
      url: '/',
    },
  ];

  async function fetchUsers(){
    const result = await UserServices.getUsers();
    setUsers(result);
  }

  useEffect(() => {
    fetchUsers();
  }, []);

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
        {
          users && <TableCheckbox
          title={title}
          content={users as object[]}
          onCheckedFunction={(user: any) => {
            setSelectedUser([...selectedUser, user]);
          }}
          onUncheckedFunction={(user: any) => {
            setSelectedUser(selectedUser.filter((item) => item !== user));
          }}
          onClickFunction={(user: any) => {
            // navigate(`/users/${user.id}`);
          }}
        />
        }
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
            <Link to={`/users/${ selectedUser[selectedUser.length - 1].id }/edit`}>
              <PrimaryButton content="Edit" />
            </Link>
          </div>
        </div>
      </SelectedDetail>
    </>
  );
}
