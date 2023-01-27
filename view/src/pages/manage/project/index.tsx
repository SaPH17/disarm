import { useNavigate } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import TableCheckbox from '../../../components/table-checkbox';
import PrimaryButton from '../../../components/primary-button';
import ActionButton, {
  ActionButtonItem,
} from '../../../components/action-button';
import { useState } from 'react';
import ProjectServices from '../../../services/project-services';
import { Project } from '../../../models/project';
import { defaultProject } from '../../../data/default-values';
import SelectedDetail from '../../../components/selected-detail';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import DeletePopup from '../../../components/popup/delete-popup';
import { toast } from 'react-toastify';
import { DeleteProjectsHandler } from '../../../handlers/project/delete-project-handler';
import GenerateReportPopup from '../../../components/popup/generate-report-popup';
import { toReadableDate } from '../../../utils/functions/dates';
import ReportPopup from '../../../components/popup/report.popup';
import { DocumentIcon } from '@heroicons/react/outline';
import { GenerateReportHandler } from '../../../handlers/report/generate-report-handler';
import CheckChecklistPopup from '../../../components/popup/check-checklist-popup';
import FindingServices from '../../../services/finding-services';

const title = ['name', 'company', 'phase', 'action'];
const contentTitle = [
  'id',
  'name',
  'company',
  'phase',
  'checklist',
  'totalFinding',
  'startDate',
  'endDate',
  'projectPercentage',
];
export const REPORT_URL_PREFIX = 'http://localhost:8000/reports';

function parseChecklistData(data: any) {
  try {
    return JSON.parse(data);
  } catch (e) {
    return null;
  }
}

export function getChecklistPercentage(project: Project): string {
  const checklist = parseChecklistData(project.Checklist?.sections || '');
  const checklistSections = checklist.reduce(
    (total: number, checklist: any) => total + checklist.details.length,
    0
  );

  const sectionsLength =
    (parseChecklistData(project.sections) || []).length || 0;
  return (sectionsLength * 100) / checklistSections + '%';
}

