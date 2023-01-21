import { Fragment, useRef } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { ExclamationIcon } from '@heroicons/react/outline';
import TableAccordion from '../tables/accordion/table-accordion';
import { useState, useEffect } from 'react';
import { SectionType } from '../../models/checklist/section';
import { toast } from 'react-toastify';
import { UpdateProjectChecklistHandler } from '../../handlers/project/edit-project-checklist-handler';

export type SelectedCheckChecklistPopupData = {
  id: string | number;
};

export type CheckChecklistPopupData = {
  selectedData: any;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const tableTitle = ['id', 'detail', 'tool', 'procedure'];

export default function CheckChecklistPopup({
  selectedData,
  open,
  setOpen,
}: CheckChecklistPopupData) {
  const cancelButtonRef = useRef(null);

  const [sections, setSections] = useState<SectionType[]>([]);
  const [selectedSections, setSelectedSections] = useState<string[]>([]);

  useEffect(() => {
    if (!selectedData.Checklist?.sections) return;
    setSections(JSON.parse(selectedData.Checklist.sections));
    if (selectedData.sections){
      setSelectedSections(JSON.parse(selectedData.sections));
    } else {
      setSelectedSections([]);
    }
    
  }, [selectedData]);

  async function handleUpdateProjectChecklist(){
    const result = document.querySelectorAll('input[type=checkbox][name^=checklist]:checked');
    const ids = Array.from(result).map(r => r.id.split('_')[1]);
    
    try {
      await toast.promise(
        UpdateProjectChecklistHandler.handleUpdateProjectChecklistFormSubmit(
          {
            sections: JSON.stringify(ids)
          },
          selectedData.id
        ),
        {
          success: `Successfully update ${selectedData.name} checklist`,
          pending: `Updating ${selectedData.name} checklist data`,
          error: {
            render({ data }: any) {
              return data.message;
            },
          },
        }
      );
    } catch (e) {}
  }

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        static
        className="fixed inset-0 z-10 overflow-y-auto"
        initialFocus={cancelButtonRef}
        open={open}
        onClose={setOpen}
      >
        <div className="flex items-end justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="inline-block mx-2 text-left align-bottom sm:align-middle">
              <div className='flex flex-col gap-3 px-4 pt-5 pb-4 overflow-hidden transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:max-w-6xl sm:w-full sm:p-6'>
                <div>
                <div className='text-xl font-semibold'>{ selectedData.name + ' (' + selectedData.company + ')' }</div>
                <div>{ 'Checklist : ' + selectedData.checklist }</div>
                </div>
                <TableAccordion
                  title={tableTitle}
                  content={sections}
                  setContent={setSections}
                  isCheckable={true}
                  initialChecked={selectedSections}
                />
                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    className="inline-flex justify-center w-full px-4 py-2 text-base font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => {
                      handleUpdateProjectChecklist();
                      setOpen(false);
                    }}
                  >
                    Update Checklist Progress
                  </button>
                  <button
                    type="button"
                    className="inline-flex justify-center w-full px-4 py-2 mt-3 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
                    onClick={() => setOpen(false)}
                    ref={cancelButtonRef}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
