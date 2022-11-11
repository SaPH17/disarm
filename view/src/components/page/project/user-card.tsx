import { XIcon } from '@heroicons/react/outline';
import { User } from '../../../models/user';

export type UserCardData = {
  user: User,
  onClickFunction: Function,
}

export default function UserCard({user, onClickFunction}: UserCardData) {
  return (
    <div className="flex flex-row justify-between p-2 sm:p-4 shadow-md bg-gray-300/75 rounded-lg">
      <div className="flex flex-col">
        <span className="font-semibold">{ user.name }</span>
        <span>{ user.job }</span>
      </div>
      <XIcon className="w-5 h-5 text-gray-500 hover:text-gray-700 cursor-pointer" onClick={ () => onClickFunction(user) }/>
    </div>
  );
}
