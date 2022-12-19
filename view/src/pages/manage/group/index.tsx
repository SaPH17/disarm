import SelectedDetail from '../../../components/selected-detail';
import PrimaryButton from '../../../components/primary-button';
import ActionButton, {
  ActionButtonItem,
} from '../../../components/action-button';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Group } from '../../../models/group';
import GroupServices from '../../../services/group-services';
import TableCheckbox from '../../../components/table-checkbox';
import { defaultGroup } from '../../../data/default-values';
import { useQuery } from 'react-query';

const title = ['name', 'description'];

const items: ActionButtonItem[] = [
  {
    id: '1',
    name: 'Delete Group',
    onClickFunction: () => { }
  },
];

const contentTitle = [
  'name',
  'description',
  'permissions',
  'directParentGroup',
];

export default function ManageGroupIndex() {
  const { data } = useQuery('groups', GroupServices.getGroups);
  const groups =
    data?.map((r: Group) => ({
      id: r.id,
      name: r.name,
      description: r.description,
      directParentGroup: r.directParentGroup,
      permissions: r.permissions,
    })) || [];

  const [selectedGroup, setSelectedGroup] = useState<Group[]>([defaultGroup]);
  const navigate = useNavigate();

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
        <div className="flex items-center gap-4">
          <div>
            <Link
              to={`/groups/${
                selectedGroup[selectedGroup.length - 1].id
              }/edit-permission`}
              className={'underline'}
            >
              Edit Permission
            </Link>
          </div>
          <div>
            <Link
              to={`/groups/${selectedGroup[selectedGroup.length - 1].id}/edit`}
            >
              <PrimaryButton content="Edit" />
            </Link>
          </div>
        </div>
      </SelectedDetail>
    </>
  );
}
