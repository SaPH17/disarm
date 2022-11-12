import { useState } from 'react';

export type TableData = {
  title: string[];
  content: object[];
  onCheckedFunction: Function;
  onUncheckedFunction: Function;
  onClickFunction?: Function;
};

function toPascalCase(text: string) {
  const result = text.replace(/([A-Z])/g, ' $1');
  return result.charAt(0).toUpperCase() + result.slice(1);
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

/*
  onClickFunction : Callback function when a row content is clicked
*/

export default function TableCheckbox2({
  title,
  content,
  onCheckedFunction,
  onUncheckedFunction,
  onClickFunction = () => {},
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
    <div className="flex flex-col">
      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="shadow overflow-hidden border-b border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3">
                    <input
                      id="check-all"
                      checked={isCheckedAll}
                      onChange={handleCheckAll}
                      type="checkbox"
                      className="flex mx-auto w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                  </th>
                  {title.map((t) => {
                    return (
                      <th
                        key={t}
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider"
                      >
                        {toPascalCase(t)}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {content.map((c, contentIndex) => {
                  return (
                    <tr
                      onClick={(e: any) => {
                        console.log(e.target.tagName);
                        if (e.target.tagName === 'INPUT') {
                          return;
                        }
                        onCheckedFunction(c);
                      }}
                      key={contentIndex}
                      className={`${
                        contentIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                      } cursor-pointer hover:bg-gray-200`}
                    >
                      <td className="py-4">
                        <input
                          type="checkbox"
                          onChange={(e) => {
                            handleCheck(e, `check-${contentIndex}`, c);
                          }}
                          checked={checkedList.includes(
                            `check-${contentIndex}`
                          )}
                          className="flex mx-auto w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        />
                      </td>
                      {title.map((t, titleIndex) => {
                        return (
                          <td
                            key={titleIndex}
                            className={classNames(
                              titleIndex === 0
                                ? 'font-medium text-gray-900'
                                : 'text-gray-500',
                              'px-6 py-4 whitespace-nowrap text-sm select-none'
                            )}
                          >
                            {titleIndex === 0 ? (
                              <span
                                onClick={(e) => onClickFunction(c)}
                                className={`${
                                  titleIndex === 0 ? 'hover:underline' : ''
                                }`}
                              >
                                {(c as any)[t]}
                              </span>
                            ) : (
                              <span>{(c as any)[t]}</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
