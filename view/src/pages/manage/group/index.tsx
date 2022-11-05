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
      <div className="flex flex-row gap-2 sm:gap-4">
        <PrimaryButton content="Create Group" />
        <button
          type="button"
          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Delete Group
        </button>
      </div>
      <div className="flex flex-col gap-2 sm:gap-4 p-2 sm:p-4 bg-gray-100 rounded border border-4 border-dashed rounded">
        <div className="text-lg font-semibold">Groups</div>
        <Table title={title} content={content} />
      </div>

      <SelectedDetail
        title={'Group Detail'}
        selectBox={
          <SelectBox items={items} defaultValue={'-- Select Action --'} />
        }
        contentTitle={contentTitle}
        content={contentData}
      />
    </>
  );
}
