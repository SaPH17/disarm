export type SelectedDetailData = {
  title: string;
  contentTitle: string[];
  content: object;
};

function toPascalCase(text: string) {
  const result = text.replace(/([A-Z])/g, ' $1');
  return result.charAt(0).toUpperCase() + result.slice(1);
}

export default function SelectedDetail({
  title,
  contentTitle,
  content,
}: SelectedDetailData) {
  return (
    <div className="flex flex-col gap-2 sm:gap-4 bg-gray-100 rounded border border-4 border-dashed rounded divide-y-4 divide-dashed">
      <div className="flex flex-row justify-between items-center px-2 sm:px-4 pt-2 sm:pt-4">
        <div className="text-lg font-semibold">{title}</div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3">
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
