import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Breadcrumbs from '../../../components/breadcrumbs';
import { Checklist } from '../../../models/checklist';
import ChecklistService from '../../../services/checklist-services';
import ChecklistServices from '../../../services/checklist-services';
import { useQuery } from 'react-query';
import { isConstructorDeclaration } from 'typescript';
import TableAccordion from '../../../components/tables/accordion/table-accordion';

const title = ['id', 'detail', 'tool', 'procedure'];
const content = [
  {
    name: 'Section 1',
    details: [
      {
        id: 'WEB-001',
        detail: 'Detail',
        tool: 'Tool',
        procedure: 'Procedure',
      },
      {
        id: 'WEB-002',
        detail: 'Detail',
        tool: 'Tool',
        procedure: 'Procedure',
      },
    ],
  },
  {
    name: 'Section 2',
    details: [
      {
        id: 'WEB-001',
        detail: 'Detail',
        tool: 'Tool',
        procedure: 'Procedure',
      },
      {
        id: 'WEB-002',
        detail: 'Detail',
        tool: 'Tool',
        procedure:
          'Procedure Procedure Procedure Procedure Procedure Procedure Procedure Procedure Procedure Procedure Procedure Procedure Procedure Procedure Procedure Procedure Procedure Procedure Procedure Procedure Procedure Procedure Procedure Procedure Procedure Procedure Procedure Procedure Procedure Procedure Procedure Procedure Procedure Procedure Procedure Procedure Procedure Procedure Procedure Procedure Procedure Procedure Procedure Procedure Procedure Procedure',
      },
    ],
  },
  {
    name: 'Section 3',
    details: [],
  },
  {
    name: 'Section 4',
    details: [],
  },
];

const ManageChecklistShow = () => {
  const { id } = useParams();
  const { data } = useQuery(`project/${id}`, () =>
    ChecklistServices.getOneChecklist(id)
  );

  const checklist = data
    ? {
        id: data.id,
        name: data.name,
        status: data.status,
        sections: JSON.parse(data.sections),
      }
    : {};

  const breadcrumbsPages = [
    {
      name: 'Checklists',
      url: '/checklists',
    },
    {
      name: `${checklist?.name}`,
      url: `/checklists/${checklist?.id}/`,
    },
  ];

  return (
    <>
      <Breadcrumbs pages={breadcrumbsPages}></Breadcrumbs>
      <div className="text-xl font-semibold">{checklist.name}</div>
      <div className="flex flex-col gap-2 bg-gray-100 rounded sm:gap-4">
        <TableAccordion
          title={title}
          content={checklist.sections || []}
          setContent={() => {}}
          isEditable={false}
        ></TableAccordion>
      </div>
    </>
  );
};

export default ManageChecklistShow;
