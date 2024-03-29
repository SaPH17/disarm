import { TrashIcon } from '@heroicons/react/solid';
import { useState } from 'react';

export type EditableImageListProps = {
  lists: ImageListData[];
  setLists: React.Dispatch<React.SetStateAction<ImageListData[]>>;
  title: string;
  editOnly?: boolean;
};

export type ImageListData = {
  image: string;
  imageUrl: string;
  content: string;
};

export const defaultListData = {
  image: 'dummy.png',
  imageUrl: '/image-placeholder.webp',
  content: '',
};

const EditableImageList = ({
  lists,
  setLists,
  title,
  editOnly = false,
}: EditableImageListProps) => {
  const [images, setImages] = useState<any>([]);
  const [isEditable, setEditable] = useState(editOnly);

  const toggleEditable = (e: any) => {
    e.preventDefault();
    setEditable(!isEditable);
  };

  const deleteItem = (k: number) => {
    setLists((v) => [...v.slice(0, k), ...v.slice(k + 1)]);
  };

  const handleImageUpload = (idx: number, e: any) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }

    const temp = [...images];
    temp[idx] = e.target.files[0];
    setImages(temp);

    const temp2 = [...lists];
    temp2[idx].image = e.target.files[0];
    temp2[idx].imageUrl = URL.createObjectURL(e.target.files[0]);
    setLists(temp2);
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
            <label
              htmlFor={`${title}-image-${idx}`}
              className={`flex px-2 py-3 ${isEditable && 'cursor-pointer'}`}
            >
              <img className="w-72 rounded-md" src={l.imageUrl} alt="" />
            </label>
            {isEditable && (
              <input
                className="hidden"
                type="file"
                name={`${title}-image-${idx}`}
                id={`${title}-image-${idx}`}
                onChange={(e) => {
                  handleImageUpload(idx, e);
                }}
              />
            )}
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
                temp[idx].content = e.target.value;
                setLists(temp);
              }}
              placeholder="Procedure"
              value={l.content}
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
              setLists((v) => [...v, { ...defaultListData }]);
            }}
          >
            New Row
          </button>
        )}
      </div>
    </>
  );
};

export default EditableImageList;
