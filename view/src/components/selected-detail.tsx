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
    <div className="flex flex-col sm:gap-2 rounded divide-y-1 bg-white text-sm shadow">
      <div className="flex flex-row justify-between items-center px-2 sm:px-4 p-2 sm:p-4 bg-gray-50">
        <div className="text-md font-semibold">{title}</div>
        {content.id === -1 ? <div></div> : children}
      </div>
      <div className="px-2 pb-4 grid grid-cols-2 sm:grid-cols-3">
        {contentTitle.map((ct) => {
          return (
            <div key={ct} className="col-span-1 flex flex-col p-2 sm:p-4">
              <div className="font-semibold">{toPascalCase(ct)}</div>
              <div>{(content as any)[ct]}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
