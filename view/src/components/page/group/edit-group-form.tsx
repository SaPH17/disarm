import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery } from 'react-query';
import { GroupFormData } from '../../../models/forms/group-form-data';
import { Group } from '../../../models/group';
import { User } from '../../../models/user';
import GroupServices from '../../../services/group-services';
import UserServices from '../../../services/user-services';
import InputText from '../../input-text/input-text';
import AssignedUserTable from './assigned-user-table';
import PrimaryButton from '../../primary-button';
import { toast } from 'react-toastify';
import { GroupHandler } from '../../../handlers/group/group-handler';

const EditGroupForm = ({ group }: any) => {
  const { data: usersData } = useQuery('users', UserServices.getUsers);
  const { data: groupsData } = useQuery('groups', GroupServices.getGroups);

  const [assignedUser, setAssignedUser] = useState<any>([]);
  const [users, setUsers] = useState<any>([]);

  const groups =
    groupsData?.map((r: Group) => ({
      id: r.id,
      name: r.name,
      description: r.description,
      directParentGroup: r.directParentGroup,
      permissions: r.permissions,
    })) || null;

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<GroupFormData>();

  function handleEditGroupButton(data: GroupFormData) {
    try {
      toast.promise(
        GroupHandler.handleEditGroupFormSubmit(
          group.id,
          data,
          assignedUser.map((u: any) => u.id)
        ),
        {
          success: 'Successfully edited group',
          pending: 'Editting group!',
          error: {
            render({ data }: any) {
              return data.message;
            },
          },
        }
      );
    } catch (e) {}
  }

  useEffect(() => {
    if (!group) return;
    reset(group);
    setAssignedUser(group.Users || []);
  }, [group]);

  useEffect(() => {
    setUsers(
      usersData
        ?.map((user: User) => ({
          id: user.id,
          username: user.username,
          email: user.email,
          created_at: user.created_at,
        }))
        .filter(
          (user: any) => !assignedUser.find((u: any) => u.email === user.email)
        ) || null
    );
  }, [usersData, assignedUser]);

  return groups && users ? (
    <div className="flex flex-col gap-4">
      <form
        className="space-y-8"
        onSubmit={handleSubmit(handleEditGroupButton)}
      >
        <div className="space-y-6 sm:space-y-5">
          <div className="flex flex-row justify-end">
            <PrimaryButton content="Save Changes" type="submit" />
          </div>
          <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5">
            <InputText
              id="name"
              name="name"
              label="Name"
              type="text"
              errors={errors}
              register={register('name', {
                required: 'Name is required.',
              })}
            />
          </div>

          <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5">
            <InputText
              id="description"
              name="description"
              label="Description"
              type="text"
              errors={errors}
              register={register('description', {
                required: 'Description is required.',
              })}
            />
          </div>

          <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5">
            <InputText
              id="parent-group"
              name="parentGroup"
              label="Parent Group"
              type="text"
              datalist={
                <datalist id="parent-groups">
                  {groups &&
                    groups.map((group: Group) => {
                      return (
                        <option key={group.id} value={group.name}></option>
                      );
                    })}
                  <option value=""></option>
                </datalist>
              }
              listId={'parent-groups'}
              errors={errors}
              register={register('parentGroup', {
                validate: (name) => {
                  if (name === '') {
                    return true;
                  }
                  return groups.filter((group: Group) => group.name === name)
                    .length !== 1
                    ? 'Parent group is invalid'
                    : true;
                },
              })}
            />
          </div>
        </div>
        <AssignedUserTable
          users={users}
          setUsers={setUsers}
          assignedUser={assignedUser}
          setAssignedUser={setAssignedUser}
        />
      </form>
    </div>
  ) : (
    <></>
  );
};

export default EditGroupForm;
