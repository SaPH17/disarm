import EditableList from '../../../components/editable-list';
import { useState, useEffect } from 'react';
import EditableImageList, {
  ImageListData,
  defaultListData,
} from '../../../components/editable-image-list';
import { useQuery } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';
import FindingServices from '../../../services/finding-services';
import Breadcrumbs from '../../../components/breadcrumbs';
import { useForm } from 'react-hook-form';
import EditableSelectedDetail from '../../../components/editable-selected-detail';
import PrimaryButton from '../../../components/primary-button';
import { toast } from 'react-toastify';
import { FindingHandler } from '../../../handlers/finding/finding-handler';
import { stepsToJson } from '../../../utils/functions/jsonConverter';
import SelectBox from '../../../components/select-box';

const contentTitle = [
  { name: 'title', editable: true },
  { name: 'risk', editable: true },
  { name: 'impactedSystem', editable: true },
  { name: 'checklistDetailId', editable: true },
  { name: 'picName', editable: false },
];

const IMAGE_URL_PREFIX = 'http://localhost:8000/upload';
const STATUS = [
  { id: '1', name: 'Fixing' },
  { id: '2', name: 'Fixed' },
  { id: '3', name: 'Confirmed' },
  { id: '4', name: 'Closed on Notes' },
  { id: '5', name: 'Revision' },
  { id: '6', name: 'Pending' },
];

