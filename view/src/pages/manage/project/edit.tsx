import EditProjectForm from '../../../components/page/project/edit-project-form';

export default function ManageProjectEdit() {
  return (
    <>
      <div className="flex flex-row justify-between">
        <div className="text-xl font-semibold">Edit Project</div>
      </div>
      <EditProjectForm />
    </>
  );
}
