import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ChecklistFormData } from '../../../models/forms/checklist-form-data';
import InputText from '../../input-text/input-text';
import PrimaryButton from '../../primary-button';
import TableAccordion from '../../table-accordion';

const title = ['id', 'detail', 'tool', 'procedure'];

const CreateChecklistForm = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<ChecklistFormData>();

  const [sections, setSections] = useState<any[]>([
    {
      name: 'Section 1',
      details: [
        {
          id: 'WEB-001',
          detail: 'Detail',
          tool: 'Tool',
          procedure: 'Procedure',
        },
        {
          id: 'WEB-002',
          detail: 'Detail',
          tool: 'Tool',
          procedure: 'Procedure',
        },
      ],
    },
    {
      name: 'Section 2',
      details: [
        {
          id: 'WEB-001',
          detail: 'Detail',
          tool: 'Tool',
          procedure: 'Procedure',
        },
        {
          id: 'WEB-002',
          detail: 'Detail',
          tool: 'Tool',
          procedure: 'Procedure',
        },
      ],
    },
    {
      name: 'Section 3',
      details: [],
    },
    {
      name: 'Section 4',
      details: [],
    },
  ]);
  const handleSectionInsert = (e: any) => {
    //TODO: Ambil value dari text field section name, validasi empty, terus insert ke sections.
    // setSections([...sections, ]);
  };

  return (
    <form className="space-y-8">
      <div className="space-y-6 sm:space-y-5">
        <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start pt-2 sm:pt-5">
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
        <div className="text-xl font-semibold pt-4 sm:border-t sm:border-gray-200">
          Sections
        </div>
        <div className="space-y-4">
          <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5">
            <InputText
              id="section-name"
              name="section-name"
              label="Section Name"
              type="text"
              errors={errors}
              register={register(`sections.${sections.length}.name`, {
                required: 'Section Name is required.',
              })}
            />
          </div>

          <div className="flex justify-end">
            <PrimaryButton
              onClick={handleSectionInsert}
              content="Create Section"
              classNames="w-full sm:w-fit"
            ></PrimaryButton>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-4">
            <input
              type="text"
              className="block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300 rounded-md"
              placeholder="Search section"
            />
            <button className="inline-flex h-8 justify-center items-center px-4 border border-transparent text-xs leading-4 font-medium shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded">
              Delete
            </button>
          </div>
          <div className="flex justify-end text-gray-500 text-sm">
            * Selected section and detail will be deleted
          </div>
        </div>
        <TableAccordion
          title={title}
          content={sections}
          onCheckedFunction={() => {}}
          onUncheckedFunction={() => {}}
        ></TableAccordion>
      </div>
    </form>
  );
};

export default CreateChecklistForm;
