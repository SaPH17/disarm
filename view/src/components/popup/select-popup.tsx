import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import SelectBox from '../select-box';
import GroupCard from '../page/user/group-card';

export type SelectPopupProps = {
  icon: any;
  title: string;
  availableData: any;
  onClickFunction: Function;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function SelectPopup({
  icon,
  title,
  availableData,
  onClickFunction,
  open,
  setOpen,
}: SelectPopupProps) {
  const [availableGroups, setAvailableGroups] = useState(availableData);
  const [selectedGroups, setSelectedGroups] = useState<any[]>([]);

  const appendGroup = (group: any) => {
    setSelectedGroups([...selectedGroups, group]);
    setAvailableGroups((v: any) => v.filter((u: any) => u.id !== group.id));
  };

  const removeGroup = (group: any) => {
    setAvailableGroups([...availableGroups, group]);
    setSelectedGroups((v: any) => v.filter((u: any) => u.id !== group.id));
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        static
        className="fixed z-10 inset-0"
        open={open}
        onClose={setOpen}
      >
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

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
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div>
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                  {icon}
                </div>
                <div className="mt-3 text-center sm:mt-5">
                  <Dialog.Title
                    as="h3"
                    className="text-lg leading-6 font-medium text-gray-900"
                  >
                    {title}
                  </Dialog.Title>
                  <div className="mt-4">
                    <div className="text-sm text-gray-500 gap-3 flex flex-col">
                      <SelectBox
                        items={availableGroups}
                        defaultValue={title}
                        onClickFunction={(item: any) => {
                          appendGroup(item);
                        }}
                      />
                      {selectedGroups.map((selectedGroup, index) => (
                        <GroupCard
                          key={index}
                          group={selectedGroup}
                          onClickFunction={(item: any) => {
                            removeGroup(item);
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-2 sm:text-sm"
                  onClick={() => {
                    setOpen(false);
                    onClickFunction(selectedGroups);
                    setSelectedGroups([]);
                    setAvailableGroups(availableData);
                  }}
                >
                  Save
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                  onClick={() => {
                    setOpen(false);
                    setSelectedGroups([]);
                    setAvailableGroups(availableData);
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
