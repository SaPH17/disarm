import EditGroupForm from '../../../components/page/group/edit-group-form';
import Breadcrumbs from '../../../components/breadcrumbs';
import GroupServices from '../../../services/group-services';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Group } from '../../../models/group';

const ManageGroupEdit = () => {
  const { id } = useParams();
  const [group, setGroup] = useState<Group>();
  const navigate = useNavigate();

  async function fetchGroup() {
    if (id === undefined) {
      return navigate('/');
    }

    if (group === undefined) {
      const g = await GroupServices.getOneGroup(id);

      setGroup(g);
    }
  }

  useEffect(() => {
    fetchGroup();
  }, [id]);

  const breadcrumbsPages = [
    {
      name: 'Groups',
      url: '/groups',
    },
    {
      name: `${group?.name}`,
      url: `/groups/${group?.id}/edit-permission`,
    },
  ];

  return (
    <>
      <Breadcrumbs pages={breadcrumbsPages}></Breadcrumbs>
      <div className="flex flex-row justify-between">
        <div className="text-xl font-semibold">Edit Group</div>
      </div>
      <EditGroupForm />
    </>
  );
};

export default ManageGroupEdit;
