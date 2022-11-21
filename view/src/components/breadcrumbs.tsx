import { ChevronRightIcon } from '@heroicons/react/solid';

export type BreadcrumbsData = {
  pages: {
    name: string;
    url: string;
  }[];
};

const Breadcrumbs = ({ pages }: BreadcrumbsData) => {
  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-4">
        {pages.map((page, idx) => (
          <li key={page.name}>
            <div className="flex items-center">
              {idx > 0 && (
                <ChevronRightIcon
                  className="flex-shrink-0 h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              )}
              <a
                href={page.url}
                className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700"
              >
                {page.name}
              </a>
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
