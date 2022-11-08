import { useNavigate } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import Table from '../../../components/table';
import PrimaryButton from '../../../components/primary-button';
import ActionButton, {
  ActionButtonItem,
} from '../../../components/action-button';

const content = [
  {
    id: '1',
    name: 'Project A',
    company: 'Company A',
    standard: 'Standard A',
    status: 'On Going',
    phase: '',
    report: 'Download Report',
  },
  {
    id: '2',
    name: 'Project A',
    company: 'Company A',
    standard: 'Standard A',
    status: 'Approved',
    phase: '',
    report: 'Download Report',
  },
  {
    id: '3',
    name: 'Project A',
    company: 'Company A',
    standard: 'Standard A',
    status: 'Not Started',
    phase: '',
    report: 'No Report',
  },
  {
    id: '4',
    name: 'Project A',
    company: 'Company A',
    standard: 'Standard A',
    status: 'On Going',
    phase: '',
    report: 'Download Report',
  },
];

const items: ActionButtonItem[] = [
  {
    id: '1',
    name: 'Edit Project',
    url: '/',
  },
  {
    id: '2',
    name: 'Add User',
    url: '/',
  },
  {
    id: '3',
    name: 'Generate Report',
    url: '/',
  },
];

const title = ['name', 'company', 'standard', 'status', 'phase', 'report'];

export default function ManageProjectIndex() {
  const navigate = useNavigate();

  function handleRedirectToProjectDetail(project: any) {
    navigate('/manage/project/' + project.id);
  }
  return (
    <>
      <div className="text-xl font-semibold">Manage Project</div>
      <div className="flex flex-row justify-between gap-2 sm:gap-4">
        <NavLink to={'/manage/project/create'}>
          <PrimaryButton content="Create Project" />
        </NavLink>
        <ActionButton items={items} />
      </div>
      <div className="flex flex-col gap-2 sm:gap-4 p-2 sm:p-4 bg-gray-100 rounded border-4 border-dashed ">
        <div className="text-lg font-semibold">Current Projects</div>
        <Table
          title={title}
          content={content}
          isClickable={true}
          onClickFunction={handleRedirectToProjectDetail}
        />
      </div>
    </>
  );
}
