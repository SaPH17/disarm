import { useEffect, useState } from 'react';
import TableCheckbox from '../../../components/table-checkbox';
import { Permission } from '../../../models/permission';
import PermissionServices from '../../../services/permission-services';
import InputSwitch from '../../../components/input-switch/input-switch';
import { SearchIcon } from '@heroicons/react/outline';
import { useNavigate, useParams } from 'react-router-dom';

const title = ['id', 'name', 'category', 'description'];

const ManageGroupEditPermission = () => {
  const { id } = useParams();
  const [permission, setPermission] = useState<Permission[]>();
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  async function fetchGroup() {
    if (id === undefined) {
      return navigate('/');
    }

    if (permission === undefined) {
      const result = await PermissionServices.getPermissions();
      setPermission(result);
    }
  }

  useEffect(() => {
    fetchGroup();
  }, [id, permission]);

  return permission ? (
    <div className="flex flex-col sm:gap-2 rounded divide-y-1 bg-white text-sm shadow">
      <div className="flex flex-row justify-between items-center px-2 py-2 sm:px-8  sm:py-4 bg-gray-50">
        <div className="text-lg font-semibold">Available Permission</div>
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
            onChange={ (e) => setSearch(e.target.value) }
          />
        </div>
      </div>
      <div className="flex flex-col gap-4 px-8 pb-8 pt-4">
        <div className="flex justify-between items-center">
          <InputSwitch label={'Show enabled only'} />
          <div className="underline cursor-pointer hover:text-gray-500">
            Clear Permission
          </div>
        </div>
        <TableCheckbox
          title={title}
          content={permission}
          onCheckedFunction={() => {}}
          onUncheckedFunction={() => {}}
          onClickFunction={(group: any) => {}}
        />
      </div>
    </div>
  ) : (
    <></>
  );
};

export default ManageGroupEditPermission;
