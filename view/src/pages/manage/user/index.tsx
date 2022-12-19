import { useState } from 'react';
import { useQuery } from 'react-query';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ActionButton, {
  ActionButtonItem,
} from '../../../components/action-button';
import DeletePopup from '../../../components/popup/delete-popup';
import PrimaryButton from '../../../components/primary-button';
import SelectedDetail from '../../../components/selected-detail';
import TableCheckbox from '../../../components/table-checkbox';
import { defaultUser } from '../../../data/default-values';
import { DeleteUsersHandler } from '../../../handlers/user/delete-user-handler';
import { Group } from '../../../models/group';
import { User } from '../../../models/user';
import UserServices from '../../../services/user-services';

const title = ['name', 'email', 'groups'];

const contentTitle = [
  'name',
  'groups',
  'assignedProjects',
  'email',
  'directSupervisor',
];

export default function ManageUserIndex() {
  const navigate = useNavigate();
  const [openDeletePopup, setOpenDeletePopup] = useState(false);
  const { data, refetch } = useQuery('users', UserServices.getUsers);
  const users =
    data?.map((r: User) => {
      return {
        id: r.id,
        email: r.email,
        name: r.username,
        directSupervisor: (r.direct_supervisor_id as any).Valid
          ? r.direct_supervisor_id.String
          : '-',
        groups: r.Groups?.map((group: Group) => group.name).join(', ') || '-',
        assignedProjects: '-',
      };
    }) || [];

  const [selectedUser, setSelectedUser] = useState<User[]>([
    {
      ...defaultUser,
    },
  ]);

  const items: ActionButtonItem[] = [
    {
      id: '1',
      name: 'Delete User',
      onClickFunction: () => {
        if (!selectedUser.filter((user: User) => user.id !== -1).length) return;
        setOpenDeletePopup(true);
      },
    },
    {
      id: '2',
      name: 'Add to Group',
      onClickFunction: () => {},
    },
    {
      id: '3',
      name: 'Assign to Project',
      onClickFunction: () => {},
    },
  ];

  function deleteUsers() {
    const ids = selectedUser
      .filter((user: User) => user.id !== -1)
      .map((user: User) => user.id);
    try {
      toast.promise(DeleteUsersHandler.handleDeleteUserSubmit(ids), {
        success: `Successfully delete ${ids.length} user(s)!`,
        pending: `Waiting for delete ${ids.length} user(s)!`,
        error: {
          render({ data }: any) {
            return data.message;
          },
        },
      });
      refetch();
    } catch (e) {}
  }

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
      {
        <DeletePopup
          title="Delete Users"
          selectedData={selectedUser.filter((user: User) => user.id !== -1)}
          onClickFunction={deleteUsers}
          open={openDeletePopup}
          setOpen={setOpenDeletePopup}
        />
      }
    </>
  );
}
