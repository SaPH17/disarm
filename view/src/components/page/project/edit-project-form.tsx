import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { UpdateProjectHandler } from '../../../handlers/project/edit-project-handler';
import { ProjectFormData } from '../../../models/forms/project-form-data';
import ProjectServices from '../../../services/project-services';
import InputText from '../../input-text/input-text';
import PrimaryButton from '../../primary-button';
import SelectBox from '../../select-box';

export default function EditProjectForm() {
  const PHASE_DATA = [
    { id: '1', name: 'Idle' },
    { id: '2', name: 'On Progress' },
    { id: '3', name: 'Done' },
  ];
  const params = useParams();
  const navigate = useNavigate();
  const { data: projectData } = useQuery(`project/${params.id}`, () =>
    ProjectServices.getOneProject(params.id)
  );

  const project = projectData || undefined;
  const [selectedPhase, setSelectedPhase] = useState<any>(undefined);

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
    setSelectedPhase(PHASE_DATA.find((v) => v.name === project?.phase));
  }, [projectData]);

  async function handleUpdateProjectButton(data: ProjectFormData) {
    try {
      await toast.promise(
        UpdateProjectHandler.handleUpdateProjectFormSubmit(
          { ...data } as ProjectFormData,
          project.id
        ),
        {
          success: 'Successfully updated project',
          pending: 'Updating project',
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
            htmlFor="phase"
            className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
          >
            Phase
          </label>
          <div className="flex flex-col gap-2 mt-1 sm:mt-0 sm:col-span-2">
            <div className="block w-full max-w-lg border-gray-300 rounded-md shadow-sm sm:text-sm">
              {selectedPhase && (
                <SelectBox
                  initialSelected={selectedPhase}
                  items={PHASE_DATA}
                  defaultValue={'Select Phase'}
                  onClickFunction={(item: any) => {
                    setValue('phase', item.name);
                  }}
                />
              )}
            </div>
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
