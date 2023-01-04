import { XIcon } from '@heroicons/react/outline';
import { User } from '../../../models/user';

export type UserCardData = {
  user: User;
  onClickFunction: Function;
};

export default function UserCard({ user, onClickFunction }: UserCardData) {
  return (
    <div className="flex flex-row justify-between p-2 rounded-lg shadow-md sm:p-4 bg-gray-300/75">
      <div className="flex flex-col">
        <span className="font-semibold">{user.name}</span>
        <span>{user.email}</span>
        <span>{user.job}</span>
      </div>
      <XIcon
        className="w-5 h-5 text-gray-500 cursor-pointer hover:text-gray-700"
        onClick={() => onClickFunction(user)}
      />
    </div>
  );
}
