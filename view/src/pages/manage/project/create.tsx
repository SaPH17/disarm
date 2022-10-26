import CreateProjectForm from '../../../components/page/project/create-project-form';
import SelectBox from '../../../components/select-box';

export default function ManageProjectCreate() {
  return (
    <>
      <div className="flex flex-row justify-between">
        <div className="text-xl font-semibold">Create Project</div>
        <button
          type="button"
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Create Project
        </button>
      </div>
      <CreateProjectForm />
    </>
  );
}
