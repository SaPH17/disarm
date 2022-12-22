import { useState } from 'react';
import { TrashIcon } from '@heroicons/react/solid';

export type EditableListProps = {
  lists: string[];
  setLists: React.Dispatch<React.SetStateAction<string[]>>;
  title: string;
  editOnly?: boolean;
};

const EditableList = ({
  lists,
  setLists,
  title,
  editOnly = false,
}: EditableListProps) => {
  const [isEditable, setEditable] = useState(editOnly);

  const toggleEditable = (e: any) => {
    e.preventDefault();
    setEditable(!isEditable);
  };

  const deleteItem = (k: number) => {
    setLists((v) => [...v.slice(0, k), ...v.slice(k + 1)]);
  };

  return (
    <>
      <div className="flex justify-between">
        <div className="text-md font-semibold">{title}</div>
        <div className="flex">
          {!editOnly && (
            <button
              className={`flex justify-center text-xs items-center ${
                isEditable
                  ? 'bg-indigo-600 border-indigo-400 text-white'
                  : 'bg-white border-gray-400'
              }  font-semibold border rounded-sm px-3`}
              onClick={toggleEditable}
            >
              {isEditable ? 'Save' : 'Edit'}
            </button>
          )}
        </div>
      </div>
      <div>
        {lists.map((l, idx) => (
          <div
            key={`${title}-list-${idx}`}
            className={`flex relative border border-gray-300 ${
              idx + 1 === lists.length ? '' : 'border-b-transparent'
            }`}
          >
            <div className="flex justify-content items-center bg-gray-50 px-4 py-1">
              {idx + 1}
            </div>
            <textarea
              disabled={!isEditable}
              rows={1}
              onInput={(event) => {
                event.currentTarget.style.height = '';
                event.currentTarget.style.height =
                  event.currentTarget.scrollHeight + 'px';
              }}
              onChange={(e) => {
                const temp = [...lists];
                temp[idx] = e.target.value;
                setLists(temp);
              }}
              placeholder="Procedure"
              value={l}
              className="placeholder:text-gray-300 flex border-none resize-none w-[100%]"
            />
            {isEditable && (
              <div
                className="flex items-center justify-center px-3 cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  deleteItem(idx);
                }}
              >
                <TrashIcon className="w-5 h-5 text-gray-400" />
              </div>
            )}
          </div>
        ))}
        {isEditable && (
          <button
            className="flex justify-center items-center border border-t-transparent bg-gray-100 border-gray-300 w-[100%] font-semibold p-2 text-xs text-gray-400 hover:text-gray-500"
            onClick={(e) => {
              e.preventDefault();
              setLists((v) => [...v, '']);
            }}
          >
            New Row
          </button>
        )}
      </div>
    </>
  );
};

export default EditableList;
