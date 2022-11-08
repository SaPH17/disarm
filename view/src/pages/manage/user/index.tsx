import Table from '../../../components/table';
import SelectedDetail from '../../../components/selected-detail';
import PrimaryButton from '../../../components/primary-button';
import ActionButton, {
  ActionButtonItem,
} from '../../../components/action-button';
import { Link } from 'react-router-dom';

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

const items: ActionButtonItem[] = [
  {
    id: '1',
    name: 'Edit User',
    url: '/',
  },
  {
    id: '2',
    name: 'Delete User',
    url: '/',
  },
  {
    id: '3',
    name: 'Add Group',
    url: '/',
  },
  {
    id: '4',
    name: 'Assign Project',
    url: '/',
  },
  {
    id: '5',
    name: 'View All Project',
    url: '/',
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
      <div className="flex flex-row gap-2 sm:gap-4 justify-between">
        <Link to="/manage/user/create">
          <PrimaryButton content="Create User" />
        </Link>

        <ActionButton items={items} />
      </div>

      <div className="flex flex-col gap-1 sm:gap-2">
        <div className="text-lg font-semibold">Users</div>
        <Table title={title} content={content} />
      </div>

      <SelectedDetail
        title={'User Detail'}
        contentTitle={contentTitle}
        content={contentData}
      />
    </>
  );
}
