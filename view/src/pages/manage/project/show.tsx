import { useNavigate, useParams } from 'react-router-dom';
import SelectedDetail from '../../../components/selected-detail';
import Table from '../../../components/table';
import PrimaryButton from '../../../components/primary-button';
import ProjectServices from '../../../services/project-services';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { toReadableDate } from '../../../utils/functions/dates';
import Breadcrumbs from '../../../components/breadcrumbs';
import { REPORT_URL_PREFIX, getChecklistPercentage } from '.';
import { useState } from 'react';
import ReportPopup from '../../../components/popup/report.popup';
import { DocumentIcon } from '@heroicons/react/outline';
import CheckChecklistPopup from '../../../components/popup/check-checklist-popup';

const title = [
  'findingId',
  'title',
  'impactedSystem',
  'risk',
  'status',
  'action',
];
const contentTitle = [
  'id',
  'name',
  'company',
  'checklist',
  'phase',
  'totalFinding',
  'startDate',
  'endDate',
  'projectPercentage',
];

export default function ManageProjectShow() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, refetch } = useQuery(`project/${id}`, () =>
    ProjectServices.getOneProject(id)
  );
  const [openedModal, setOpenedModal] = useState<any>({
    reports: false,
    checkChecklist: false,
  });
  const project = data
    ? {
        ...data,
        checklist: data.Checklist?.name,
        totalFinding: data.Findings?.length || 0,
        startDate: toReadableDate(data.start_date),
        endDate: toReadableDate(data.end_date),
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
        reports: data.Reports?.map((report: any) => ({
          ...report,
          dateCreated: toReadableDate(report.created_at),
          action: (
            <a
              target="_blank"
              href={`${REPORT_URL_PREFIX}/${report.file}`}
              className="cursor-pointer select-none"
              rel="noreferrer"
            >
              View Report
            </a>
          ),
        })),
        projectPercentage: getChecklistPercentage(data),
      }
    : {};

  const breadcrumbsPages = [
    {
      name: 'Projects',
      url: '/projects',
    },
    {
      name: `${project?.name || '-'}`,
      url: `/projects/${project?.id}/`,
    },
  ];

  async function callFetchData() {
    await refetch();
  }

  return project ? (
    <>
      <Breadcrumbs pages={breadcrumbsPages}></Breadcrumbs>
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
          onClick={() =>
            setOpenedModal({
              ...openedModal,
              checkChecklist: true,
            })
          }
          type="button"
          className="inline-flex items-center px-3 py-2 text-sm font-medium leading-4 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Check Checklist
        </button>
        <button
          onClick={() =>
            setOpenedModal({
              ...openedModal,
              reports: true,
            })
          }
          type="button"
          className="inline-flex items-center px-3 py-2 text-sm font-medium leading-4 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          View Report
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
      <CheckChecklistPopup
        selectedData={project}
        open={openedModal.checkChecklist}
        fetchData={callFetchData}
        setOpen={(val: any) => {
          setOpenedModal({ ...openedModal, checkChecklist: val });
        }}
      />
      {project && (
        <ReportPopup
          icon={
            <DocumentIcon
              className="w-6 h-6 text-green-600"
              aria-hidden="true"
            />
          }
          title="Project Reports"
          availableData={project.reports || []}
          open={openedModal.reports}
          setOpen={(val: any) =>
            setOpenedModal({
              ...openedModal,
              reports: val,
            })
          }
        />
      )}
    </>
  ) : (
    <></>
  );
}
