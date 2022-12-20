import { useEffect, useState } from 'react';
import TableCheckbox from '../../../components/table-checkbox';
import { Permission } from '../../../models/permission';
import PermissionServices from '../../../services/permission-services';
import InputSwitch from '../../../components/input-switch/input-switch';
import { SearchIcon } from '@heroicons/react/outline';
import { useNavigate, useParams } from 'react-router-dom';
import Breadcrumbs from '../../../components/breadcrumbs';
import { Group } from '../../../models/group';
import { useQuery } from 'react-query';
import { capitalize } from '../../../utils/functions/capitalize';
import GroupServices from '../../../services/group-services';

const title = ['id', 'action', 'objectType', 'objectId'];

const ManageGroupEditPermission = () => {
  const { id } = useParams();
  const { data: permissionsData } = useQuery(
    'permissions',
    PermissionServices.getPermissions
  );
  const { data: groupData } = useQuery(`groups/${id}`, () =>
    GroupServices.getOneGroup(id)
  );

  const permission = permissionsData
    ? permissionsData.map((p: any) => ({
        id: `${p.PermissionAction.name}.${p.ObjectType.name}.${p.object_id}`,
        action: capitalize(p.PermissionAction.name),
        objectType: capitalize(p.ObjectType.name),
        objectId: p.object_id,
      }))
    : [];
  const [selectedPermission, setSelectedPermission] = useState<Permission[]>(
    []
  );
  const [search, setSearch] = useState('');
  const breadcrumbsPages = [
    {
      name: 'Groups',
      url: '/groups',
    },
    {
      name: `${groupData?.name || '-'}`,
      url: `/groups/${groupData?.id}/edit-permission`,
    },
  ];

  return permission ? (
    <div className="flex flex-col gap-4">
      <Breadcrumbs pages={breadcrumbsPages}></Breadcrumbs>
      <div className="text-xl font-semibold">Edit Permission</div>
      <div className="flex flex-col sm:gap-2 rounded divide-y-1 bg-white text-sm shadow">
        <div className="flex flex-row justify-between items-center px-2 py-2 sm:px-8  sm:py-4 bg-gray-50">
          <div className="text-lg font-semibold">Available Permission</div>
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
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="flex flex-col gap-4 px-8 pb-8 pt-4">
          <div className="flex justify-between items-center">
            <InputSwitch label={'Show enabled only'} />
          </div>
          <TableCheckbox
            title={title}
            content={permission}
            selectedData={selectedPermission}
            setSelectedData={setSelectedPermission}
            onRowClickFunction={() => {}}
            isCheckOnRowClick={true}
          />
        </div>
      </div>
    </div>
  ) : (
    <></>
  );
};

export default ManageGroupEditPermission;
