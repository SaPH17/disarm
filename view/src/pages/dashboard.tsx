import Table from '../components/table';

/* This example requires Tailwind CSS v2.0+ */
const content = [
  {
    name: 'Project A',
    company: 'Company A',
    status: 'Fixing',
    date: '11/10/2022',
  },
  {
    name: 'Project A',
    company: 'Company A',
    status: 'Fixed',
    date: '11/10/2022',
  },
  {
    name: 'Project A',
    company: 'Company A',
    status: 'Confirmed',
    date: '11/10/2022',
  },
  {
    name: 'Project A',
    company: 'Company A',
    status: 'Close on Notes',
    date: '11/10/2022',
  },
  {
    name: 'Project A',
    company: 'Company A',
    status: 'Revision',
    date: '11/10/2022',
  },
  // More people...
];

const title = ['name', 'company', 'status', 'date'];

export default function Dashboard() {
  return (
    <>
      <div className="text-xl font-semibold">Dashboard</div>
      <div className="flex flex-col gap-2 sm:gap-4 p-2 sm:p-4 bg-gray-100 rounded">
        <div className="text-lg font-semibold">Current Project</div>
        <Table title={title} content={content} />
      </div>
    </>
  );
}
