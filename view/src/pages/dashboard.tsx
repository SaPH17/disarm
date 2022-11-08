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
      <div className="text-xl font-bold">Dashboard</div>

      <div className="flex flex-col gap-1 sm:gap-2">
        <div className="text-lg font-semibold">Projects</div>
        <Table title={title} content={content} />
      </div>
    </>
  );
}
