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
import SelectPopup from '../../../components/popup/select-popup';
import GroupServices from '../../../services/group-services';
import { UsersIcon } from '@heroicons/react/solid';
import { GroupHandler } from '../../../handlers/group/group-handler';
import ResetPasswordPopup from '../../../components/page/user/reset-password-popup';
import { ResetPasswordHandler } from '../../../handlers/user/reset-password-handler';

const title = ['name', 'email', 'groups'];

const contentTitle = [
  'name',
  'groups',
  'assignedProjects',
  'email',
  'direct_supervisor',
];

export default function ManageUserIndex() {
  const navigate = useNavigate();
  const [openedPopup, setOpenedPopup] = useState({
    delete: false,
    assignGroup: false,
    resetPassword: false,
  });
  const { data, refetch } = useQuery('users', UserServices.getUsers, {
    refetchOnMount: true,
  });
  const { data: dataGroup } = useQuery('groups', GroupServices.getGroups);
  const users =
    data?.map((r: User) => {
      return {
        id: r.id,
        email: r.email,
        name: r.username,
        direct_supervisor: r.Supervisor?.username || '-',
        groups: r.Groups?.map((group: Group) => group.name).join(', ') || '-',
        assignedProjects: '-',
      };
    }) || [];

  const groups =
    dataGroup?.map((r: Group) => ({
      id: r.id,
      name: r.name,
      description: r.description,
      directParentGroup: r.directParentGroup,
      permissions: r.permissions,
    })) || undefined;

  const [activeUser, setActiveUser] = useState<User>(defaultUser);
  const [selectedUser, setSelectedUser] = useState<User[]>([]);

  const items: ActionButtonItem[] = [
    {
      id: '1',
      name: 'Delete User',
      onClickFunction: () => {
        if (!selectedUser) return;
        if (!selectedUser.filter((user: User) => user.id !== -1).length) return;
        setOpenedPopup({ ...openedPopup, delete: !openedPopup.delete });
      },
    },
    {
      id: '2',
      name: 'Add to Group',
      onClickFunction: () => {
        setOpenedPopup({
          ...openedPopup,
          assignGroup: !openedPopup.assignGroup,
        });
      },
    },
  ];

  async function deleteUsers() {
    if (!selectedUser) return;
    const ids = selectedUser.map((user: User) => user.id);
    try {
      await toast.promise(DeleteUsersHandler.handleDeleteUserSubmit(ids), {
        success: `Successfully delete ${ids.length} user(s)!`,
        pending: `Waiting for delete ${ids.length} user(s)!`,
        error: {
          render({ data }: any) {
            return data.message;
          },
        },
      });
      refetch();
      setSelectedUser([]);
    } catch (e) {}
  }

  async function resetPassword() {
    if (!activeUser) return;
    const id = activeUser.id;
    try {
      await toast.promise(ResetPasswordHandler.handleResetPassword(id), {
        success: {
          render({ data }: any) {
            return `Successfully reset ${activeUser.name} (${activeUser.email})'s password to ${data.password}!`;
          },
        },
        pending: `Waiting for reset ${activeUser.name} (${activeUser.email})'s password!`,
        error: {
          render({ data }: any) {
            return data.message;
          },
        },
      });
      refetch();
      setActiveUser(defaultUser);
    } catch (e) {}
  }

  async function addUserToGroup(selectedGroup: any) {
    if (selectedGroup.length === 0 || selectedUser.length === 0) {
      return;
    }
    const userIds = selectedUser.map((user: User) => user.id);
    const groupIds = selectedGroup.map((group: any) => group.id);
    try {
      await toast.promise(
        GroupHandler.handleAddUserToGroup(userIds, groupIds),
        {
          success: `Successfully assigned ${userIds.length} user(s)!`,
          pending: `Assigning ${userIds.length} user(s)!`,
          error: {
            render({ data }: any) {
              return data.message;
            },
          },
        }
      );
      refetch();
      setSelectedUser([]);
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
            selectedData={selectedUser}
            setSelectedData={setSelectedUser}
            content={users as object[]}
            onRowClickFunction={(user: User) => {
              setActiveUser(user);
            }}
            onClickFunction={(user: User) => {
              navigate(`/users/${user.id}`);
            }}
          />
        )}
      </div>

      <SelectedDetail
        title={'User Detail'}
        contentTitle={contentTitle}
        content={activeUser}
      >
        <div className="flex items-center gap-4">
          <span
            onClick={() =>
              setOpenedPopup({
                ...openedPopup,
                resetPassword: !openedPopup.resetPassword,
              })
            }
            className={'underline cursor-pointer'}
          >
            Reset Password
          </span>
          <div>
            <Link to={`/users/${activeUser.id}/edit`}>
              <PrimaryButton content="Edit" />
            </Link>
          </div>
        </div>
      </SelectedDetail>
      {selectedUser && (
        <ResetPasswordPopup
          title="Reset Password"
          activeData={activeUser}
          onClickFunction={resetPassword}
          open={openedPopup.resetPassword}
          setOpen={(val: any) => {
            setOpenedPopup({ ...openedPopup, resetPassword: val });
          }}
        />
      )}
      {selectedUser && (
        <DeletePopup
          title="Delete Users"
          selectedData={selectedUser}
          onClickFunction={deleteUsers}
          open={openedPopup.delete}
          setOpen={(val: any) => {
            setOpenedPopup({ ...openedPopup, delete: val });
          }}
        />
      )}
      {groups && (
        <SelectPopup
          icon={
            <UsersIcon className="w-6 h-6 text-green-600" aria-hidden="true" />
          }
          availableData={groups}
          title="Select Group"
          onClickFunction={addUserToGroup}
          open={openedPopup.assignGroup}
          setOpen={(val: any) => {
            setOpenedPopup({ ...openedPopup, assignGroup: val });
          }}
        />
      )}
    </>
  );
}
