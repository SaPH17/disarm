import { CheckIcon, ChevronUpIcon, TrashIcon } from '@heroicons/react/outline';
import { useForm } from 'react-hook-form';
import { defaultChecklistAccordion } from '../../../data/default-values';
import { toPascalCase } from '../../../utils/functions/capitalize';
import InputText from '../../input-text/input-text';
import PrimaryButton from '../../primary-button';

export type AccordionData = {
  accordionTitle: string;
  headers: string[];
  isEditable: boolean;
  index: number;
  content: any;
  setContent: React.Dispatch<React.SetStateAction<any[]>>;
};

const Accordion = ({
  accordionTitle,
  headers,
  content,
  isEditable,
  index,
  setContent,
}: AccordionData) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<any>();

  function handleAddNewRow() {
    const newContent = content;
    const isValidInsert =
      !newContent[index].details.length ||
      !newContent[index].details.filter((detail: any) => detail.isEdited)
        .length;

    if (!isValidInsert) return;
    (newContent[index].details as object[]).push(defaultChecklistAccordion);
    setContent([...newContent]);
  }

  function deleteDataFromRow(idx: number) {
    const newDetail = content[index].details;
    newDetail.splice(idx, 1);

    const newContent = content;
    newContent[index].details = newDetail;
    setContent([...newContent]);
  }

  function insertNewDataToRow(data: any) {
    const newContent = content;
    (newContent[index].details as object[])[
      newContent[index].details.length - 1
    ] = {
      ...data,
    };
    setContent([...newContent]);
    reset();
  }

  return (
    <div className={`relative overflow-hidden`}>
      <input
        type="checkbox"
        className="absolute inset-x-0 top-0 z-10 w-full h-12 opacity-0 cursor-pointer peer"
      />
      <div className="flex items-center w-full h-12 pl-5">
        <h1>{accordionTitle}</h1>
      </div>
      <div className="absolute transition-transform duration-500 rotate-0 top-3 right-3 peer-checked:rotate-180">
        <ChevronUpIcon className="w-6 h-6" />
      </div>
      <form
        className="flex flex-col overflow-hidden transition-all duration-500 bg-white max-h-0 peer-checked:max-h-fit"
        onSubmit={handleSubmit(insertNewDataToRow)}
      >
        {(content[index].details as any).map(
          (contentRow: any, contentIndex: number) => {
            return (
              <div
                key={contentIndex}
                className={
                  'bg-white p-3 pl-5 items-center sm:items-start border-gray-200 border-b inline-grid grid-cols-' +
                  (headers.length * 2 + (isEditable ? 1 : 0))
                }
              >
                {headers.map((h: any, idx: number) => {
                  return (
                    <div
                      key={idx}
                      className={`col-span-${
                        headers.length * 2 + (isEditable ? 1 : 0)
                      } sm:col-span-2 mb-auto`}
                    >
                      {contentRow.isEdited ? (
                        <div className="px-1 py-2 sm:py-0">
                          <InputText
                            id={`${h}_${idx}`}
                            name={`${h}`}
                            label={`${toPascalCase(h)}`}
                            labelLastSeen={'sm'}
                            type="text"
                            errors={errors}
                            register={register(h, {
                              required: `${toPascalCase(h)} is required.`,
                              validate: (value) => {
                                if (h !== 'id') return true;
                                return !(
                                  content[index].details as object[]
                                ).filter(
                                  (detail: any) => detail?.id === value || false
                                ).length
                                  ? true
                                  : 'Id must be unique!';
                              },
                            })}
                          />
                        </div>
                      ) : (
                        <div className="grid grid-cols-4 gap-1">
                          <div className="flex justify-between font-medium sm:hidden">
                            <span>{toPascalCase(h)}</span>
                            <span>:</span>
                          </div>
                          <div className="col-span-3 sm:col-span-1">
                            {(contentRow as any)[h]}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
                {isEditable && (
                  <div
                    className={`col-span-${
                      headers.length * 2 + (isEditable ? 1 : 0)
                    } sm:col-span-1`}
                  >
                    <div
                      className={`flex justify-center w-full text-gray-500 cursor-pointer pt-${
                        contentRow.isEdited ? '2.5' : '1'
                      } hover:text-gray-700`}
                    >
                      <div className="hidden sm:block">
                        {contentRow.isEdited ? (
                          <button type="submit">
                            <CheckIcon className="w-5 h-5" />
                          </button>
                        ) : (
                          <button
                            onClick={() => deleteDataFromRow(contentIndex)}
                            type="button"
                          >
                            <TrashIcon className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                      <div className="flex-1 block sm:hidden">
                        <PrimaryButton
                          type="submit"
                          classNames="w-full"
                          content="Save"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          }
        )}
        {isEditable && (
          <div
            className="flex justify-center p-3 underline cursor-pointer"
            onClick={handleAddNewRow}
          >
            Add New Row
          </div>
        )}
      </form>
    </div>
  );
};

export default Accordion;
