import React, { useState } from 'react';

export type Title = {
  title: string;
};

const EditableList = ({ title }: Title) => {
  const [nrows, setNrows] = useState(1)
  const [isEditable, setEditable] = useState(false)
  const rows: JSX.Element[] = []
  
  const toggleEditable = () => {
    setEditable(!isEditable)
  }

  const delItem = (k:number) => {
    rows.splice(k, 1)
    console.log(rows)
    setNrows(nrows - 1)
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

  for (let i = 0; i < nrows; i++) {
    let del: JSX.Element = <></>
    if (isEditable) {
      del = <button className='text-xs w-6 h-6 font-semibold text-gray-400 rounded-full absolute right-2 top-0 m-auto bottom-0 bg-gray-100 opacity-[0.35] transition-all hover:opacity-[0.85]' onClick={() => {
        delItem(i)
      }}>X</button>
    }

    rows.push(
      <div key={i + 1} className={'flex relative border border-gray-300' + (i + 1== nrows ? '' : ' border-b-transparent')}>
        <div className='flex justify-content items-center bg-gray-50 px-4 py-1'>{i + 1}</div>
        <textarea disabled={!isEditable} rows={1} onInput={(event) => {
          event.currentTarget.style.height = ""
          event.currentTarget.style.height = event.currentTarget.scrollHeight + "px"
        }} placeholder='Procedure' className='placeholder:text-gray-300 flex border-none resize-none w-[100%]'/>
        {del}
      </div>
    )
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

export default EditableList;
