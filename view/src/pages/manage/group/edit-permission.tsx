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
import { permissionToJson } from '../../../utils/functions/jsonConverter';
import { toast } from 'react-toastify';
import { GroupHandler } from '../../../handlers/group/group-handler';

const title = ['id', 'action', 'objectType', 'objectInformation'];

const ManageGroupEditPermission = () => {
  const { id } = useParams();
  const { data: permissionsData } = useQuery(
    'permissions',
    PermissionServices.getPermissions,
    {
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    }
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
        objectInformation: (
          <div className="flex flex-col">
            <div className="font-bold">{p.object_id}</div>
            <div>{p.object_name}</div>
          </div>
        ),
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
    try {
      toast.promise(
        GroupHandler.handleEditGroupPermissionSubmit(
          id as string | number,
          permissionToJson(selectedPermission, permissions)
        ),
        {
          success: 'Successfully edit group permission',
          pending: 'Editing group permission',
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
    if (groupData && permissions.length > 0) {
      const p = JSON.parse(groupData.permissions);
      setSelectedPermission([]);
      for (let action in p) {
        for (let objectType in p[action]) {
          p[action][objectType].forEach((id: any) => {
            const fullId = `${action}.${objectType}.${id}`;
            setSelectedPermission((v) => {
              const val = permissions.find((p: any) => p.id === fullId);
              return val ? [...v, val] : v;
            });
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
      <div className="flex flex-col text-sm bg-white rounded shadow sm:gap-2 divide-y-1">
        <div className="flex flex-row items-center justify-between px-2 py-2 sm:px-8 sm:py-4 bg-gray-50">
          <div className="text-lg font-semibold">Available Permission</div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <SearchIcon
                className="w-5 h-5 text-gray-400"
                aria-hidden="true"
              />
            </div>
            <input
              id="search"
              name="search"
              className="block w-full py-2 pl-10 pr-3 leading-5 placeholder-gray-500 bg-white border border-gray-300 rounded-md focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Search"
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="flex flex-col gap-4 px-8 pt-4 pb-8">
          <div className="flex items-center justify-between">
            <InputSwitch
              label={'Show enabled only'}
              onChange={setShowEnabled}
            />
          </div>
          {permissionsData && (
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
          )}
        </div>
      </div>
    </div>
  ) : (
    <></>
  );
};

export default ManageGroupEditPermission;
