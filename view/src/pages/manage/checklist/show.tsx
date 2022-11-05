import React from 'react';
import Table from '../../../components/table';

const title = ['id', 'section', 'detail', 'tool', 'procedure'];
const content = [
  {
    id: 1.1,
    section: 'Information Gathering',
    detail: 'Conduct ...',
    tool: 'Tool A',
    procedure: 'Do the following',
  },
  {
    id: 1.2,
    section: 'Information Gathering',
    detail: 'Conduct ...',
    tool: 'Tool A',
    procedure: 'Do the following',
  },
  {
    id: 1.3,
    section: 'Information Gathering',
    detail: 'Conduct ...',
    tool: 'Tool A',
    procedure: 'Do the following',
  },
  {
    id: 2.1,
    section: 'Information Gathering',
    detail: 'Conduct ...',
    tool: 'Tool A',
    procedure: 'Do the following',
  },
  {
    id: 3.1,
    section: 'Information Gathering',
    detail: 'Conduct ...',
    tool: 'Tool A',
    procedure: 'Do the following',
  },
];

const ManageChecklistShow = () => {
  return (
    <>
      <div className="text-xl font-semibold">Checklist A</div>
      <div className="flex flex-col gap-2 sm:gap-4 p-2 sm:p-4 bg-gray-100 rounded">
        <Table title={title} content={content} />
      </div>
    </>
  );
};

export default ManageChecklistShow;
