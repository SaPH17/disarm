import { useState } from 'react';
import { Link } from 'react-router-dom';
import SelectBox from '../../select-box';
import GroupCard from './group-card';

export type Group = {
  id: string;
  name: string;
};

export default function CreateUserForm() {
  const groups = [
    {
      id: '1',
      name: 'Group 1',
    },
    {
      id: '2',
      name: 'Group 2',
    },
    {
      id: '3',
      name: 'Group 3',
    },
    {
      id: '4',
      name: 'Group 4',
    },
  ];

  const [selectedGroups, setSelectedGroups] = useState<Group[]>([]);
  const [availableGroups, setAvailableGroups] = useState<Group[]>(groups);

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
      groups.filter(
        (group) =>
          !tempSelectedGroup.find(
            (selectedGroup) => selectedGroup.id === group.id
          )
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

          <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
            >
              Email
            </label>
            <div className="mt-1 sm:mt-0 sm:col-span-2">
              <input
                type="email"
                name="email"
                id="email"
                className="block max-w-lg w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md"
              />
            </div>
          </div>

          <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5">
            <label
              htmlFor="direct-supervisor"
              className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
            >
              Direct Supervisor
            </label>
            <div className="mt-1 sm:mt-0 sm:col-span-2">
              <input
                type="text"
                name="direct_supervisor"
                id="direct-supervisor"
                className="block max-w-lg w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md"
              />
            </div>
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
                    items={availableGroups}
                    onClickFunction={getCurrentGroup}
                  />
                </div>
                <Link to="/group/create">
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
    </form>
  );
}
