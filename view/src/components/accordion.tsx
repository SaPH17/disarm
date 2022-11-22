import { ChevronUpIcon } from '@heroicons/react/outline';

const Accordion = ({ accordionTitle, headers, content, isEditable }: any) => {
  return (
    <div className={`relative overflow-hidden`}>
      <input
        type="checkbox"
        className="peer absolute top-0 inset-x-0 w-full h-12 opacity-0 z-10 cursor-pointer"
      />
      <div className="h-12 w-full pl-5 flex items-center">
        <h1>{accordionTitle}</h1>
      </div>
      <div className="absolute top-3 right-3 transition-transform duration-500 rotate-0 peer-checked:rotate-180">
        <ChevronUpIcon className="w-6 h-6" />
      </div>
      <div className="flex flex-col overflow-hidden bg-white transition-all duration-500 max-h-0 peer-checked:max-h-fit">
        {content.map((contentRow: any, contentIndex: number) => {
          return (
            <div
              key={contentIndex}
              className={
                'bg-white p-3 pl-5 items-center border-gray-200 border-b inline-grid grid-cols-' +
                (headers.length + 1) * 2
              }
            >
              <input
                id="check-all"
                type="checkbox"
                className="flex w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              {headers.map((h: any, idx: number) => {
                return (
                  <div key={idx} className="col-span-2">
                    {(contentRow as any)[h]}
                  </div>
                );
              })}
            </div>
          );
        })}
        {isEditable && (
          <div className="flex justify-center p-3 underline cursor-pointer">
            Add New Row
          </div>
        )}
      </div>
    </div>
  );
};

export default Accordion;