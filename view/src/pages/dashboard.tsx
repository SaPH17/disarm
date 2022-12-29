import { useNavigate } from 'react-router-dom';
import Table from '../components/table';
import { Project } from '../models/project';
import { useQuery } from 'react-query';
import ProjectServices from '../services/project-services';

const title = ['name', 'company', 'phase', 'action'];

export default function Dashboard() {
  const navigate = useNavigate();
  const { data } = useQuery('projects', ProjectServices.getProjects);
  const projects =
    data?.map((project: Project) => ({
      ...project,
      checklist: project.Checklist?.name,
      action: (
        <div
          className="cursor-pointer"
          onClick={() => navigate(`/projects/${project.id}`)}
        >
          View
        </div>
      ),
    })) || [];

  return (
    <>
      <div className="text-xl font-bold">Dashboard</div>
      <div className="flex flex-col gap-1 sm:gap-2">
        <div className="text-lg font-semibold">Projects</div>
        <Table
          title={title}
          content={projects as object[]}
          isClickable={true}
          onClickFunction={(project: Project) => {
            navigate(`/projects/${project.id}`);
          }}
        />
      </div>
    </>
  );
}
