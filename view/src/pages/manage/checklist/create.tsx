import CreateChecklistForm from '../../../components/page/checklist/create-checklist-form';

const ManageChecklistCreate = () => {
  return (
    <>
      <div className="flex flex-row justify-between">
        <div className="text-xl font-semibold">Create Checklist</div>
      </div>
      <CreateChecklistForm />
    </>
  );
};

export default ManageChecklistCreate;
