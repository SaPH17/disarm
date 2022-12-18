import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { CreateUserHandler } from '../../../handlers/user/create-user-handler';
import { UserFormData } from '../../../models/forms/user-form-data';
import { GeneralData } from '../../../models/general-data';
import { Group } from '../../../models/group';
import { User } from '../../../models/user';
import GroupServices from '../../../services/group-services';
import UserServices from '../../../services/user-services';
import FormErrorMessage from '../../input-text/form-error-message';
import InputText from '../../input-text/input-text';
import PrimaryButton from '../../primary-button';
import SelectBox from '../../select-box';
import GroupCard from './group-card';

export default function CreateUserForm() {
  const { data: groupsData } = useQuery('groups', GroupServices.getGroups);
  const { data: usersData } = useQuery('users', UserServices.getUsers);

  const groups =
    groupsData?.map((r: Group) => ({
      id: r.id,
      name: r.name,
      description: r.description,
      directParentGroup: r.directParentGroup,
      permissions: r.permissions,
    })) || [];

  const users =
    usersData?.map((r: User) => ({
      id: r.id,
      username: r.username,
      email: r.email
    })) || [];

  const [selectedGroups, setSelectedGroups] = useState<Group[]>([]);
  const [availableGroups, setAvailableGroups] = useState<Group[]>();
  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue
  } = useForm<UserFormData>();

  function getCurrentGroup(item: any) {
    const tempSelectedGroup = [...selectedGroups, item];
    resetAssignedGroupState(tempSelectedGroup);
    setValue('selectedGroup', true);
  }

  function removeCurrentGroup(group: any) {
    const tempSelectedUser = selectedGroups.filter(
      (selectedGroup) => selectedGroup.id !== group.id
    );
    if (!tempSelectedUser.length) setValue('selectedGroup', false);
    resetAssignedGroupState(tempSelectedUser);
  }

  function resetAssignedGroupState(tempSelectedGroup: Group[]) {
    setSelectedGroups(tempSelectedGroup);
    setAvailableGroups(
      groups!.filter(
        (group: Group) =>
          !tempSelectedGroup.find(
            (selectedGroup) => selectedGroup.id === group.id
          )
      )
    );
  }

  async function handleCreateUserButton(data: UserFormData) {
    try {
      await CreateUserHandler.handleCreateUserFormSubmit(data, (selectedGroups.map(group => group.id) as string[]));
    } catch (e) {}
  }

  useEffect(() => {
    if (!groupsData) return;
    setAvailableGroups(groups);
  }, [groupsData])

  return groups ? (
    <form className="space-y-8" onSubmit={handleSubmit(handleCreateUserButton)}>
      <div className="space-y-6 sm:space-y-5">
        <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5">
          <InputText
            id="username"
            name="username"
            label="Username"
            type="text"
            errors={errors}
            register={register('username', {
              required: 'Username is required.',
              validate: (username) => {
                const countUser = users.filter((user: User) => user.username === username).length;
                return countUser ? 'Username must be unique' : true;
              }
            })}
          />
        </div>

        <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5">
          <InputText
            id="email"
            name="email"
            label="Email"
            type="email"
            errors={errors}
            register={register('email', {
              required: 'Email is required.',
              validate: (email) => {
                const countUser = users.filter((user: User) => user.email === email).length;
                return countUser ? 'Email must be unique' : true;
              }
            })}
          />
        </div>

        <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5">
          <InputText
            id="direct-supervisor"
            name="directSupervisor"
            label="Direct Supervisor"
            type="email"
            datalist={
              <datalist id='direct-supervisors'>
                {
                  users && users.map((user: User) => {
                    return <option key={user.id} value={user.email}></option>
                  })
                }
                <option value=""></option>
              </datalist>
            }
            listId={'direct-supervisors'}
            errors={errors}
            register={register('directSupervisor', {
              required: 'Direct Supervisor is required.',
              validate: (email) => {
                const countUser = users.filter((user: User) => user.email === email).length;
                return !countUser ? 'Direct supervisor email is not existsx' : true;
              }
            })}
          />
        </div>

        <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
          <label
            htmlFor="last_name"
            className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
          >
            Groups
          </label>
          <div className="flex flex-col gap-4 mt-1 sm:mt-0 sm:col-span-2">
            <div className="flex flex-col gap-2">
              <div className="block w-full max-w-lg border-gray-300 rounded-md shadow-sm sm:text-sm">
                {
                  availableGroups &&
                  <>
                    <SelectBox
                      defaultValue="Select Group"
                      items={availableGroups as GeneralData[]}
                      onClickFunction={getCurrentGroup}
                    />
                    {errors && <FormErrorMessage name={'selectedGroup'} errors={errors} />}
                  </>
                }

              </div>
              <span className="text-gray-500 underline cursor-pointer hover:text-gray-700 w-fit">
                <Link to="/groups/create">Create a new group</Link>
              </span>
            </div>
            <div className="flex flex-col w-full max-w-lg gap-2 border-gray-300 rounded-md sm:text-sm">
              <input type="hidden" {...register('selectedGroup', {
                validate: (value) => {
                  return !value ? 'You must select a group' : true;
                }
              })} />
              {selectedGroups.map((selectedGroup, index) => (
                <GroupCard
                  key={index}
                  group={selectedGroup}
                  onClickFunction={removeCurrentGroup}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-row justify-end">
        <PrimaryButton content="Create User" type="submit" />
      </div>
    </form>
  ) : (
    <></>
  );
}
