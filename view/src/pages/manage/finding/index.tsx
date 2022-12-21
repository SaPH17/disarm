import SelectedDetail from '../../../components/selected-detail';
import EditableList from '../../../components/editable-list';
import { useState } from 'react';
import EditableImageList from '../../../components/editable-image-list';

const contentTitle = [
  'name',
  'description',
  'permissions',
  'directParentGroup',
];
const contentData = {
  name: 'Role A',
  description: 'Role for admin',
  Permissions: '- updateuser.*',
  directParentGroup: 'Role B',
};

export default function ManageFindingIndex() {
  const [isDescEditable, setDescEditable] = useState(false);

  const toggleDescEditable = () => {
    setDescEditable(!isDescEditable);
  };

  let descAction: JSX.Element;

  if (isDescEditable) {
    descAction = (
      <button
        className="flex justify-center text-xs items-center bg-indigo-600 font-semibold border border-indigo-400 rounded-sm px-3 text-white"
        onClick={toggleDescEditable}
      >
        Save
      </button>
    );
  } else {
    descAction = (
      <button
        className="flex justify-center text-xs items-center bg-white font-semibold border border-gray-400 rounded-sm px-3"
        onClick={toggleDescEditable}
      >
        Edit
      </button>
    );
  }

  return (
    <>
      <div className="text-xl font-semibold">Finding A</div>
      <SelectedDetail
        title={'Details'}
        contentTitle={contentTitle}
        content={contentData}
      />

      <div className="flex justify-between">
        <div className="text-md font-semibold">Description</div>
        {descAction}
      </div>
      <textarea
        disabled={!isDescEditable}
        onInput={(event) => {
          event.currentTarget.style.height = '';
          event.currentTarget.style.height =
            event.currentTarget.scrollHeight + 'px';
        }}
        placeholder="Description"
        className="placeholder:text-gray-300 flex overflow-hidden border border-gray-300 rounded-sm resize-none h-24 min-h-24 w-[100%]"
      />

      <EditableList title="Replication Steps"></EditableList>
      <EditableList title="Recommendations"></EditableList>
      <EditableImageList title="Evidence"></EditableImageList>
      <EditableImageList title="Fixed Evidence"></EditableImageList>
    </>
  );
}
