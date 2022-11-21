import { ChevronUpIcon } from '@heroicons/react/outline';

const Accordion = ({ title, content }: any) => {
  return (
    <div className={`relative overflow-hidden`}>
      <input
        type="checkbox"
        className="peer absolute top-0 inset-x-0 w-full h-12 opacity-0 z-10 cursor-pointer"
      />
      <div className="h-12 w-full pl-5 flex items-center">
        <h1>{title}</h1>
      </div>
      <div className="absolute top-3 right-3 transition-transform duration-500 rotate-0 peer-checked:rotate-180">
        <ChevronUpIcon className="w-6 h-6" />
      </div>
      <div className="overflow-hidden bg-white transition-all duration-500 max-h-0 peer-checked:max-h-40">
        <td className="py-4">
          <input
            type="checkbox"
            className="flex mx-auto w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
          />
        </td>
        {content.map((v: any, contentIndex: any) => {
          return (
            <div key={contentIndex} className="p-5 border-t">
              {v.tool}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Accordion;
