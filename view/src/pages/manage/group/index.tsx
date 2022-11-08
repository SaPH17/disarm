import Table from '../../../components/table';
import SelectedDetail from '../../../components/selected-detail';
import PrimaryButton from '../../../components/primary-button';
import ActionButton, {
  ActionButtonItem,
} from '../../../components/action-button';

const content = [
  {
    name: 'Role A',
    description: 'Role for admin',
  },
  {
    name: 'Role B',
    description: 'Role for pentester',
  },
  {
    name: 'Role C',
    description: 'Role for SysAdmin',
  },
  {
    name: 'Role D',
    description: 'Role for others',
  },
];

const items: ActionButtonItem[] = [
  {
    id: '1',
    name: 'Edit Group',
    url: '/',
  },
  {
    id: '2',
    name: 'Delete Group',
    url: '/',
  },
  {
    id: '3',
    name: 'Assign User',
    url: '/',
  },
];

const title = ['name', 'description'];

const contentTitle = [
  'name',
  'description',
  'permissions',
  'directParentGroup',
];
const contentData = {
  name: 'Role A',
  description: 'Role for admin',
  Permissions: '- updateuser.*',
  directParentGroup: 'Role B',
};

export default function ManageGroupIndex() {
  return (
    <>
      <div className="text-xl font-semibold">Manage Group</div>
      <div className="flex flex-row gap-2 sm:gap-4 justify-between">
        <PrimaryButton content="Create Group" />
        <ActionButton items={items} />
      </div>
      <div className="flex flex-col gap-2 sm:gap-4 p-2 sm:p-4 bg-gray-100 rounded border-4 border-dashed">
        <div className="text-lg font-semibold">Groups</div>
        <Table title={title} content={content} isClickable={true} />
      </div>

      <SelectedDetail
        title={'Group Detail'}
        contentTitle={contentTitle}
        content={contentData}
      />
    </>
  );
}
