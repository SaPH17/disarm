import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import InputText from '../../components/input-text/input-text';
import PrimaryButton from '../../components/primary-button';
import {
  LoginFormData,
  LoginHandlers,
} from '../../handlers/auth/login-handler';
import { toast } from 'react-toastify';
import { useAtom } from 'jotai';
import authAtom from '../../atoms/atom';
import { useState } from 'react';
import ChangePasswordPopup from '../../components/page/register/change-password-popup';

export default function Login() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>();
  const [auth, setAuth] = useAtom(authAtom);
  const navigate = useNavigate();
  const [openChangePassword, setOpenChangePassword] = useState(false);

  const handleLoginFormSubmit = async (data: LoginFormData) => {
    try {
      const { is_password_changed, ...authData } =
        await LoginHandlers.handleLoginFormSubmit(data);

      if (!is_password_changed) {
        setOpenChangePassword(true);
      } else {
        setAuth(authData);
        toast.success('Successfully Login');
        navigate('/users');
      }
    } catch (e: any) {
      toast(e.response.data.error, { type: 'error' });
    }
  };

  return (
    <>
      <div
        className="flex flex-col justify-center min-h-screen py-12 bg-gray-50 sm:px-6 lg:px-8"
        onSubmit={handleSubmit(handleLoginFormSubmit)}
      >
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <img className="w-auto h-12 mx-auto" src="/Disarm.png" alt="Disarm" />
          <h2 className="mt-6 text-3xl font-extrabold text-center text-gray-900">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="px-4 py-8 bg-white shadow sm:rounded-lg sm:px-10">
            <form className="space-y-6">
              <div>
                <InputText
                  id="email"
                  name="email"
                  label="Email Address"
                  type="email"
                  errors={errors}
                  register={register('email', {
                    required: 'Email is required.',
                  })}
                />
              </div>

              <div>
                <InputText
                  id="password"
                  name="password"
                  label="Password"
                  type="password"
                  errors={errors}
                  onChange={(val: any) => {
                    setValue('password', val);
                  }}
                  register={register('password', {
                    required: 'Password is required.',
                  })}
                />
              </div>

              {/* <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember_me"
                  name="remember_me"
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="remember_me" className="block ml-2 text-sm text-gray-900">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link to="#" className="font-medium text-blue-600 hover:text-blue-500">
                  Forgot your password?
                </Link>
              </div>
            </div> */}

              <div>
                <PrimaryButton
                  content="Sign In"
                  type="submit"
                  classNames="!rounded-md shadow-sm w-full"
                />
              </div>
            </form>
          </div>
        </div>
      </div>
      <ChangePasswordPopup
        open={openChangePassword}
        setOpen={setOpenChangePassword}
      />
    </>
  );
}
