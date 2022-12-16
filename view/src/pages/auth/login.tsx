import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import AuthServices from "../../services/auth-services";
import InputText from '../../components/input-text/input-text';
import PrimaryButton from "../../components/primary-button";
import { LoginFormData, LoginHandlers } from "../../handlers/auth/login-handlers";

/*
  This example requires Tailwind CSS v2.0+ 
  
  This example requires some changes to your config:
  
  ```
  // tailwind.config.js
  module.exports = {
    // ...
    plugins: [
      // ...
      require('@tailwindcss/forms'),
    ]
  }
  ```
*/
export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>();
  const navigate = useNavigate();
  
  const handleLoginFormSubmit = async (data: LoginFormData) => {
    await LoginHandlers.handleLoginFormSubmit(data);
    return navigate('/users');
  }
  
  return (
    <div className="flex flex-col justify-center min-h-screen py-12 bg-gray-50 sm:px-6 lg:px-8" onSubmit={handleSubmit(handleLoginFormSubmit)}>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <img
          className="w-auto h-12 mx-auto"
          src="/img/logos/workflow-mark-blue-600.svg"
          alt="Workflow"
        />
        <h2 className="mt-6 text-3xl font-extrabold text-center text-gray-900">Sign in to your account</h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="px-4 py-8 bg-white shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" >
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
              <PrimaryButton content='Sign In' type="submit" classNames="!rounded-md shadow-sm w-full"/>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
