import { SearchIcon } from '@heroicons/react/outline';
import PrimaryButton from '../../primary-button';
import Table from '../../table';
import { useState } from 'react';

const title = ['id', 'name', 'dateCreated', 'action'];

const AssignedUserTable = ({ users }: any) => {
  const [search, setSearch] = useState('');

  return users ? (
    <div className="flex flex-col sm:gap-2 rounded divide-y-1 bg-white text-sm shadow">
      <div className="flex flex-row justify-between items-center px-2 py-2 sm:px-8  sm:py-4 bg-gray-50">
        <div className="flex flex-col sm:flex-row gap-x-4 gap-y-2">
          <div className="text-lg font-semibold">Assigned User</div>
          <div className="max-w-sm">
            <PrimaryButton content="Add User" type="button" />
          </div>
        </div>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <input
            id="search"
            name="search"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Search"
            type="search"
            onChange={(e) => setSearch(e.target.value)}
            value={search}
          />
        </div>
      </div>
      <div className="flex flex-col gap-4 px-8 pb-8 pt-4">
        <Table
          title={title}
          content={users}
          onClickFunction={(group: any) => {}}
        />
      </div>
    </div>
  ) : (
    <></>
  );
};

export default AssignedUserTable;
