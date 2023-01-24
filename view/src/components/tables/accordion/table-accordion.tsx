import { toPascalCase } from '../../../utils/functions/capitalize';
import Accordion from './accordion';
import ClassGeneratorElement from './class-generator-element';

export type TableData = {
  title: string[];
  content: object[];
  setContent: React.Dispatch<React.SetStateAction<any[]>>;
  isEditable?: boolean;
  isCheckable?: boolean;
  initialChecked?: string[];
};

/*
  onClickFunction : Callback function when a row content is clicked
*/

export default function TableAccordion({
  title,
  content,
  setContent,
  isEditable = false,
  isCheckable = false,
  initialChecked = []
}: TableData) {
  return (
    <div className="flex flex-col mb-4 overflow-hidden border-gray-200 rounded-sm shadow">
      <ClassGeneratorElement />
      <div className="hidden grid-cols-9">
        <div className="hidden col-span-9"></div>
      </div>
      <div
        className={`hidden bg-white p-3 pl-5 items-center sm:inline-grid grid-cols-${title.length * 2 + ((isEditable || isCheckable) ? 1 : 0)
          }`}
      >
        {title.map((t, idx) => {
          return (
            <div key={idx} className="col-span-2 px-2">
              {toPascalCase(t)}
            </div>
          );
        })}
        {
          isCheckable && <div></div>
        }
      </div>
      <div className="bg-gray-50">
        {content.map((c, contentIndex) => {
          return (
            <Accordion
              key={contentIndex}
              isEditable={isEditable}
              isCheckable={isCheckable}
              initialChecked={initialChecked}

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
