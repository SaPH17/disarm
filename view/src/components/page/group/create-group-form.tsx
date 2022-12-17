import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { GroupFormData } from '../../../models/forms/group-form-data';
import { GeneralData } from '../../../models/general-data';
import { Group } from '../../../models/group';
import { User } from '../../../models/user';
import GroupServices from '../../../services/group-services';
import UserServices from '../../../services/user-services';
import InputText from '../../input-text/input-text';
import PrimaryButton from '../../primary-button';
import SelectBox from '../../select-box';
import UserCard from '../project/user-card';

const CreateGroupForm = () => {
  const [users, setUsers] = useState<User[]>();
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [availableUsers, setAvailableUsers] = useState<User[]>();

  const [groups, setGroups] = useState<Group[]>();

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<GroupFormData>();

  function getCurrentUser(item: any) {
    const tempSelectedUser = [...selectedUsers, item];
    resetAssignedUserState(tempSelectedUser);
  }

  function removeCurrentUser(user: any) {
    const tempSelectedUser = selectedUsers.filter(
      (selectedUser) => selectedUser.id !== user.id
    );
    resetAssignedUserState(tempSelectedUser);
  }

  function resetAssignedUserState(tempSelectedUser: User[]) {
    setSelectedUsers(tempSelectedUser);
    setAvailableUsers(
      users!.filter(
        (user) =>
          !tempSelectedUser.find((selectedUser) => selectedUser.id === user.id)
      )
    );
  }

  function handleCreateGroupButton(data: GroupFormData) {
    console.log(data);
  }

  async function fetchGroups() {
    const result = await GroupServices.getGroups();
    setGroups(result);
  }

  async function fetchUsers() {
    // const result = await UserServices.getUsers();
    // setAvailableUsers(result);
    // setUsers(result);
  }

  useEffect(() => {
    fetchGroups();
    fetchUsers();
  }, []);

  return groups && users ? (
    <form
      className="space-y-8"
      onSubmit={handleSubmit(handleCreateGroupButton)}
    >
      <div className="space-y-6 sm:space-y-5">
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

        <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start  sm:pt-5">
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

        <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
          <label
            htmlFor="country"
            className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
          >
            Parent Group
          </label>
          <div className="mt-1 sm:mt-0 sm:col-span-2 flex flex-col gap-2">
            <div className="block max-w-lg w-full shadow-sm sm:text-sm border-gray-300 rounded-md">
              <SelectBox
                items={groups as GeneralData[]}
                defaultValue={'None'}
              />
            </div>
          </div>
        </div>

        <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
          <label
            htmlFor="last_name"
            className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
          >
            Assigned User
          </label>
          <div className="mt-1 sm:mt-0 sm:col-span-2 flex flex-col gap-4">
            <div className="block max-w-lg w-full shadow-sm sm:text-sm border-gray-300 rounded-md">
              <SelectBox
                items={availableUsers as GeneralData[]}
                defaultValue={'Select User'}
                onClickFunction={getCurrentUser}
              />
            </div>
            <div className="max-w-lg w-full sm:text-sm border-gray-300 rounded-md flex flex-col gap-2">
              {selectedUsers.map((selectedUser, index) => (
                <UserCard
                  key={index}
                  user={selectedUser}
                  onClickFunction={removeCurrentUser}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-row justify-end">
        <PrimaryButton content="Create Group" type="submit" />
      </div>
    </form>
  ) : (
    <></>
  );
};

export default CreateGroupForm;
