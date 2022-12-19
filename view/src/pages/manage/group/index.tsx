import SelectedDetail from '../../../components/selected-detail';
import PrimaryButton from '../../../components/primary-button';
import ActionButton, {
  ActionButtonItem,
} from '../../../components/action-button';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Group } from '../../../models/group';
import GroupServices from '../../../services/group-services';
import TableCheckbox from '../../../components/table-checkbox';
import { defaultGroup } from '../../../data/default-values';
import { useQuery } from 'react-query';
import { toast } from 'react-toastify';
import { GroupHandler } from '../../../handlers/group/group-handler';
import DeletePopup from '../../../components/popup/delete-popup';

const title = ['name', 'description'];

const contentTitle = [
  'name',
  'description',
  'permissions',
  'directParentGroup',
];

export default function ManageGroupIndex() {
  const [openDeletePopup, setOpenDeletePopup] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<Group[]>([]);
  const [activeGroup, setACtiveGroup] = useState<Group>(defaultGroup);
  const items: ActionButtonItem[] = [
    {
      id: '1',
      name: 'Delete Group',
      onClickFunction: () => {
        if (!selectedGroup) return;
        if (!selectedGroup.filter((group: Group) => group.id !== -1).length)
          return;
        setOpenDeletePopup(true);
      },
    },
  ];

  const { data, refetch } = useQuery('groups', GroupServices.getGroups);
  const groups =
    data?.map((r: Group) => ({
      id: r.id,
      name: r.name,
      description: r.description,
      directParentGroup: r.directParentGroup,
      permissions: r.permissions,
    })) || [];

  function deleteGroups() {
    if (!selectedGroup) return;
    const ids = selectedGroup.map((group: Group) => group.id);
    try {
      toast.promise(GroupHandler.handleDeleteGroupSubmit(ids), {
        success: `Successfully delete ${ids.length} group(s)!`,
        pending: `Waiting for delete ${ids.length} group(s)!`,
        error: {
          render({ data }: any) {
            return data.message;
          },
        },
      });
      refetch();
    } catch (e) {}
  }

  return (
    <>
      <div className="text-xl font-semibold">Manage Group</div>
      <div className="flex flex-row justify-between gap-2 sm:gap-4">
        <Link to="/groups/create">
          <PrimaryButton content="Create Group" />
        </Link>
        <ActionButton items={items} />
      </div>

      <div className="flex flex-col gap-1 sm:gap-2">
        <div className="text-lg font-semibold">Groups</div>
        {groups && (
          <TableCheckbox
            title={title}
            selectedData={selectedGroup}
            setSelectedData={setSelectedGroup}
            content={groups as object[]}
            onRowClickFunction={(group: any) => {
              setACtiveGroup(group);
            }}
          />
        )}
      </div>

      <SelectedDetail
        title={'Group Detail'}
        contentTitle={contentTitle}
        content={activeGroup}
      >
        <div className="flex items-center gap-4">
          <div>
            <Link
              to={`/groups/${activeGroup.id}/edit-permission`}
              className={'underline'}
            >
              Edit Permission
            </Link>
          </div>
          <div>
            <Link to={`/groups/${activeGroup.id}/edit`}>
              <PrimaryButton content="Edit" />
            </Link>
          </div>
        </div>
      </SelectedDetail>
      {selectedGroup && (
        <DeletePopup
          title="Delete Users"
          selectedData={selectedGroup}
          onClickFunction={deleteGroups}
          open={openDeletePopup}
          setOpen={setOpenDeletePopup}
        />
      )}
    </>
  );
}
