import { useNavigate, useParams } from 'react-router-dom';
import SelectedDetail from '../../../components/selected-detail';
import Table from '../../../components/table';
import PrimaryButton from '../../../components/primary-button';
import { useEffect, useState } from 'react';
import { Project } from '../../../models/project';
import ProjectServices from '../../../services/project-services';
import { Link } from 'react-router-dom';

const content = [
  {
    id: '1',
    title: 'Finding A',
    impactedSystem: 'Homepage',
    risk: 'High',
    status: 'Fixing',
    action: 'Action',
  },
  {
    id: '2',
    title: 'Finding B',
    impactedSystem: 'Homepage',
    risk: 'High',
    status: 'Fixed',
    action: 'Action',
  },
  {
    id: '3',
    title: 'Finding C',
    impactedSystem: 'Homepage',
    risk: 'High',
    status: 'Confirmed',
    action: 'Action',
  },
  {
    id: '4',
    title: 'Finding D',
    impactedSystem: 'Homepage',
    risk: 'High',
    status: 'Closed on Notes',
    action: 'Action',
  },
  {
    id: '5',
    title: 'Finding E',
    impactedSystem: 'Homepage',
    risk: 'High',
    status: 'Revision',
    action: 'Action',
  },
];

const title = ['id', 'title', 'impactedSystem', 'risk', 'status', 'action'];

const contentTitle = ['name', 'company', 'status', 'assignedUser'];
const contentData = {
  name: 'Bambang',
  company: 'Company A',
  status: 'Waiting Approval',
  assignedUser: 'Bambang, Mamang, Revaldi, Mijaya',
};

export default function ManageProjectShow() {
  const params = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project>();

  async function fetchProject() {
    const id = params.id;
    if (id === undefined) {
      return navigate('/');
    }

    if (project === undefined) {
      const result = await ProjectServices.getOneProject(id);
      const addedResult: any = {
        ...result,
        assignedUser: 'Bambang, Mamang, Revaldi, Mijaya',
      };
      setProject(addedResult);
    }
  }

  useEffect(() => {
    fetchProject();
  }, [project]);

  return project ? (
    <>
      <div className="flex flex-row justify-between">
        <div className="text-xl font-semibold">Project {params.id}</div>
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
        <PrimaryButton content="Insert Finding" />
        <button
          type="button"
          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Download Report
        </button>
      </div>
      <div className="flex flex-col gap-2 sm:gap-4 p-2 sm:p-4 bg-gray-100 rounded border-4 border-dashed ">
        <div className="text-lg font-semibold">Findings</div>
        <Table title={title} content={content} />
      </div>
    </>
  ) : (
    <></>
  );
}
