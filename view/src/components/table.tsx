export type TableData = {
  title: string[];
  content: object[];
  onClickFunction?: Function;
};

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function Table({ title, content, onClickFunction = () => {} }: TableData) {
  return (
    <div className="flex flex-col">
      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {title.map((t) => {
                    return (
                      <th
                        key={ t }
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {t}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {content.map((c, contentIndex) => {
                  return (
                    <tr
                      onClick={ () => onClickFunction }
                      key={contentIndex}
                      className={
                        contentIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                      }
                    >
                      {title.map((t, titleIndex) => {
                        return (
                          <td
                          key={ titleIndex }
                            className={classNames(
                              titleIndex === 0
                                ? 'font-medium text-gray-900'
                                : 'text-gray-500',
                              'px-6 py-4 whitespace-nowrap text-sm'
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
