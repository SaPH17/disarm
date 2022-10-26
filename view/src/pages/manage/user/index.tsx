import SelectBox, {
  GeneralSelectBoxData,
  SelectBoxData,
} from '../../../components/select-box';
import Table from '../../../components/table';
import SelectedDetail from '../../../components/selected-detail';

const content = [
  {
    name: 'Bambang',
    groups: 'Role A, Role B',
    status: 'Idle',
  },
  {
    name: 'Mamang',
    groups: 'Role B',
    status: 'Idle',
  },
  {
    name: 'Memeng',
    groups: 'Role A',
    status: 'Review',
  },
  {
    name: 'Revaldi',
    groups: 'Role B',
    status: 'Review',
  },
];

const items: SelectBoxData[] = [
  {
    id: '1',
    name: 'Edit User',
  },
  {
    id: '2',
    name: 'Delete User',
  },
  {
    id: '3',
    name: 'Add Group',
  },
  {
    id: '4',
    name: 'Assign Project',
  },

  {
    id: '5',
    name: 'View All Project',
  },
];

const title = ['name', 'groups', 'status'];

const contentTitle = [
  'name',
  'status',
  'groups',
  'assignedProjects',
  'directSupervisor',
];
const contentData = {
  name: 'Bambang',
  status: 'Idle',
  groups: 'Role A, Role B',
  assignedProjects: 'Project A, Project B',
  directSupervisor: 'Mamang',
};

export default function ManageUserIndex() {
  return (
    <>
      <div className="text-xl font-semibold">Manage User</div>
      <div className="flex flex-row gap-2 sm:gap-4">
        <button
          type="button"
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Create User
        </button>
        <button
          type="button"
          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Delete User
        </button>
      </div>
      <div className="flex flex-col gap-2 sm:gap-4 p-2 sm:p-4 bg-gray-100 rounded border border-4 border-dashed rounded">
        <div className="text-lg font-semibold">Users</div>
        <Table title={title} content={content} />
      </div>

      <SelectedDetail
        title={'User Detail'}
        selectBox={
          <SelectBox items={items} defaultValue={'-- Select Action --'} />
        }
        contentTitle={contentTitle}
        content={contentData}
      />
    </>
  );
}