export default function ManageProjectIndex() {
  const navigate = useNavigate();
  const [openedModal, setOpenedModal] = useState<any>({
    delete: false,
    generateReport: false,
    reports: false,
    checkChecklist: false,
  });

  const { data, refetch: refetchProject } = useQuery(
    'projects',
    ProjectServices.getProjects
  );

  const projectActionButton = (
    <div
      className="cursor-pointer"
      onClick={() => {
        setOpenedModal({ ...openedModal, reports: true });
      }}
    >
      View Report
    </div>
  );

  const projects =
    data?.map((project: Project) => ({
      ...project,
      checklist: project.Checklist?.name,
      totalFinding: project.Findings?.length || 0,
      startDate: toReadableDate(project.start_date),
      endDate: toReadableDate(project.end_date),
      reports: project.Reports?.map((report) => ({
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
      action: projectActionButton,
    })) || [];

  const [activeProject, setActiveProject] = useState<Project>(defaultProject);
  const [selectedProject, setSelectedProject] = useState<Project[]>([]);

  async function callFetchData() {
    await refetchProject();
    setActiveProject(defaultProject);
  }

  const items: ActionButtonItem[] = [
    {
      id: '1',
      name: 'Delete Project',
      onClickFunction: () => {
        if (!selectedProject) return;
        if (
          !selectedProject.filter((project: Project) => project.id !== -1)
            .length
        )
          return;
        setOpenedModal({
          ...openedModal,
          delete: true,
        });
      },
    },
    {
      id: '2',
      name: 'Generate Report',
      onClickFunction: () => {
        if (!selectedProject) return;
        if (
          !selectedProject.filter((project: Project) => project.id !== -1)
            .length
        )
          return;
        setOpenedModal({
          ...openedModal,
          generateReport: true,
        });
      },
    },
  ];

  function generateReport() {
    if (!selectedProject) return;
    selectedProject.forEach((project: Project) => {
      try {
        const id = project.id;
        toast.promise(GenerateReportHandler.handleGenerateReport(id), {
          success: `Report generated for ${project.name}`,
          pending: `Generating report for ${project.name}`,
          error: {
            render({ data }: any) {
              return data.message;
            },
          },
        });
      } catch (e) {}
    });
    refetchProject();
    setSelectedProject([]);
  }

  async function deleteProjects() {
    if (!selectedProject) return;
    const ids = selectedProject.map((project: Project) => project.id);
    try {
      await Promise.all(
        ids.map(async (id, index) =>
          toast.promise(DeleteProjectsHandler.handleDeleteProjectSubmit(id), {
            success: `Successfully deleted ${selectedProject[index].name} project!`,
            pending: `Deleting ${selectedProject[index].name} project!`,
            error: {
              render({ data }: any) {
                return data.message;
              },
            },
          })
        )
      );
      refetchProject();
      setSelectedProject([]);
    } catch (e) {}
  }

  return projects ? (
    <>
      <div className="text-xl font-semibold">Manage Project</div>
      <div className="flex flex-row justify-between gap-2 sm:gap-4">
        <NavLink to={'/projects/create'}>
          <PrimaryButton content="Create Project" />
        </NavLink>
        <ActionButton items={items} />
      </div>
      <div className="flex flex-col gap-1 sm:gap-2">
        <div className="text-lg font-semibold">Projects</div>
        <TableCheckbox
          title={title}
          selectedData={selectedProject}
          setSelectedData={setSelectedProject}
          content={projects as object[]}
          onRowClickFunction={(project: Project) => {
            const percentage = getChecklistPercentage(project);
            setActiveProject({
              ...project,
              projectPercentage: percentage,
            });
          }}
          onClickFunction={(project: Project) => {
            navigate(`/projects/${project.id}`);
          }}
        />
      </div>

      <SelectedDetail
        title={'Project Detail'}
        contentTitle={contentTitle}
        content={activeProject}
      >
        <div className="flex items-center gap-4">
          <div>
            <span
              className="underline cursor-pointer"
              onClick={() =>
                setOpenedModal({
                  ...openedModal,
                  checkChecklist: true,
                })
              }
            >
              Check Checklist
            </span>
          </div>
          <div>
            <Link to={`/projects/${activeProject.id}`} className={'underline'}>
              View Detail
            </Link>
          </div>
          <div>
            <Link to={`/projects/${activeProject.id}/edit`}>
              <PrimaryButton content="Edit" />
            </Link>
          </div>
        </div>
      </SelectedDetail>
      {selectedProject && (
        <DeletePopup
          title="Delete Projects"
          selectedData={selectedProject}
          onClickFunction={deleteProjects}
          open={openedModal.delete}
          setOpen={(val) =>
            setOpenedModal({
              ...openedModal,
              delete: val,
            })
          }
        />
      )}
      {selectedProject && (
        <GenerateReportPopup
          title="Generate Report"
          selectedData={selectedProject}
          onClickFunction={generateReport}
          open={openedModal.generateReport}
          setOpen={(val) =>
            setOpenedModal({
              ...openedModal,
              generateReport: val,
            })
          }
        />
      )}
      {selectedProject && (
        <ReportPopup
          icon={
            <DocumentIcon
              className="w-6 h-6 text-green-600"
              aria-hidden="true"
            />
          }
          title="Project Reports"
          availableData={activeProject.reports || []}
          open={openedModal.reports}
          setOpen={(val: any) =>
            setOpenedModal({
              ...openedModal,
              reports: val,
            })
          }
        />
      )}
      <CheckChecklistPopup
        selectedData={activeProject}
        open={openedModal.checkChecklist}
        fetchData={callFetchData}
        setOpen={(val: any) => {
          setOpenedModal({ ...openedModal, checkChecklist: val });
        }}
      />
    </>
  ) : (
    <></>
  );
}
