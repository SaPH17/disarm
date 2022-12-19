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

const items: ActionButtonItem[] = [
  {
    id: '1',
    name: 'Add User',
    onClickFunction: () => {},
  },
  {
    id: '2',
    name: 'Generate Report',
    onClickFunction: () => {},
  },
  {
    id: '3',
    name: 'Delete Project',
    onClickFunction: () => {},
  },
];

const title = ['name', 'company', 'checklist', 'phase', 'report'];
const contentTitle = ['name', 'company', 'phase', 'assignedUser'];

export default function ManageProjectIndex() {
  const { data } = useQuery('projects', ProjectServices.getProjects);
  const projects =
    data?.map((project: Project) => ({
      ...project,
      checklist: project.Checklist?.name,
    })) || [];
  const [activeProject, setActiveProject] = useState<Project>(defaultProject);
  const [selectedProject, setSelectedProject] = useState<Project[]>([]);
  const navigate = useNavigate();

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
          content={projects as object[]}
          selectedData={selectedProject}
          setSelectedData={setSelectedProject}
          onRowClickFunction={(project: any) => {
            setActiveProject(project);
          }}
          onClickFunction={(project: any) => {
            navigate('/projects/' + project.id);
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
    </>
  ) : (
    <></>
  );
}
