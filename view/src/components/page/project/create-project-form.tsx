import { useState } from 'react';
import SelectBox, { SelectBoxData } from '../../select-box';
import UserCard from './user-card';

const items: SelectBoxData[] = [
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

export type User = {
  id: string;
  name: string;
  job: string;
};

export default function CreateProjectForm() {
  const users = [
    {
      id: '1',
      name: 'Bambang',
      job: 'Pentester',
    },
    {
      id: '2',
      name: 'Memeng',
      job: 'System Analyst',
    },
    {
      id: '3',
      name: 'Mamang',
      job: 'Pentester',
    },
    {
      id: '4',
      name: 'Cadelia',
      job: 'System Analyst',
    },
  ];

  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [availableUsers, setAvailableUsers] = useState<User[]>(users);

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
      users.filter(
        (user) =>
          !tempSelectedUser.find((selectedUser) => selectedUser.id === user.id)
      )
    );
  }

  return (
    <form className="space-y-8">
      <div className="space-y-8 sm:space-y-5">
        <div className="space-y-6 sm:space-y-5">
          <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5">
            <label
              htmlFor="first_name"
              className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
            >
              Name
            </label>
            <div className="mt-1 sm:mt-0 sm:col-span-2">
              <input
                type="text"
                name="first_name"
                id="first_name"
                autoComplete="given-name"
                className="block max-w-lg w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md"
              />
            </div>
          </div>

          <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
            <label
              htmlFor="last_name"
              className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
            >
              Company
            </label>
            <div className="mt-1 sm:mt-0 sm:col-span-2">
              <input
                type="text"
                name="last_name"
                id="last_name"
                autoComplete="family-name"
                className="block max-w-lg w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md"
              />
            </div>
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
                  items={availableUsers}
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
      </div>
    </form>
  );
}
