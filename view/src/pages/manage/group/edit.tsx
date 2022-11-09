import SelectedDetail from '../../../components/selected-detail';
import TableCheckbox from '../../../components/table-checkbox';

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
  return (
    <>
      <SelectedDetail
        title={'Group Detail'}
        contentTitle={contentTitle}
        content={contentData}
      />

      <div className="flex flex-col gap-1 sm:gap-2">
        <div className="text-lg font-semibold">Assigned Permission</div>
        <TableCheckbox
          title={title}
          content={content}
          isClickable={true}
          onClickFunction={(group: any) => {}}
        />
      </div>

      <div className="flex flex-col gap-1 sm:gap-2">
        <div className="text-lg font-semibold">Available Permission</div>
        <TableCheckbox
          title={title}
          content={content}
          isClickable={true}
          onClickFunction={(group: any) => {}}
        />
      </div>
    </>
  );
};

export default ManageGroupEdit;
