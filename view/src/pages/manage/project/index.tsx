import SelectBox, { GeneralSelectBoxData, SelectBoxData } from '../../../components/select-box';
import Table from '../../../components/table';

const content = [
  {
    name: 'Project A',
    company: 'Company A',
    standard: 'Standard A',
    status: 'On Going',
    phase: '',
    report: 'Download Report'
  },
  {
    name: 'Project A',
    company: 'Company A',
    standard: 'Standard A',
    status: 'Approved',
    phase: '',
    report: 'Download Report'
  },
  {
    name: 'Project A',
    company: 'Company A',
    standard: 'Standard A',
    status: 'Not Started',
    phase: '',
    report: 'No Report'
  },
  {
    name: 'Project A',
    company: 'Company A',
    standard: 'Standard A',
    status: 'On Going',
    phase: '',
    report: 'Download Report'
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
]

const title = ['name', 'company', 'standard', 'status', 'phase', 'report'];

export default function ManageProjectIndex() {
  return (
    <>
      <div className="text-xl font-semibold">Manage Project</div>
      <div className="flex flex-row justify-between gap-2 sm:gap-4">
        <button
          type="button"
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Create Project
        </button>
        <SelectBox items={items} defaultValue={ '-- Select Action --' } />
      </div>
      <div className="flex flex-col gap-2 sm:gap-4 p-2 sm:p-4 bg-gray-100 rounded border border-4 border-dashed rounded">
        <div className="text-lg font-semibold">Current Projects</div>
        <Table title={title} content={content} />
      </div>
    </>
  );
}
