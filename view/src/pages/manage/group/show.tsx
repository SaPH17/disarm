import { SearchIcon } from '@heroicons/react/outline';
import { useParams } from 'react-router-dom';
import Table from '../../../components/table';

const assignUserTitle = ['name', 'email'];
const assignUserContent = [{ name: 'User A', email: 'user@gmail.com' }];

const ManageGroupShow = () => {
  const params = useParams();

  return (
    <>
      <div className="text-xl font-semibold">Role {params.id}</div>
      <div className="flex flex-col gap-2 sm:gap-4 py-2 sm:py-4 bg-gray-100 rounded mt-4">
        <div className="flex justify-between items-center">
          <div className="text-lg font-semibold">Assign User</div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </div>
            <input
              id="search"
              name="search"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Search"
              type="search"
            />
          </div>
        </div>
        <Table
          title={assignUserTitle}
          content={assignUserContent}
          isClickable={true}
        />
      </div>
      <div className="flex flex-col gap-2 sm:gap-4 py-2 sm:py-4 bg-gray-100 rounded mt-8">
        <div className="flex justify-between items-center">
          <div className="text-lg font-semibold">User List</div>
        </div>
        <Table
          title={assignUserTitle}
          content={assignUserContent}
          isClickable={true}
        />
      </div>
    </>
  );
};

export default ManageGroupShow;
