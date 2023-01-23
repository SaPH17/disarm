import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { EditChecklistHandler } from '../../../handlers/checklist/edit-checklist-handler';
import { Checklist } from '../../../models/checklist';
import { SectionType } from '../../../models/checklist/section';
import { ChecklistFormData } from '../../../models/forms/checklist-form-data';
import { User } from '../../../models/user';
import ChecklistServices from '../../../services/checklist-services';
import InputText from '../../input-text/input-text';
import PrimaryButton from '../../primary-button';
import TableAccordion from '../../tables/accordion/table-accordion';

const title = ['id', 'detail', 'tool', 'procedure'];

export type ChecklistShowData = {
  name: string;
  status: string;
  user: string;
};

const ShowChecklistData = () => {
  const params = useParams();
  const { data: checklistData } = useQuery(`checklists/${params.id}`, () =>
    ChecklistServices.getOneChecklist(params.id)
  );

  const checklist = checklistData || null;

  const {
    register,
    formState: { errors },
    reset,
  } = useForm<ChecklistShowData>();

  const [sections, setSections] = useState<SectionType[]>([]);

  useEffect(() => {
    if (!checklistData) return;
    setSections(JSON.parse(checklistData.sections));
    reset({
      ...checklist,
      user: checklist.User.username,
    });
  }, [checklistData]);

  return (
    checklist && (
      <>
        <form className="mb-8 space-y-8">
          <div className="space-y-2">
            <div className="pt-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5">
              <InputText
                id="name"
                name="name"
                label="Name"
                type="text"
                errors={errors}
                disabled
                register={register('name')}
              />
            </div>
            <div className="pt-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5">
              <InputText
                id="status"
                name="status"
                label="Status"
                type="text"
                errors={errors}
                disabled
                register={register('status')}
              />
            </div>
            <div className="pt-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5">
              <InputText
                id="user"
                name="user"
                label="Created By"
                type="text"
                errors={errors}
                disabled
                register={register('user')}
              />
            </div>
          </div>
        </form>
        <TableAccordion
          title={title}
          content={sections}
          setContent={setSections}
        ></TableAccordion>
      </>
    )
  );
};

export default ShowChecklistData;
