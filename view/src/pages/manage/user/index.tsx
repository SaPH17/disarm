import SelectBox, {
  GeneralSelectBoxData,
  SelectBoxData,
} from '../../../components/select-box';
import Table from '../../../components/table';

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
      <div className="flex flex-col gap-2 sm:gap-4 bg-gray-100 rounded border border-4 border-dashed rounded divide-y-4 divide-dashed">
        <div className="flex flex-row justify-between items-center px-2 sm:px-4 pt-2 sm:pt-4">
          <div className="text-lg font-semibold">User Detail</div>
          <SelectBox items={items} defaultValue={'-- Select Action --'} />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3">
          <div className="col-span-1 flex flex-col p-2 sm:p-4">
            <div className="font-semibold">Name</div>
            <div>Bambang</div>
          </div>
          <div className="col-span-1 flex flex-col p-2 sm:p-4">
            <div className="font-semibold">Status</div>
            <div>Idle</div>
          </div>
          <div className="col-span-1 flex flex-col p-2 sm:p-4">
            <div className="font-semibold">Groups</div>
            <div>Role A, Role B</div>
          </div>
          <div className="col-span-1 flex flex-col p-2 sm:p-4">
            <div className="font-semibold">Assigned Projects</div>
            <div>Project A, Project B</div>
          </div>
          <div className="col-span-1 flex flex-col p-2 sm:p-4">
            <div className="font-semibold">Direct Supervisor</div>
            <div>Mamang</div>
          </div>
        </div>
      </div>
    </>
  );
}
