import SelectBox, { SelectBoxData } from '../../../components/select-box';
import Table from '../../../components/table';
import SelectedDetail from '../../../components/selected-detail';
import PrimaryButton from '../../../components/primary-button';

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

const items: SelectBoxData[] = [
  {
    id: '1',
    name: 'Edit Group',
  },
  {
    id: '2',
    name: 'Delete Group',
  },
  {
    id: '3',
    name: 'Assign User',
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
        <SelectBox items={items} defaultValue={'-- Select Action --'} />
      </div>

      <div className="flex flex-col gap-1 sm:gap-2">
        <div className="text-lg font-semibold">Groups</div>
        <Table title={title} content={content} />
      </div>

      <SelectedDetail
        title={'Group Detail'}
        contentTitle={contentTitle}
        content={contentData}
      />
    </>
  );
}
