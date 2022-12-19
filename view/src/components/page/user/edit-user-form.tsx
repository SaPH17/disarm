import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery } from 'react-query';
import { Link, useParams } from 'react-router-dom';
import { UserFormData } from '../../../models/forms/user-form-data';
import { GeneralData } from '../../../models/general-data';
import { Group } from '../../../models/group';
import { User } from '../../../models/user';
import UserServices from '../../../services/user-services';
import InputText from '../../input-text/input-text';
import PrimaryButton from '../../primary-button';
import SelectBox from '../../select-box';
import GroupCard from './group-card';

export default function EditUserForm() {
  const params = useParams();
  const { data: userData } = useQuery(`users/${params.id}`, () =>
    UserServices.getOneUser(params.id)
  );
  const { data: usersData } = useQuery(`users`, UserServices.getUsers);

  const user =
    {
      ...userData,
    } || null;
  const users = usersData?.filter((u: User) => u.id !== user.id) || null;
  console.log(users);

  const [selectedGroups, setSelectedGroups] = useState<Group[]>([]);
  const [availableGroups, setAvailableGroups] = useState<Group[]>();

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<UserFormData>();

  function getCurrentGroup(item: any) {
    const tempSelectedGroup = [...selectedGroups, item];
    resetAssignedGroupState(tempSelectedGroup);
  }

  function removeCurrentGroup(group: any) {
    const tempSelectedUser = selectedGroups.filter(
      (selectedGroup) => selectedGroup.id !== group.id
    );
    resetAssignedGroupState(tempSelectedUser);
  }

  function resetAssignedGroupState(tempSelectedGroup: Group[]) {
    setSelectedGroups(tempSelectedGroup);
    // setAvailableGroups(
    //   groups!.filter(
    //     (group) =>
    //       !tempSelectedGroup.find(
    //         (selectedGroup) => selectedGroup.id === group.id
    //       )
    //   )
    // );
  }

  function handleCreateUserButton(data: UserFormData) {
    console.log(data);
  }

  useEffect(() => {
    if (!user) return;
    reset(user);
  }, [userData]);

  return user ? (
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
            })}
          />
        </div>

        <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5">
          <InputText
            id="direct-supervisor"
            name="directSupervisor"
            label="Direct Supervisor"
            type="text"
            errors={errors}
            register={register('directSupervisor', {
              required: 'Direct Supervisor is required.',
            })}
          />
        </div>

        {availableGroups && (
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
                  <SelectBox
                    defaultValue="Select Group"
                    items={availableGroups as GeneralData[]}
                    onClickFunction={getCurrentGroup}
                  />
                </div>
                <Link to="/groups/create">
                  <span className="text-gray-500 underline cursor-pointer hover:text-gray-700">
                    Create a new group
                  </span>
                </Link>
              </div>
              <div className="flex flex-col w-full max-w-lg gap-2 border-gray-300 rounded-md sm:text-sm">
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
        )}
      </div>
      <div className="flex flex-row justify-end">
        <PrimaryButton content="Edit User" type="submit" />
      </div>
    </form>
  ) : (
    <></>
  );
}
