import EditableList from '../../../components/editable-list';
import { useState } from 'react';
import EditableImageList, {
  ImageListData,
  defaultListData,
} from '../../../components/editable-image-list';
import { useForm } from 'react-hook-form';
import InputText from '../../input-text/input-text';
import FormErrorMessage from '../../input-text/form-error-message';
import PrimaryButton from '../../primary-button';
import { toast } from 'react-toastify';
import { FindingHandler } from '../../../handlers/finding/finding-handler';
import { stepsToJson } from '../../../utils/functions/jsonConverter';
import { useNavigate, useParams } from 'react-router-dom';

export default function CreateFindingForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<any>();

  const [steps, setSteps] = useState<string[]>(['']);
  const [recommendations, setRecommendations] = useState<string[]>(['']);
  const [evidences, setEvidences] = useState<ImageListData[]>([
    { ...defaultListData },
  ]);
  const [fixedEvidences, setFixedEvidences] = useState<ImageListData[]>([
    { ...defaultListData },
  ]);

  const handleCreateFindingFormSubmit = (data: any) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('risk', data.risk);
    formData.append('impacted_system', data.impactedSystem);
    formData.append('description', data.description);
    formData.append('steps', stepsToJson(steps));
    formData.append('recommendations', stepsToJson(recommendations));
    formData.append(
      'evidences',
      stepsToJson(
        evidences.map((v: any) => ({ image: v.image.name, content: v.content }))
      )
    );
    formData.append(
      'fixed_evidences',
      stepsToJson(
        fixedEvidences.map((v: any) => ({
          image: v.image.name,
          content: v.content,
        }))
      )
    );
    formData.append('checklist_detail_id', data.checklistDetailId);
    formData.append('project_id', id as string);

    evidences.forEach((v) => {
      formData.append('evidence_images', v.image);
    });
    fixedEvidences.forEach((v) => {
      formData.append('fixed_evidence_images', v.image);
    });

    try {
      toast.promise(FindingHandler.handleCreateFindingFormSubmit(formData), {
        success: 'Successfully create new finding',
        pending: 'Waiting for create new finding!',
        error: {
          render({ data }: any) {
            return data.message;
          },
        },
      });
      navigate(`/projects/${id}`);
    } catch (e) {}
  };

  return (
    <form
      className="space-y-8"
      onSubmit={handleSubmit(handleCreateFindingFormSubmit)}
    >
      <div className="space-y-6 sm:space-y-5">
        <div className="flex flex-row justify-end">
          <PrimaryButton content="Create Finding" type="submit" />
        </div>
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
                  ? true
                  : `Risk is invalid, only ${[
                      'None',
                      'Low',
                      'High',
                      'Critical',
                    ].join(', ')} is allowed`,
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

      <EditableList
        lists={steps}
        setLists={setSteps}
        editOnly={true}
        title={'Replication Steps'}
      ></EditableList>
      <EditableList
        lists={recommendations}
        setLists={setRecommendations}
        editOnly={true}
        title={'Recommendations'}
      ></EditableList>
      <EditableImageList
        lists={evidences}
        setLists={setEvidences}
        editOnly={true}
        title="Evidence"
      ></EditableImageList>
      <EditableImageList
        lists={fixedEvidences}
        setLists={setFixedEvidences}
        editOnly={true}
        title="Fixed Evidence"
      ></EditableImageList>
    </form>
  );
}
