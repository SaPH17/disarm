import EditChecklistForm from '../../../components/page/checklist/edit-checklist-form';

const ManageChecklistEdit = () => {
  return (
    <>
      <div className="flex flex-row justify-between">
        <div className="text-xl font-semibold">Edit Checklist</div>
      </div>
      <EditChecklistForm />
    </>
  );
};

export default ManageChecklistEdit;
