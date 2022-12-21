import EditableList from '../../../components/editable-list';
import { useState } from 'react';
import EditableImageList from '../../../components/editable-image-list';
import { useForm } from 'react-hook-form';
import InputText from '../../input-text/input-text';
import FormErrorMessage from '../../input-text/form-error-message';

export default function CreateFindingForm() {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<any>();

  const handleCreateFindingFormSubmit = (data: any) => {
    console.log(data);
  };

  return (
    <form
      className="space-y-8"
      onSubmit={handleSubmit(handleCreateFindingFormSubmit)}
    >
      <div className="space-y-6 sm:space-y-5">
        <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5">
          <InputText
            id="title"
            name="title"
            label="Title"
            type="text"
            errors={errors}
            register={register('title', {
              required: 'Title is required.',
            })}
          />
        </div>

        <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5">
          <InputText
            id="risk"
            name="risk"
            label="Risk"
            type="text"
            errors={errors}
            register={register('risk', {
              required: 'Risk is required.',
              validate: (risk) =>
                ['None', 'Low', 'High', 'Critical'].includes(risk)
                  ? 'Risk is invalid'
                  : true,
            })}
          />
        </div>

        <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5">
          <InputText
            id="impacted-system"
            name="impacted-system"
            label="Impacted System"
            type="text"
            errors={errors}
            register={register('impactedSystem', {
              required: 'Impacted System is required.',
            })}
          />
        </div>

        <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5">
          <InputText
            id="checklist-detail-id"
            name="checklist-detail-id"
            label="Checklist Detail Id"
            type="text"
            errors={errors}
            register={register('checklistDetailId', {
              required: 'Checklist Detail Id is required.',
            })}
          />
        </div>

        <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5">
          <div className="hidden sm:hidden"></div>
          <label
            htmlFor="description"
            className={`block text-sm font-medium text-gray-700  sm:mt-px sm:pt-2`}
          >
            Description
          </label>
          <div className="mt-1 sm:mt-0 sm:col-span-2">
            <textarea
              id="description"
              {...register('description', {
                required: 'Description is required',
              })}
              onInput={(event) => {
                event.currentTarget.style.height = '';
                event.currentTarget.style.height =
                  event.currentTarget.scrollHeight + 'px';
              }}
              placeholder="Description"
              className="placeholder:text-gray-300 flex overflow-hidden border border-gray-300 rounded-sm resize-none h-24 min-h-24 w-[100%]"
            />
            {errors && <FormErrorMessage name="description" errors={errors} />}
          </div>
        </div>
      </div>

      <EditableList editOnly={true} title="Replication Steps"></EditableList>
      <EditableList editOnly={true} title="Recommendations"></EditableList>
      <EditableImageList editOnly={true} title="Evidence"></EditableImageList>
      <EditableImageList
        editOnly={true}
        title="Fixed Evidence"
      ></EditableImageList>
    </form>
  );
}
