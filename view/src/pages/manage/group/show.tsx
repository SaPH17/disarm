import { useParams } from 'react-router-dom';
import Table from '../../../components/table';
import { FaSearch } from 'react-icons/fa';

const assignUserTitle = ['name', 'email'];
const assignUserContent = [{ name: 'User A', email: 'user@gmail.com' }];

const ManageGroupShow = () => {
  const params = useParams();

  return (
    <>
      <div className="text-xl font-semibold">Role {params.id}</div>
      <div className="flex flex-col gap-2 sm:gap-4 p-2 sm:p-4 bg-gray-100 rounded border-4 border-dashed mt-4">
        <div className="flex justify-between items-center">
          <div className="text-lg font-semibold">Assign User</div>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch aria-hidden="true" />
            </div>
            <input
              type="text"
              name="name"
              id="name"
              className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
              placeholder="Search user"
            />
          </div>
        </div>
        <Table
          title={assignUserTitle}
          content={assignUserContent}
          isClickable={true}
        />
      </div>
      <div className="flex flex-col gap-2 sm:gap-4 p-2 sm:p-4 bg-gray-100 rounded border-4 border-dashed mt-8">
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
