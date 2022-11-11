import CreateProjectForm from '../../../components/page/project/create-project-form';
import PrimaryButton from '../../../components/primary-button';

export default function ManageProjectCreate() {
  return (
    <>
      <div className="flex flex-row justify-between">
        <div className="text-xl font-semibold">Create Project</div>
      </div>
      <CreateProjectForm />
    </>
  );
}
