import { useNavigate } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import SelectBox, { SelectBoxData } from '../../../components/select-box';
import Table from '../../../components/table';
import PrimaryButton from '../../../components/primary-button';

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

const items: SelectBoxData[] = [
  {
    id: '1',
    name: 'Edit Project',
  },
  {
    id: '2',
    name: 'Add User',
  },
  {
    id: '3',
    name: 'Generate Report',
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
        <SelectBox items={items} defaultValue={'-- Select Action --'} />
      </div>
      <div className="flex flex-col gap-2 sm:gap-4 p-2 sm:p-4 bg-gray-100 rounded border border-4 border-dashed rounded">
        <div className="text-lg font-semibold">Current Projects</div>
        <Table
          title={title}
          content={content}
          onClickFunction={handleRedirectToProjectDetail}
        />
      </div>
    </>
  );
}
