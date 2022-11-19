import React, { useState } from 'react';

export type Title = {
  title: string;
};

const EditableImageList = ({ title }: Title) => {
  const [nrows, setNrows] = useState(1)
  const [isEditable, setEditable] = useState(false)
  const rows: JSX.Element[] = []

  for (let i = 0; i < nrows; i++) {
    rows.push(
      <div key={i + 1} className={'flex border border-gray-300' + (i + 1== nrows ? '' : ' border-b-transparent')}>
        <div className='flex justify-content items-center bg-gray-50 px-4 py-1'>{i + 1}</div>
        <img className='w-72 my-2 mx-3 rounded-md' src="https://m.media-amazon.com/images/M/MV5BYTJiYWY2YjAtMGI1OS00NjA2LWJhYzQtYTg2NTZiMjM3NjAzXkEyXkFqcGdeQXVyNzI1NzMxNzM@._V1_.jpg" alt="" />
        <textarea disabled={!isEditable} rows={1} onInput={(event) => {
          event.currentTarget.style.height = ""
          event.currentTarget.style.height = event.currentTarget.scrollHeight + "px"
        }} placeholder='Evidence description' className='flex border-none resize-none w-[100%] placeholder:text-gray-300'/>
      </div>
    )
  }
  
  const toggleEditable = () => {
    setEditable(!isEditable)
  }

  let edit: JSX.Element;
  let action: JSX.Element;
  if (isEditable) {
    action = <button className="flex justify-center text-xs items-center bg-indigo-600 font-semibold border border-indigo-400 rounded-sm px-3 text-white" onClick={toggleEditable}>Save</button>
    edit = <button className='flex justify-center items-center border border-t-transparent bg-gray-100 border-gray-300 w-[100%] font-semibold p-2 text-xs text-gray-400 hover:text-gray-500' onClick={() => {
      setNrows(nrows + 1)
    }}>New Row</button>
  } else {
    action = <button className="flex justify-center text-xs items-center bg-white font-semibold border border-gray-400 rounded-sm px-3" onClick={toggleEditable}>Edit</button>
    edit = <></>
  }

  return (
    <>
      <div className="flex justify-between">
          <div className="text-md font-semibold">{title}</div>
          <div className='flex'>
            {action}
          </div>
      </div>
      <div>
          {rows}
          {edit}
      </div>
    </>
  );
};

export default EditableImageList;
