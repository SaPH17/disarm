import { useState } from 'react';
import FormErrorMessage from './input-text/form-error-message';

export type SelectedDetailData = {
  title: string;
  contentTitle: any[];
  content: any;
  setContent: any;
  registers: any;
  getValues: any;
  errors: any;
};

function toPascalCase(text: string) {
  const result = text.replace(/([A-Z])/g, ' $1');
  return result.charAt(0).toUpperCase() + result.slice(1);
}

export default function EditableSelectedDetail({
  title,
  contentTitle,
  content,
  setContent,
  registers,
  getValues,
  errors,
}: SelectedDetailData) {
  const [isEditable, setIsEditable] = useState(false);

  return (
    <div className="flex flex-col sm:gap-2 rounded divide-y-1 bg-white text-sm shadow">
      <div className="flex flex-row justify-between items-center px-2 sm:px-4 p-2 sm:p-4 bg-gray-50">
        <div className="text-md font-semibold">{title}</div>
        <button
          className={`flex justify-center text-xs items-center py-1 ${
            isEditable
              ? 'bg-indigo-600 border-indigo-400 text-white'
              : 'bg-white border-gray-400'
          }  font-semibold border rounded-sm px-3`}
          onClick={(e) => {
            e.preventDefault();
            setIsEditable(!isEditable);
          }}
        >
          {isEditable ? 'Save' : 'Edit'}
        </button>
      </div>
      <div className="px-2 pb-4 grid grid-cols-2 sm:grid-cols-3">
        {contentTitle.map((ct, idx) => {
          return (
            <div
              key={`editable-selected-detail-${ct.name}`}
              className="p-2 sm:p-4"
            >
              <div className="col-span-1 flex flex-col ">
                <div className="font-semibold">{toPascalCase(ct.name)}</div>
                {ct.editable && (
                  <input
                    id={ct.name}
                    type="text"
                    className={`mt-1 py-0.5 px-2 ${
                      isEditable ? 'flex' : 'hidden'
                    }`}
                    onChange={(e) =>
                      setContent({ ...content, [ct.name]: e.target.value })
                    }
                    {...registers[idx]}
                  ></input>
                )}
                <div
                  className={`${
                    !isEditable || !ct.editable ? 'flex' : 'hidden'
                  }`}
                >
                  {getValues(ct.name)}
                </div>
              </div>

              {errors && <FormErrorMessage name={ct.name} errors={errors} />}
            </div>
          );
        })}
      </div>
    </div>
  );
}
