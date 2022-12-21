import { useForm } from 'react-hook-form';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { CreateProjectHandler } from '../../../handlers/project/create-project-handler';
import { Checklist } from '../../../models/checklist';
import { ProjectFormData } from '../../../models/forms/project-form-data';
import { GeneralData } from '../../../models/general-data';
import ChecklistServices from '../../../services/checklist-services';
import InputText from '../../input-text/input-text';
import PrimaryButton from '../../primary-button';
import SelectBox from '../../select-box';

export default function CreateProjectForm() {
  const navigate = useNavigate();
  const { data: checklistsData } = useQuery(
    'standards',
    ChecklistServices.getChecklists
  );

  const checklists =
    checklistsData?.map((checklist: Checklist) => ({
      id: checklist.id,
      name: checklist.name,
    })) || null;

  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue
  } = useForm<ProjectFormData>();

  async function handleCreateProjectButton(data: ProjectFormData) {
    try {
      await toast.promise(
        CreateProjectHandler.handleCreateProjectFormSubmit(
          data
        ),
        {
          success: 'Successfully create new project',
          pending: 'Waiting for create new project!',
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

  function changeChecklist(item: any){
    setValue('checklist', item.id)
  }

  return (
    <form
      className="space-y-8"
      onSubmit={handleSubmit(handleCreateProjectButton)}
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
          <div className="mt-1 sm:mt-0 sm:col-span-2 flex flex-col gap-2">
            <div className="block max-w-lg w-full sm:text-sm border-gray-300 rounded-md ">
              {checklists && (
                <SelectBox
                  items={checklists as GeneralData[]}
                  defaultValue={'Select Checklists'}
                  register={register('checklist', {
                    required: 'Checklist is required.',
                  })}
                  onClickFunction={changeChecklist}
                  name={'checklist'}
                  errors={errors}
                />
              )}
            </div>
            <span className="text-gray-500 hover:text-gray-700 cursor-pointer underline">
              Create a new standard
            </span>
          </div>
        </div>
      </div>
      <div className="flex flex-row justify-end">
        <PrimaryButton content="Create Project" type="submit" />
      </div>
    </form>
  );
}
