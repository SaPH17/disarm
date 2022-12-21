import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { EditChecklistHandler } from '../../../handlers/checklist/edit-checklist-handler';
import { Checklist } from '../../../models/checklist';
import { ChecklistFormData } from '../../../models/forms/checklist-form-data';
import ChecklistServices from '../../../services/checklist-services';
import InputText from '../../input-text/input-text';
import PrimaryButton from '../../primary-button';
import TableAccordion from '../../tables/accordion/table-accordion';

export type SectionDetail = {
  id: string;
  detail: string;
  tool: string;
  procedure: string;
  isEdited: boolean;
};

export type SectionType = {
  name: string;
  details: SectionDetail[];
};

const title = ['id', 'detail', 'tool', 'procedure'];

const EditChecklistForm = () => {
  const navigate = useNavigate();
  const params = useParams();
  const { data: checklistData } = useQuery(`checklists/${params.id}`, () =>
    ChecklistServices.getOneChecklist(params.id)
  );

  const checklist = checklistData || null;

  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
    setValue,
    reset
  } = useForm<ChecklistFormData>();

  const [sections, setSections] = useState<SectionType[]>([]);
  const watchIsSubmit = watch('isSubmit', false);
  const searchRef = useRef(null);

  async function handleSubmitChecklistForm(data: ChecklistFormData) {
    try {
      await toast.promise(
        EditChecklistHandler.handleEditChecklistFormSubmit(
          data,
          JSON.stringify(sections),
          params.id as string
        ),
        {
          success: 'Successfully Edit checklist',
          pending: 'Waiting for Edit checklist!',
          error: {
            render({ data }: any) {
              return data.message;
            },
          },
        }
      );
      navigate('/checklists');
    } catch (e) {}
  }

  async function handleEditSectionForm(data: ChecklistFormData) {
    setSections((currentSections) => [
      ...currentSections,
      {
        name: data.section!,
        details: [],
      },
    ]);
  }

  function deleteSection() {
    const search = (searchRef.current! as any).value;
    if (!search) return;
    const newSection = sections.filter(
      (section) => !section.name.toLowerCase().includes(search.toLowerCase())
    );
    setSections(newSection);
  }

  useEffect(() => {
    if (!checklistData) return;
    setSections(JSON.parse(checklistData.sections));
    reset({
      name: checklist.name
    })
  }, [checklistData])

  return (
    checklist && <>
      <form
        className="space-y-8"
        onSubmit={handleSubmit(
          watchIsSubmit ? handleSubmitChecklistForm : handleEditSectionForm
        )}
      >
        <div className="space-y-6 sm:space-y-5">
          <PrimaryButton
            content="Save"
            type="submit"
            onClick={() => setValue('isSubmit', true)}
          ></PrimaryButton>
          <div className="pt-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5">
            <InputText
              id="name"
              name="name"
              label="Name"
              type="text"
              errors={errors}
              register={register('name', {
                required: watchIsSubmit ? 'Name is required.' : false,
              })}
            />
          </div>
          <div className="pt-4 text-xl font-semibold sm:border-t sm:border-gray-200">
            Sections
          </div>
          <div className="space-y-4">
            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5">
              <InputText
                id="section"
                name="section"
                label="Section Name"
                type="text"
                errors={errors}
                register={register('section', {
                  required: !watchIsSubmit
                    ? 'Section Name is required.'
                    : false,
                  validate: (section) => {
                    if (watchIsSubmit) return true;
                    return !sections.filter((s) => s.name === section).length;
                  },
                })}
              />
            </div>

            <div className="flex justify-end">
              <PrimaryButton
                content="Edit Section"
                classNames="w-full sm:w-fit"
                type="submit"
                onClick={() => setValue('isSubmit', false)}
              ></PrimaryButton>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-4">
              <input
                type="text"
                ref={searchRef}
                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Search section"
              />
              <button
                type="button"
                onClick={deleteSection}
                className="inline-flex items-center justify-center h-8 px-4 text-xs font-medium leading-4 text-white bg-blue-600 border border-transparent rounded shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Delete
              </button>
            </div>
            <div className="flex justify-end text-sm text-gray-500">
              * Selected section and detail will be deleted
            </div>
          </div>
        </div>
      </form>
      <TableAccordion
        title={title}
        content={sections}
        setContent={setSections}
        isEditable={true}
      ></TableAccordion>
    </>
  );
};

export default EditChecklistForm;
