import { useNavigate, useParams } from 'react-router-dom';
import SelectedDetail from '../../../components/selected-detail';
import Table from '../../../components/table';
import PrimaryButton from '../../../components/primary-button';
import ProjectServices from '../../../services/project-services';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { getChecklistPercentage } from '.';

const title = [
  'findingId',
  'title',
  'impactedSystem',
  'risk',
  'status',
  'action',
];
const contentTitle = ['id', 'name', 'company', 'checklist', 'phase', 'projectPercentage'];

export default function ManageProjectShow() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data } = useQuery(`project/${id}`, () =>
    ProjectServices.getOneProject(id)
  );
  const project = data
    ? {
        ...data,
        checklist: data.Checklist?.name,
        findings:
          data.Findings?.map((v: any, idx: any) => {
            return {
              ...v,
              findingId: `${data.name}-${(idx + 1).toLocaleString('en-US', {
                minimumIntegerDigits: 3,
                useGrouping: false,
              })}`,
              impactedSystem: v.impacted_system,
              action: <div className="cursor-pointer">View</div>,
            };
          }) || [],
        projectPercentage: getChecklistPercentage(data)
      }
    : [];

  return project ? (
    <>
      <div className="flex flex-row justify-between">
        <div className="text-xl font-semibold">{project.name}</div>
        <Link to={`/projects/${id}/edit`}>
          <PrimaryButton content="Edit Project" />
        </Link>
      </div>
      <SelectedDetail
        title={'Project Detail'}
        contentTitle={contentTitle}
        content={project}
      />
      <div className="flex flex-row justify-end gap-4">
        <Link to={`/projects/${id}/insert-finding`}>
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
        <Table
          title={title}
          content={project.findings || []}
          onClickFunction={(item: any) => {
            navigate(`/findings/${item.id}`);
          }}
          isClickable={true}
        />
      </div>
    </>
  ) : (
    <></>
  );
}
