import SelectBox, { GeneralSelectBoxData, SelectBoxData } from '../../../components/select-box';
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
]

const title = ['name', 'groups', 'status'];

export default function ManageUserIndex() {
  return (
    <>
      <div className="text-xl font-semibold">Manage User</div>
      <div className="flex flex-col gap-2 sm:gap-4 p-2 sm:p-4 bg-gray-100 rounded">
        <div className="text-lg font-semibold">Users</div>
        <Table title={title} content={content} />
      </div>
      <div className="flex flex-col bg-gray-100 divide-y">
        <div className="flex flex-row justify-between items-center p-2 sm:p-4">
          <div className="text-lg font-semibold">User Detail</div>
          <SelectBox items={items} defaultValue={ '-- Select Action --' } />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 p-2 sm:p-4">
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
