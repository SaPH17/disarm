import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { UserFormData } from '../../../models/forms/user-form-data';
import { GeneralData } from '../../../models/general-data';
import { Group } from '../../../models/group';
import GroupServices from '../../../services/group-services';
import InputText from '../../input-text/input-text';
import PrimaryButton from '../../primary-button';
import SelectBox from '../../select-box';
import GroupCard from './group-card';

export default function CreateUserForm() {
  const [groups, setGroups] = useState<Group[]>();
  const [selectedGroups, setSelectedGroups] = useState<Group[]>([]);
  const [availableGroups, setAvailableGroups] = useState<Group[]>();
  const {
    register,
    formState: { errors },
    handleSubmit,
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
    setAvailableGroups(
      groups!.filter(
        (group) =>
          !tempSelectedGroup.find(
            (selectedGroup) => selectedGroup.id === group.id
          )
      )
    );
  }

  function handleCreateUserButton(data: UserFormData) {
    console.log(data);
  }

  async function fetchGroups() {
    const result = await GroupServices.getGroups();
    setGroups(result);
    setAvailableGroups(result);
  }
  
  useEffect(() => {
    fetchGroups();
  }, [])

  return (groups ?
    <form className="space-y-8" onSubmit={handleSubmit(handleCreateUserButton)}>
      <div className="space-y-8 sm:space-y-5">
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

          <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
            <label
              htmlFor="last_name"
              className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
            >
              Groups
            </label>
            <div className="mt-1 sm:mt-0 sm:col-span-2 flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <div className="block max-w-lg w-full shadow-sm sm:text-sm border-gray-300 rounded-md">
                  <SelectBox
                    defaultValue="Select Group"
                    items={availableGroups as GeneralData[]}
                    onClickFunction={getCurrentGroup}
                  />
                </div>
                <Link to="/groups/create">
                  <span className="text-gray-500 hover:text-gray-700 cursor-pointer underline">
                    Create a new group
                  </span>
                </Link>
              </div>
              <div className="max-w-lg w-full sm:text-sm border-gray-300 rounded-md flex flex-col gap-2">
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
      </div>
      <div className="flex flex-row justify-end">
        <PrimaryButton content="Create User" type="submit" />
      </div>
    </form> : <></>
  );
}
