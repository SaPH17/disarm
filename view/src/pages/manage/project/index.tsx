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
import ReportPopup from '../../../components/popup/report-popup';

const title = ['name', 'company', 'phase', 'report'];
const contentTitle = ['id', 'name', 'company', 'phase', 'checklist'];

export default function ManageProjectIndex() {
  const navigate = useNavigate();
  const [openDeletePopup, setOpenDeletePopup] = useState(false);
  const [isReportPopupOpened, setIsReportPopupOpened] = useState(false);

  const { data, refetch } = useQuery('projects', ProjectServices.getProjects);
  const projects =
    data?.map((project: Project) => ({
      ...project,
      checklist: project.Checklist?.name,
    })) || [];

  const [activeProject, setActiveProject] = useState<Project>(defaultProject);
  const [selectedProject, setSelectedProject] = useState<Project[]>([]);

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
        setOpenDeletePopup(true);
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
        setIsReportPopupOpened(true);
      },
    },
  ];

  function generateReport() {
    if (!selectedProject) return;
    const ids = selectedProject.map((project: Project) => project.id);
    console.log(ids);
    //logic
    // try {
    //   toast.promise(DeleteProjectsHandler.handleDeleteProjectSubmit(ids), {
    //     success: `Successfully deleted ${ids.length} project(s)!`,
    //     pending: `Deleting ${ids.length} project(s)!`,
    //     error: {
    //       render({ data }: any) {
    //         return data.message;
    //       },
    //     },
    //   });
    //   refetch();
    //   setSelectedProject([]);
    // } catch (e) {}
  }

  function deleteProjects() {
    if (!selectedProject) return;
    const ids = selectedProject.map((project: Project) => project.id);
    try {
      toast.promise(DeleteProjectsHandler.handleDeleteProjectSubmit(ids), {
        success: `Successfully deleted ${ids.length} project(s)!`,
        pending: `Deleting ${ids.length} project(s)!`,
        error: {
          render({ data }: any) {
            return data.message;
          },
        },
      });
      refetch();
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
            setActiveProject(project);
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
          open={openDeletePopup}
          setOpen={setOpenDeletePopup}
        />
      )}
      {selectedProject && (
        <ReportPopup
          title="Generate Report"
          selectedData={selectedProject}
          onClickFunction={generateReport}
          open={isReportPopupOpened}
          setOpen={setIsReportPopupOpened}
        />
      )}
    </>
  ) : (
    <></>
  );
}
