export type TableData = {
  title: string[];
  content: object[];
  isClickable?: Boolean;
  onClickFunction?: Function;
};

function toPascalCase(text: string) {
  const result = text.replace(/([A-Z])/g, ' $1');
  return result.charAt(0).toUpperCase() + result.slice(1);
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function Table({
  title,
  content,
  isClickable = false,
  onClickFunction = () => {},
}: TableData) {
  return (
    <div className="flex flex-col">
      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="shadow overflow-hidden border-b border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
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
                      onClick={() => onClickFunction(c)}
                      key={contentIndex}
                      className={`${
                        contentIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                      } ${
                        isClickable ? 'cursor-pointer hover:bg-gray-200 ' : ''
                      }`}
                    >
                      {title.map((t, titleIndex) => {
                        return (
                          <td
                            key={titleIndex}
                            className={classNames(
                              titleIndex === 0
                                ? 'font-medium text-gray-900'
                                : 'text-gray-500',
                              'px-6 py-4 whitespace-nowrap text-sm text-left'
                            )}
                          >
                            {(c as any)[t]}
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
