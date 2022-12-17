import EditGroupForm from '../../../components/page/group/edit-group-form';
import Breadcrumbs from '../../../components/breadcrumbs';
import GroupServices from '../../../services/group-services';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Group } from '../../../models/group';
import { useQuery } from 'react-query';

const ManageGroupEdit = () => {
  const params = useParams();
  const { data: groupData } = useQuery(`groups/${params.id}`, () => GroupServices.getOneGroup(params.id));
  const group = groupData || null;

  const breadcrumbsPages = [
    {
      name: 'Groups',
      url: '/groups',
    },
    {
      name: `${group?.name || '-'}`,
      url: `/groups/${group?.id}/edit-permission`,
    },
  ];

  return (
    <>
      <Breadcrumbs pages={breadcrumbsPages}></Breadcrumbs>
      <div className="flex flex-row justify-between">
        <div className="text-xl font-semibold">Edit Group</div>
      </div>
      <EditGroupForm group={group}/>
    </>
  );
};

export default ManageGroupEdit;
