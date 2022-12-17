import { SearchIcon } from '@heroicons/react/outline';
import PrimaryButton from '../../primary-button';
import Table from '../../table';
import { useState } from 'react';
import { User } from '../../../models/user';

const title = ['name', 'email', 'dateCreated', 'action'];

const AssignedUserTable = ({ users }: any) => {
  const [search, setSearch] = useState('');

  return users ? (
    <div className="flex flex-col text-sm bg-white rounded shadow sm:gap-2 divide-y-1">
      <div className="flex flex-row items-center justify-between px-2 py-2 sm:px-8 sm:py-4 bg-gray-50">
        <div className="flex flex-col sm:flex-row gap-x-4 gap-y-2">
          <div className="text-lg font-semibold">Assigned User</div>
          <div className="max-w-sm">
            <PrimaryButton content="Add User" type="button" />
          </div>
        </div>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <SearchIcon className="w-5 h-5 text-gray-400" aria-hidden="true" />
          </div>
          <input
            id="search"
            name="search"
            className="block w-full py-2 pl-10 pr-3 leading-5 placeholder-gray-500 bg-white border border-gray-300 rounded-md focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Search"
            type="search"
            onChange={(e) => setSearch(e.target.value)}
            value={search}
          />
        </div>
      </div>
      <div className="flex flex-col gap-4 px-8 pt-4 pb-8">
        <Table
          title={title}
          content={users.filter((user: User) => ['name', 'email', 'dateCreated'].filter(t => ((user as any)[t] as string).includes(search)).length > 0)}
          onClickFunction={(group: any) => {}}
        />
      </div>
    </div>
  ) : (
    <></>
  );
};

export default AssignedUserTable;
