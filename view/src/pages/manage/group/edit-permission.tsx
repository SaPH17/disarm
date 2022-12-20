import { useEffect, useState } from 'react';
import TableCheckbox from '../../../components/table-checkbox';
import { Permission } from '../../../models/permission';
import PermissionServices from '../../../services/permission-services';
import InputSwitch from '../../../components/input-switch/input-switch';
import { SearchIcon } from '@heroicons/react/outline';
import { useParams } from 'react-router-dom';
import Breadcrumbs from '../../../components/breadcrumbs';
import { useQuery } from 'react-query';
import { capitalize } from '../../../utils/functions/capitalize';
import GroupServices from '../../../services/group-services';
import PrimaryButton from '../../../components/primary-button';
import { permissionToJson } from '../../../utils/functions/permissionJson';
import { toast } from 'react-toastify';
import { GroupHandler } from '../../../handlers/group/group-handler';

const title = ['id', 'action', 'objectType', 'objectId'];

const ManageGroupEditPermission = () => {
  const { id } = useParams();
  const { data: permissionsData } = useQuery(
    'permissions',
    PermissionServices.getPermissions
  );
  const [selectedPermission, setSelectedPermission] = useState<Permission[]>(
    []
  );
  const [showEnabled, setShowEnabled] = useState<boolean>(false);
  const { data: groupData } = useQuery(`groups/${id}`, () =>
    GroupServices.getOneGroup(id)
  );

  const permissions = permissionsData
    ? permissionsData.map((p: any) => ({
        id: `${p.PermissionAction.name}.${p.ObjectType.name}.${p.object_id}`,
        action: capitalize(p.PermissionAction.name),
        objectType: capitalize(p.ObjectType.name),
        objectId: p.object_id,
      }))
    : [];

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

  const handleEditPermissionSubmit = () => {
    console.log(permissionToJson(selectedPermission, permissions));
    try {
      toast.promise(
        GroupHandler.handleEditGroupPermissionSubmit(
          id as string | number,
          permissionToJson(selectedPermission, permissions)
        ),
        {
          success: 'Successfully edit group permission',
          pending: 'Waiting for edit group permission!',
          error: {
            render({ data }: any) {
              return data.message;
            },
          },
        }
      );
    } catch (e) {}
  };

  useEffect(() => {
    if (groupData && permissions) {
      const p = JSON.parse(groupData.permissions);
      for (let action in p) {
        for (let objectType in p[action]) {
          p[action][objectType].forEach((id: any) => {
            const fullId = `${action}.${objectType}.${id}`;
            setSelectedPermission((v) => [
              ...v,
              permissions.find((p: any) => p.id === fullId),
            ]);
          });
        }
      }
    }
  }, [groupData, permissionsData]);

  return permissions ? (
    <div className="flex flex-col gap-4">
      <Breadcrumbs pages={breadcrumbsPages}></Breadcrumbs>
      <div className="flex justify-between">
        <div className="text-xl font-semibold">Edit Permission</div>
        <div className="flex flex-row justify-end">
          <PrimaryButton
            onClick={handleEditPermissionSubmit}
            content="Save Changes"
            type="submit"
          />
        </div>
      </div>
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
            <InputSwitch
              label={'Show enabled only'}
              onChange={setShowEnabled}
            />
          </div>
          <TableCheckbox
            title={title}
            content={
              permissions
                ? showEnabled
                  ? permissions
                      .filter((v: any) =>
                        selectedPermission.find((p) => p.id === v.id)
                      )
                      .filter((v: any) => v.id.includes(search.toLowerCase()))
                  : permissions.filter((v: any) =>
                      v.id.includes(search.toLowerCase())
                    )
                : []
            }
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
