import { useEffect } from "react";

export type SelectedDetailData = {
  title: string;
  contentTitle: string[];
  content: any;
  children?: any;
};

function toPascalCase(text: string) {
  const result = text.replace(/([A-Z])/g, ' $1');
  return result.charAt(0).toUpperCase() + result.slice(1);
}

export default function SelectedDetail({
  title,
  contentTitle,
  content,
  children = '',
}: SelectedDetailData) {
  return (
    <div className="flex flex-col text-sm bg-white rounded shadow sm:gap-2 divide-y-1">
      <div className="flex flex-row items-center justify-between p-2 px-2 sm:px-4 sm:p-4 bg-gray-50">
        <div className="font-semibold text-md">{title}</div>
        {content.id === '-' ? <div></div> : children}
      </div>
      <div className="grid grid-cols-2 px-2 pb-4 sm:grid-cols-3">
        {contentTitle.map((ct) => {
          return (
            <div key={ct} className="flex flex-col col-span-1 p-2 sm:p-4">
              <div className="font-semibold">{toPascalCase(ct)}</div>
              <div>{(content as any)[ct]}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
