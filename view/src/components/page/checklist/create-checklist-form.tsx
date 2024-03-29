import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { CreateChecklistHandler } from '../../../handlers/checklist/create-checklist-handler';
import { SectionType } from '../../../models/checklist/section';
import { ChecklistFormData } from '../../../models/forms/checklist-form-data';
import InputText from '../../input-text/input-text';
import PrimaryButton from '../../primary-button';
import SecondaryButton from '../../secondary-button';
import TableAccordion from '../../tables/accordion/table-accordion';


const title = ['id', 'detail', 'tool', 'procedure'];

const CreateChecklistForm = () => {
  const navigate = useNavigate();
  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
    setValue,
  } = useForm<ChecklistFormData>();

  const [sections, setSections] = useState<SectionType[]>([]);
  const watchIsSubmit = watch('isSubmit', false);
  const searchRef = useRef(null);

  async function handleSubmitChecklistForm(data: ChecklistFormData) {
    try {
      await toast.promise(
        CreateChecklistHandler.handleCreateChecklistFormSubmit(
          data,
          JSON.stringify(sections)
        ),
        {
          success: 'Successfully created a new checklist',
          pending: 'Creating new checklist',
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

  async function handleCreateSectionForm(data: ChecklistFormData) {
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
      (section) => section.name.toLowerCase() !== search.toLowerCase()
    );
    setSections(newSection);
  }

  return (
    <>
      <form
        className="space-y-8"
        onSubmit={handleSubmit(
          watchIsSubmit ? handleSubmitChecklistForm : handleCreateSectionForm
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
                content="Add Section"
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
                placeholder="Delete section"
              />
              <SecondaryButton 
                type='button'
                content='Delete'
                onClick={deleteSection}
              />
            </div>
            <div className="flex justify-end text-sm text-gray-500">
              * Inputted section and its detail will be deleted
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

export default CreateChecklistForm;
