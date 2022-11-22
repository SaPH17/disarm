import { FieldErrorsImpl, UseFormRegisterReturn } from 'react-hook-form';
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
        <input
          id={id}
          {...register}
          type={type}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className={`block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300 rounded-md`}
          disabled={disabled}
        />

        {errors && <FormErrorMessage name={name} errors={errors} />}
      </div>
    </>
  );
};

export default InputText;