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
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import FormErrorMessage from '../../input-text/form-error-message';

export default function EditProjectForm() {
  const PHASE_DATA = [
    { id: '1', name: 'Idle' },
    { id: '2', name: 'On Progress' },
    { id: '3', name: 'Remediation' },
    { id: '4', name: 'Done' },
  ];
  const params = useParams();
  const navigate = useNavigate();
  const { data: projectData } = useQuery(`project/${params.id}`, () =>
    ProjectServices.getOneProject(params.id)
  );

  const project = projectData || undefined;
  const [selectedPhase, setSelectedPhase] = useState<any>(undefined);
  const [startDate, setStartDate] = useState<any>(null);
  const [endDate, setEndDate] = useState<any>(null);

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
    setStartDate(Date.parse(project.start_date));
    setValue('startDate', Date.parse(project.start_date));
    setEndDate(Date.parse(project.end_date));
    setValue('endDate', Date.parse(project.end_date));
  }, [projectData]);

  async function handleUpdateProjectButton(data: ProjectFormData) {
    console.log(data);
    try {
      await toast.promise(
        UpdateProjectHandler.handleUpdateProjectFormSubmit(data, project.id),
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
      // navigate('/projects');
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
            Start Date
          </label>
          <div className="mt-1 sm:mt-0 sm:col-span-2 flex flex-col gap-2">
            <div className="block max-w-lg w-full sm:text-sm border-gray-300 rounded-md ">
              <div className="mt-1 sm:mt-0 sm:col-span-2">
                <DatePicker
                  placeholderText="Start Date"
                  selected={startDate}
                  customInput={
                    <input
                      {...register('startDate', {
                        required: 'Start Date is required.',
                      })}
                      placeholder={'Start Date'}
                      className="block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border px-3 py-2 border-gray-300 rounded-md"
                    />
                  }
                  onChange={(date: any) => {
                    setValue('startDate', date);
                    setStartDate(date);
                  }}
                />
                {errors && (
                  <FormErrorMessage name={'startDate'} errors={errors} />
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-gray-200 sm:pt-5">
          <label
            htmlFor="country"
            className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
          >
            Estimated End Date
          </label>
          <div className="mt-1 sm:mt-0 sm:col-span-2 flex flex-col gap-2">
            <div className="block max-w-lg w-full sm:text-sm border-gray-300 rounded-md ">
              <div className="mt-1 sm:mt-0 sm:col-span-2">
                <DatePicker
                  placeholderText="End Date"
                  selected={endDate}
                  customInput={
                    <input
                      {...register('endDate', {
                        required: 'End Date is required.',
                      })}
                      placeholder={'Estimated End Date'}
                      className="block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border px-3 py-2 border-gray-300 rounded-md"
                    />
                  }
                  onChange={(date: any) => {
                    setValue('endDate', date);
                    setEndDate(date);
                  }}
                />
                {errors && (
                  <FormErrorMessage name={'endDate'} errors={errors} />
                )}
              </div>
            </div>
          </div>
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
