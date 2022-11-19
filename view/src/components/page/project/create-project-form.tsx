import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ProjectFormData } from '../../../models/forms/project-form-data';
import { GeneralData } from '../../../models/general-data';
import { User } from '../../../models/user';
import UserServices from '../../../services/user-services';
import InputText from '../../input-text/input-text';
import PrimaryButton from '../../primary-button';
import SelectBox from '../../select-box';
import UserCard from './user-card';

const items: GeneralData[] = [
  {
    id: '1',
    name: 'Standard A',
  },
  {
    id: '2',
    name: 'Standard B',
  },
  {
    id: '3',
    name: 'Standard C',
  },
];

export default function CreateProjectForm() {
  const [users, setUsers] = useState<User[]>();
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [availableUsers, setAvailableUsers] = useState<User[]>();
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<ProjectFormData>();

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

  function handleCreateProjectButton(data: ProjectFormData) {
    console.log(data);
  }

  async function fetchUsers() {
    const result = await UserServices.getUsers();
    setAvailableUsers(result);
    setUsers(result);
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  return users ? (
    <form
      className="space-y-8"
      onSubmit={handleSubmit(handleCreateProjectButton)}
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

        <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
          <InputText
            id="company"
            name="company"
            label="Company"
            type="text"
            errors={errors}
            register={register('company', {
              required: 'Company name is required.',
            })}
          />
        </div>

        <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
          <label
            htmlFor="country"
            className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
          >
            Standard
          </label>
          <div className="mt-1 sm:mt-0 sm:col-span-2 flex flex-col gap-2">
            <div className="block max-w-lg w-full shadow-sm sm:text-sm border-gray-300 rounded-md">
              <SelectBox items={items} defaultValue={'Select Standard'} />
            </div>
            <span className="text-gray-500 hover:text-gray-700 cursor-pointer underline">
              Create a new standard
            </span>
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
        <PrimaryButton content="Create Project" type="submit" />
      </div>
    </form>
  ) : (
    <></>
  );
}