export default function ManageFindingShow() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    register,
    reset,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm<any>();
  const registers = [
    register('title', {
      required: 'Title is required.',
    }),
    register('risk', {
      required: 'Risk is required.',
      validate: (risk) =>
        ['None', 'Low', 'High', 'Critical'].includes(risk)
          ? true
          : `Risk is invalid, only ${['None', 'Low', 'High', 'Critical'].join(
              ', '
            )} is allowed`,
    }),
    register('impactedSystem', {
      required: 'Impacted System is required.',
    }),
    register('checklistDetailId', {
      required: 'Checklist Detail Id is required.',
    }),
  ];

  const { data } = useQuery(`finding/${id}`, () =>
    FindingServices.getOneFinding(id)
  );

  const [finding, setFinding] = useState<any>({});
  const [steps, setSteps] = useState<string[]>(['']);
  const [recommendations, setRecommendations] = useState<string[]>(['']);
  const [evidences, setEvidences] = useState<ImageListData[]>([
    { ...defaultListData },
  ]);
  const [fixedEvidences, setFixedEvidences] = useState<ImageListData[]>([
    { ...defaultListData },
  ]);
  const [isDescEditable, setDescEditable] = useState(false);
  const breadcrumbsPages = [
    {
      name: 'Projects',
      url: '/projects',
    },
    {
      name: `${finding?.Project?.name || '-'}`,
      url: `/projects/${finding?.Project?.id}/`,
    },
    {
      name: `${finding?.title || '-'}`,
      url: `/findings/${finding?.id}/`,
    },
  ];

  const handleSaveChanges = (data: any) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('risk', data.risk);
    formData.append('checklist_detail_id', data.checklistDetailId);
    formData.append('impacted_system', data.impactedSystem);
    formData.append('description', finding.description);
    formData.append('status', finding.status);
    formData.append('steps', stepsToJson(steps));
    formData.append('recommendations', stepsToJson(recommendations));
    formData.append(
      'evidences',
      stepsToJson(
        evidences.map((v: any) => ({
          image: v.image instanceof File ? v.image.name : v.image,
          content: v.content,
        }))
      )
    );
    formData.append(
      'fixed_evidences',
      stepsToJson(
        fixedEvidences.map((v: any) => ({
          image: v.image instanceof File ? v.image.name : v.image,
          content: v.content,
        }))
      )
    );

    const NO_FILE = 'NO_IMAGE_PROVIDED.disarm';
    evidences.forEach((v: any) => {
      formData.append(
        'evidence_images',
        v.image instanceof File ? v.image : new File([''], NO_FILE)
      );
    });
    fixedEvidences.forEach((v: any) => {
      formData.append(
        'fixed_evidence_images',
        v.image instanceof File ? v.image : new File([''], NO_FILE)
      );
    });

    try {
      toast.promise(FindingHandler.handleEditFinding(id, formData), {
        success: 'Successfully edit finding',
        pending: 'Editing finding',
        error: {
          render({ data }: any) {
            return data.message;
          },
        },
      });
      navigate(`/projects/${finding.Project.id}`);
    } catch (e) {}
  };

  useEffect(() => {
    if (!data) {
      return;
    }

    setFinding({
      ...data,
      impactedSystem: data.impacted_system,
      checklistDetailId: data.checklist_detail_id,
      picName: data.User.username,
    });
    setSteps(JSON.parse(data.steps));
    setRecommendations(JSON.parse(data.recommendations));
    setEvidences(
      JSON.parse(data.evidences).map((v: any) => ({
        ...v,
        imageUrl: `${IMAGE_URL_PREFIX}/${v.image}`,
      }))
    );
    setFixedEvidences(
      JSON.parse(data.fixed_evidences).map((v: any) => ({
        ...v,
        imageUrl: `${IMAGE_URL_PREFIX}/${v.image}`,
      }))
    );
  }, [data, reset]);

  useEffect(() => {
    if (!finding) {
      return;
    }

    reset(finding);
  }, [finding, reset]);

  return (
    <>
      <Breadcrumbs pages={breadcrumbsPages}></Breadcrumbs>
      <form onSubmit={handleSubmit(handleSaveChanges)} className="space-y-4">
        <div className="flex justify-between">
          <div className="text-xl font-semibold">
            {finding.title || 'Loading..'}
          </div>
          <PrimaryButton type="submit" content="Save Changes" />
        </div>
        <EditableSelectedDetail
          title={'Details'}
          contentTitle={contentTitle}
          content={finding}
          setContent={setFinding}
          registers={registers}
          getValues={getValues}
          errors={errors}
        />
      </form>

      <div className="text-md font-semibold">Status</div>
      {finding?.status && (
        <SelectBox
          initialSelected={STATUS.find((v: any) => v.name === finding.status)}
          items={STATUS}
          defaultValue={'Select Status'}
          onClickFunction={(item: any) => {
            setFinding((f: any) => ({ ...f, status: item.name }));
          }}
        />
      )}

      <div className="flex justify-between">
        <div className="text-md font-semibold">Description</div>
        <button
          className={`flex justify-center text-xs items-center ${
            isDescEditable
              ? 'bg-indigo-600 border-indigo-400 text-white'
              : 'bg-white border-gray-400'
          }  font-semibold border rounded-sm px-3`}
          onClick={(e) => setDescEditable(!isDescEditable)}
        >
          {isDescEditable ? 'Save' : 'Edit'}
        </button>
      </div>
      <textarea
        disabled={!isDescEditable}
        {...register('description')}
        onInput={(event) => {
          event.currentTarget.style.height = '';
          event.currentTarget.style.height =
            event.currentTarget.scrollHeight + 'px';
        }}
        value={finding.description}
        onChange={(e) => {
          setFinding((finding: any) => ({
            ...finding,
            description: e.target.value,
          }));
        }}
        placeholder="Description"
        className="placeholder:text-gray-300 flex overflow-hidden border border-gray-300 rounded-sm resize-none h-24 min-h-24 w-[100%]"
      />

      <EditableList
        lists={steps}
        setLists={setSteps}
        editOnly={false}
        title={'Replication Steps'}
      ></EditableList>
      <EditableList
        lists={recommendations}
        setLists={setRecommendations}
        editOnly={false}
        title={'Recommendations'}
      ></EditableList>
      <EditableImageList
        lists={evidences}
        setLists={setEvidences}
        editOnly={false}
        title="Evidence"
      ></EditableImageList>
      <EditableImageList
        lists={fixedEvidences}
        setLists={setFixedEvidences}
        editOnly={false}
        title="Fixed Evidence"
      ></EditableImageList>
    </>
  );
}
