import { XIcon } from '@heroicons/react/outline';

export type Group = {
  id: string;
  name: string;
};

export type UserCardData = {
  group: Group,
  onClickFunction: Function,
}

export default function GroupCard({group, onClickFunction}: UserCardData) {
  return (
    <div className="flex flex-row justify-between p-2 sm:p-4 shadow-md bg-gray-300/75 rounded-lg">
      <div className="flex flex-col">
        <span className="font-semibold">{ group.name }</span>
      </div>
      <XIcon className="w-5 h-5 text-gray-500 hover:text-gray-700 cursor-pointer" onClick={ () => onClickFunction(group) }/>
    </div>
  );
}
