import CreateGroupForm from '../../../components/page/group/create-group-form';
import PrimaryButton from '../../../components/primary-button';

const ManageGroupCreate = () => {
  return (
    <>
      <div className="flex flex-row justify-between">
        <div className="text-xl font-semibold">Create Group</div>
      </div>
      <CreateGroupForm />
    </>
  );
};

export default ManageGroupCreate;
