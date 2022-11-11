import SelectedDetail from '../../../components/selected-detail';
import PrimaryButton from '../../../components/primary-button';
import ActionButton, {
  ActionButtonItem,
} from '../../../components/action-button';
import { useNavigate } from 'react-router-dom';
import TableCheckbox from '../../../components/table-checkbox';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Group } from '../../../models/group';
import GroupServices from '../../../services/group-services';

const title = ['name', 'description'];

const items: ActionButtonItem[] = [
  {
    id: '1',
    name: 'Delete Group',
    url: '/',
  },
  {
    id: '2',
    name: 'Assign User',
    url: '/',
  },
];

const contentTitle = [
  'name',
  'description',
  'permissions',
  'directParentGroup',
];

export default function ManageGroupIndex() {
  const [groups, setGroups] = useState<Group[]>();
  const [selectedGroup, setSelectedGroup] = useState<any[]>([
    {
      id: -1,
      name: '-',
      description: '-',
      permissions: '-',
      directParentGroup: '-',
    },
  ]);
  const navigate = useNavigate();

  async function fetchGroups() {
    const result = await GroupServices.getGroups();
    setGroups(result);
  }

  useEffect(() => {
    fetchGroups();
  }, []);

  return (
    <>
      <div className="text-xl font-semibold">Manage Group</div>
      <div className="flex flex-row gap-2 sm:gap-4 justify-between">
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
            content={groups as object[]}
            onCheckedFunction={(group: any) => {
              setSelectedGroup([...selectedGroup, group]);
            }}
            onUncheckedFunction={(group: any) => {
              setSelectedGroup(selectedGroup.filter((item) => item !== group));
            }}
            onClickFunction={(group: any) => {
              navigate(`/groups/${group.id}`);
            }}
          />
        )}
      </div>

      <SelectedDetail
        title={'Group Detail'}
        contentTitle={contentTitle}
        content={selectedGroup[selectedGroup.length - 1]}
      >
        <Link to={`/groups/${selectedGroup[selectedGroup.length - 1].id}/edit`}>
          <PrimaryButton content="Edit" />
        </Link>
      </SelectedDetail>
    </>
  );
}
