import { Fragment, useState } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid';
import { GeneralData } from '../models/general-data';
import { FieldErrorsImpl, UseFormRegisterReturn } from 'react-hook-form';
import FormErrorMessage from './input-text/form-error-message';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export type GeneralSelectBoxData = {
  items: GeneralData[];
  defaultValue?: string;
  onClickFunction?: Function;
  register?: UseFormRegisterReturn<any>;
  name?: string;
  errors?: Partial<FieldErrorsImpl<object>>;
  initialSelected?: GeneralData;
};

export default function SelectBox({
  items,
  defaultValue = 'Select Item',
  onClickFunction = () => {},
  register,
  errors,
  name,
  initialSelected,
}: GeneralSelectBoxData) {
  const [selected, setSelected] = useState<null | GeneralData>(
    initialSelected || null
  );

  return (
    <>
      <Listbox value={selected} onChange={setSelected}>
        {({ open }) => (
          <>
            <div className="mt-1 relative">
              <Listbox.Button className="w-full bg-white relative border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                <span className="block truncate">
                  {selected === null ? defaultValue : selected.name}
                </span>
                <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <SelectorIcon
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </span>
              </Listbox.Button>

              <Transition
                show={open}
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options
                  static
                  className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm"
                >
                  {items.map((item) => (
                    <Listbox.Option
                      key={item.id}
                      className={({ active }) =>
                        classNames(
                          active ? 'text-white bg-blue-600' : 'text-gray-900',
                          'cursor-default select-none relative py-2 pl-3 pr-9'
                        )
                      }
                      value={item}
                      onClick={() => {
                        onClickFunction(item);
                      }}
                    >
                      {({ selected, active }) => (
                        <>
                          <span
                            className={classNames(
                              selected ? 'font-semibold' : 'font-normal',
                              'block truncate'
                            )}
                          >
                            {item.name}
                          </span>

                          {selected ? (
                            <span
                              className={classNames(
                                active ? 'text-white' : 'text-blue-600',
                                'absolute inset-y-0 right-0 flex items-center pr-4'
                              )}
                            >
                              <CheckIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          </>
        )}
      </Listbox>
      {errors && name && <FormErrorMessage name={name} errors={errors} />}
    </>
  );
}
