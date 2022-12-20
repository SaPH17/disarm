import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { UpdateProjectHandler } from '../../../handlers/project/edit-project-handler';
import { Checklist } from '../../../models/checklist';
import { ProjectFormData } from '../../../models/forms/project-form-data';
import ChecklistServices from '../../../services/checklist-service';
import ProjectServices from '../../../services/project-services';
import InputText from '../../input-text/input-text';
import PrimaryButton from '../../primary-button';
import SelectBox from '../../select-box';


export default function EditProjectForm() {
  const params = useParams();
  const navigate = useNavigate();
  const { data: projectData } = useQuery(`project/${params.id}`, () =>
    ProjectServices.getOneProject(params.id)
  );
  const { data: checklistsData } = useQuery('checklists', ChecklistServices.getChecklists);

  const project = projectData || undefined;

  const checklists = checklistsData?.map((checklist: Checklist) => ({
    id: checklist.id,
    name: checklist.name,
  })) || null;

  const {
    register,
    reset,
    setValue,
    formState: { errors },
    handleSubmit,
  } = useForm<ProjectFormData>();

  useEffect(() => {
    if (!project) return;
    reset(project);
  }, [projectData]);

  useEffect(() => {
    if (!projectData) return;
    setValue('checklist', projectData.Checklist.id);
  }, []);

  async function handleUpdateProjectButton(data: ProjectFormData) {
     try {
       await toast.promise(
         UpdateProjectHandler.handleUpdateProjectFormSubmit(data, project.id),
         {
           success: 'Successfully update new project',
           pending: 'Waiting for update new project!',
           error: {
             render({ data }: any) {
               return data.message;
             },
           },
         }
       );
       navigate('/projects');
     } catch (e) {}
  }

  return project ? (
    <form
      className="space-y-8"
      onSubmit={handleSubmit(handleUpdateProjectButton)}
    >
      <div className="space-y-6 sm:space-y-5">
        <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5">
          <InputText
            id="name"
            name="name"
            label="Name"
            type="text"
            errors={errors}
            register={register('name', {
              required: 'Name is required.',
            })}
          />
        </div>

        <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
          <InputText
            id="company"
            name="company"
            label="Company"
            type="text"
            errors={errors}
            register={register('company', {
              required: 'Company name is required.',
            })}
          />
        </div>

        <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
          <label
            htmlFor="country"
            className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
          >
            Standard
          </label>
          <div className="flex flex-col gap-2 mt-1 sm:mt-0 sm:col-span-2">
            <div className="block w-full max-w-lg border-gray-300 rounded-md shadow-sm sm:text-sm">
              {
                checklists && <SelectBox initialSelected={{
                  id: project.Checklist.id,
                  name: project.Checklist.name
                }} items={checklists} defaultValue={'Select Standard'} />
              }
            </div>
            <span className="text-gray-500 underline cursor-pointer hover:text-gray-700">
              Update a new standard
            </span>
          </div>
        </div>
      </div>
      <div className="flex flex-row justify-end">
        <PrimaryButton content="Edit Project" type="submit" />
      </div>
    </form>
  ) : (
    <></>
  );
}
