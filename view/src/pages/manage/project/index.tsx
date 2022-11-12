import { useNavigate } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import Table from '../../../components/table';
import PrimaryButton from '../../../components/primary-button';
import ActionButton, {
  ActionButtonItem,
} from '../../../components/action-button';
import { useEffect, useState } from 'react';
import ProjectServices from '../../../services/project-services';
import { Project } from '../../../models/project';

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
  const [projects, setProjects] = useState<Project[]>();
  const navigate = useNavigate();

  function handleRedirectToProjectDetail(project: any) {
    navigate('/projects/' + project.id);
  }

  async function fetchProjects() {
    const result = await ProjectServices.getProjects();
    setProjects(result);
  }

  useEffect(() => {
    fetchProjects();
  }, []);

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
        <Table
          title={title}
          content={projects as object[]}
          isClickable={true}
          onClickFunction={handleRedirectToProjectDetail}
        />
      </div>
    </>
  ) : (
    <></>
  );
}
