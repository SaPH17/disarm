import { ErrorMessage } from '@hookform/error-message';
import { FieldErrorsImpl } from 'react-hook-form';

export type FormErrorMessageData = {
  name: string;
  errors: Partial<FieldErrorsImpl<object>>;
};

const FormErrorMessage = ({ name, errors }: FormErrorMessageData) => {
  return (
    <ErrorMessage
      errors={errors}
      name={name}
      as={<div className="text-sm text-red-500"></div>}
    />
  );
};

export default FormErrorMessage;
