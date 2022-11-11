import {
  FieldErrorsImpl,
  UseFormRegister,
  UseFormRegisterReturn,
} from 'react-hook-form';
import FormErrorMessage from './form-error-message';

export type InputTextData = {
  id: string;
  name: string;
  label: string;
  type: string;
  placeholder?: string;
  errors?: Partial<FieldErrorsImpl<object>>;
  register?: UseFormRegisterReturn<any>;
  onChange?: Function;
  list?: string;
  disabled?: boolean;
};

const InputText = ({
  id,
  name,
  label,
  type,
  placeholder,
  errors,
  register,
  onChange = () => {},
  list,
  disabled = false,
}: InputTextData) => {
  return (
    <>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
      >
        {label}
      </label>
      <div className="mt-1 sm:mt-0 sm:col-span-2">
        <div className="mt-1 sm:mt-0 sm:col-span-2">
          <input
            id={id}
            {...register}
            type={type}
            placeholder={placeholder}
            onChange={(e) => onChange(e.target.value)}
            list={list}
            className={`block max-w-lg w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300 rounded-md`}
            disabled={disabled}
          />

          {errors && <FormErrorMessage name={name} errors={errors} />}
        </div>
      </div>
    </>
  );
};

export default InputText;
