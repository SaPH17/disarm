/* This example requires Tailwind CSS v2.0+ */
import { Dialog, Transition } from '@headlessui/react';
import { ExclamationIcon, XIcon } from '@heroicons/react/outline';
import { Fragment } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ChangePasswordHandlers } from '../../../handlers/auth/change-password-handler';
import { LoginHandlers } from '../../../handlers/auth/login-handler';
import InputText from '../../input-text/input-text';
import PrimaryButton from '../../primary-button';

export type ChangePasswordPopupData = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export type ChangePasswordFormData = {
  oldPassword: string;
  password: string;
  confirmPassword: string;
};

export default function ChangePasswordPopup({
  open,
  setOpen,
}: ChangePasswordPopupData) {
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    getValues,
  } = useForm<ChangePasswordFormData>();
  const navigate = useNavigate();

  async function handleChangePassword(data: ChangePasswordFormData) {
    const { confirmPassword, ...body } = data;

    try {
      await toast.promise(
        ChangePasswordHandlers.handleChangePasswordFormSubmit(body),
        {
          success: 'Successfully change password!',
          error: {
            render({ data }: any) {
              return data.message;
            },
          },
          pending: 'Waiting for change password!',
        }
      );

      return navigate('/');
    } catch (e) {}
  }

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        static
        className="fixed inset-0 z-10 overflow-y-auto"
        open={open}
        onClose={() => {}}
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
            <div className="inline-block px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div className="absolute top-0 right-0 hidden pt-4 pr-4 sm:block">
                <button
                  type="button"
                  className="text-gray-400 bg-white rounded-md hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  onClick={() => setOpen(false)}
                >
                  <span className="sr-only">Close</span>
                  <XIcon className="w-6 h-6" aria-hidden="true" />
                </button>
              </div>
              <form
                className="flex flex-col"
                onSubmit={handleSubmit(handleChangePassword)}
              >
                <div className="sm:flex sm:items-start">
                  <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 mx-auto bg-yellow-100 rounded-full sm:mx-0 sm:h-10 sm:w-10">
                    <ExclamationIcon
                      className="w-6 h-6 text-yellow-600"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900"
                    >
                      Change Password
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        We detected that you are still using the default
                        password. Please change your default password.
                      </p>
                    </div>
                    <div className="mt-2 space-y-6 text-left sm:space-y-2">
                      <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5">
                        <InputText
                          id="oldPassword"
                          name="oldPassword"
                          label="Old Password"
                          type="password"
                          errors={errors}
                          register={register('oldPassword', {
                            required: 'Old password is required.',
                          })}
                        />
                      </div>

                      <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5">
                        <InputText
                          id="newPassword"
                          name="password"
                          label="Password"
                          type="password"
                          errors={errors}
                          register={register('password', {
                            required: 'Password is required.',
                          })}
                        />
                      </div>

                      <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5">
                        <InputText
                          id="confirmPassword"
                          name="confirmPassword"
                          label="Confirm Password"
                          type="password"
                          errors={errors}
                          register={register('confirmPassword', {
                            required: 'Confirm password is required.',
                            validate: (confirmPassword) => {
                              if (getValues('password') === confirmPassword)
                                return true;
                              return 'Password is not same with confirm password.';
                            },
                          })}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                  <PrimaryButton
                    content="Change Password"
                    type="submit"
                    classNames="w-full rounded"
                  />
                </div>
              </form>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
