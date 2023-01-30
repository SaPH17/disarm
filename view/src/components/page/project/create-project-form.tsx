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
import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import FormErrorMessage from '../../input-text/form-error-message';

export default function CreateProjectForm() {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

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
    setValue,
  } = useForm<ProjectFormData>();

  async function handleCreateProjectButton(data: ProjectFormData) {
    try {
      await toast.promise(
        CreateProjectHandler.handleCreateProjectFormSubmit(data),
        {
          success: 'Successfully created a new project',
          pending: 'Creating a new project',
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

  function changeChecklist(item: any) {
    setValue('checklist', item.id);
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
            htmlFor="country"
            className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
          >
            Checklist
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
