import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import SelectedDetail from '../../../components/selected-detail';
import TableCheckbox from '../../../components/table-checkbox';
import { Group } from '../../../models/group';
import GroupServices from '../../../services/group-services';

const contentTitle = ['name', 'description', 'directParentGroup'];
const contentData = {
  name: 'Role A',
  description: 'Role for admin',
  directParentGroup: 'Role B',
};

const title = ['permissionName', 'description'];
const content = [
  {
    id: 1,
    permissionName: 'Role A',
    description: 'Role for admin',
  },
  {
    id: 2,
    permissionName: 'Role B',
    description: 'Role for pentester',
  },
  {
    id: 3,
    permissionName: 'Role C',
    description: 'Role for SysAdmin',
  },
  {
    id: 4,
    permissionName: 'Role D',
    description: 'Role for others',
  },
];

const ManageGroupEdit = () => {
  const { id } = useParams();
  const [group, setGroup] = useState<Group>();
  const navigate = useNavigate();

  async function fetchGroup(){
    if (id === undefined){
      return navigate('/');
    }

    if (group === undefined){
      const result = await GroupServices.getOneGroup(id);
      setGroup(result);
    }
  }

  useEffect(() => {
    fetchGroup();
  }, [id, group]);

  return (group ?
    <>
      <SelectedDetail
        title={'Group Detail'}
        contentTitle={contentTitle}
        content={group}
      />

      <div className="flex flex-col gap-1 sm:gap-2">
        <div className="text-lg font-semibold">Assigned Permission</div>
        <TableCheckbox
          title={title}
          content={content}
          onCheckedFunction={() => {}}
          onUncheckedFunction={() => {}}
          onClickFunction={(group: any) => {}}
        />
      </div>

      <div className="flex flex-col gap-1 sm:gap-2">
        <div className="text-lg font-semibold">Available Permission</div>
        <TableCheckbox
          title={title}
          content={content}
          onCheckedFunction={() => {}}
          onUncheckedFunction={() => {}}
          onClickFunction={(group: any) => {}}
        />
      </div>
    </> : <></>
  );
};

export default ManageGroupEdit;
