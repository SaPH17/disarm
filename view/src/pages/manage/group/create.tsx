import CreateGroupForm from '../../../components/page/group/create-group-form';

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
