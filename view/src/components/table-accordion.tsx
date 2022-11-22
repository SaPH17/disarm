import { useState } from 'react';
import Accordion from './accordion';

export type TableData = {
  title: string[];
  content: object[];
  onCheckedFunction: Function;
  onUncheckedFunction: Function;
  onClickFunction?: Function;
  isCheckOnRowClick?: Boolean;
};

function toPascalCase(text: string) {
  const result = text.replace(/([A-Z])/g, ' $1');
  return result.charAt(0).toUpperCase() + result.slice(1);
}

/*
  onClickFunction : Callback function when a row content is clicked
*/

export default function TableAccordion({
  title,
  content,
  onCheckedFunction,
  onUncheckedFunction,
  onClickFunction = () => {},
  isCheckOnRowClick = false,
}: TableData) {
  const [isCheckedAll, setIsCheckedAll] = useState(false);
  const [checkedList, setCheckedList] = useState<String[]>([]);

  const handleCheckAll = (e: any) => {
    setIsCheckedAll(!isCheckedAll);

    if (!isCheckedAll) {
      setCheckedList(
        Array.from({ length: content.length }, (_, i) => `check-${i}`)
      );
      return;
    }

    setCheckedList([]);
  };

  const handleCheck = (e: any, id: String, item: any) => {
    if (!checkedList.includes(id)) {
      setCheckedList([...checkedList, id]);
      return;
    }

    setCheckedList(checkedList.filter((item) => item !== id));
  };

  return (
    <div className='flex mb-4 flex-col rounded-sm shadow overflow-hidden border-gray-200'>
      <div className={'bg-white p-3 pl-5 items-center inline-grid grid-cols-' + ((title.length + 1) * 2)}>
        <input
          id="check-all"
          checked={isCheckedAll}
          onChange={handleCheckAll}
          type="checkbox"
          className="flex w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
        />
        {
          title.map((t) => {
            return (
              <div className='col-span-2'>
              {toPascalCase(t)}
              </div>
            );
          })
        }
      </div>
      <div className='bg-gray-50'>
        {content.map((c, contentIndex) => {
          return (
            <Accordion
              title={(c as any).name}
              headers={title}
              content={(c as any).details}
            ></Accordion>
          );
        })}
      </div>
    </div>
  );
}
