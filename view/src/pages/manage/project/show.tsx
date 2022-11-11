import { useParams } from 'react-router-dom';
import SelectedDetail from '../../../components/selected-detail';
import Table from '../../../components/table';
import PrimaryButton from '../../../components/primary-button';

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
  return (
    <>
      <div className="text-xl font-semibold">Project {params.id}</div>
      <SelectedDetail
        title={'Project Detail'}
        contentTitle={contentTitle}
        content={contentData}
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
  );
}
