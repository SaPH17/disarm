import { useParams } from 'react-router-dom';
import SelectedDetail from '../../../components/selected-detail';
import Table from '../../../components/table';
import PrimaryButton from '../../../components/primary-button';
import ProjectServices from '../../../services/project-services';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';

const content = [
  {
    id: '1',
    title: 'Finding A',
    impactedSystem: 'Homepage',
    risk: 'High',
    phase: 'Fixing',
    action: 'Action',
  },
  {
    id: '2',
    title: 'Finding B',
    impactedSystem: 'Homepage',
    risk: 'High',
    phase: 'Fixed',
    action: 'Action',
  },
  {
    id: '3',
    title: 'Finding C',
    impactedSystem: 'Homepage',
    risk: 'High',
    phase: 'Confirmed',
    action: 'Action',
  },
  {
    id: '4',
    title: 'Finding D',
    impactedSystem: 'Homepage',
    risk: 'High',
    phase: 'Closed on Notes',
    action: 'Action',
  },
  {
    id: '5',
    title: 'Finding E',
    impactedSystem: 'Homepage',
    risk: 'High',
    phase: 'Revision',
    action: 'Action',
  },
];

const title = ['id', 'title', 'impactedSystem', 'risk', 'phase', 'action'];
const contentTitle = ['name', 'company', 'checklist', 'phase', 'assignedUser'];

export default function ManageProjectShow() {
  const params = useParams();
  const { data } = useQuery(`project/${params.id}`, () =>
    ProjectServices.getOneProject(params.id)
  );
  const project = data
    ? {
        ...data,
        checklist: data.Checklist?.name,
        findings: data.Findings,
      }
    : [];

  console.log(project);

  return project ? (
    <>
      <div className="flex flex-row justify-between">
        <div className="text-xl font-semibold">{project.name}</div>
        <Link to={`/projects/${params.id}/edit`}>
          <PrimaryButton content="Edit Project" />
        </Link>
      </div>
      <SelectedDetail
        title={'Project Detail'}
        contentTitle={contentTitle}
        content={project}
      />
      <div className="flex flex-row justify-end gap-4">
        <Link to={`/projects/${params.id}/insert-finding`}>
          <PrimaryButton content="Insert Finding" />
        </Link>
        <button
          type="button"
          className="inline-flex items-center px-3 py-2 text-sm font-medium leading-4 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Download Report
        </button>
      </div>
      <div className="flex flex-col gap-2 p-2 bg-gray-100 border-4 border-dashed rounded sm:gap-4 sm:p-4 ">
        <div className="text-lg font-semibold">Findings</div>
        <Table title={title} content={project.findings || []} />
      </div>
    </>
  ) : (
    <></>
  );
}
