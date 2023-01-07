import { toPascalCase } from '../../../utils/functions/capitalize';
import Accordion from './accordion';

export type TableData = {
  title: string[];
  content: object[];
  setContent: React.Dispatch<React.SetStateAction<any[]>>;
  isEditable?: boolean;
};

/*
  onClickFunction : Callback function when a row content is clicked
*/

export default function TableAccordion({
  title,
  content,
  setContent,
  isEditable = false,
}: TableData) {
  return (
    <div className="flex flex-col mb-4 overflow-hidden border-gray-200 rounded-sm shadow">
      <div className="hidden grid-cols-8"></div>
      <div className="hidden grid-cols-9">
        <div className="hidden col-span-9"></div>
      </div>
      <div
        className={`bg-white p-3 pl-5 items-center inline-grid grid-cols-${
          title.length * 2 + (isEditable ? 1 : 0)
        }`}
      >
        {title.map((t, idx) => {
          return (
            <div key={idx} className="col-span-2 px-2">
              {toPascalCase(t)}
            </div>
          );
        })}
        <div></div>
      </div>
      <div className="bg-gray-50">
        {content.map((c, contentIndex) => {
          return (
            <Accordion
              key={contentIndex}
              isEditable={isEditable}
              accordionTitle={(c as any).name}
              headers={title}
              index={contentIndex}
              setContent={setContent}
              content={content}
            ></Accordion>
          );
        })}
      </div>
    </div>
  );
}
