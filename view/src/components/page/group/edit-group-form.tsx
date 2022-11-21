import { XIcon } from '@heroicons/react/outline';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { GroupFormData } from '../../../models/forms/group-form-data';
import { GeneralData } from '../../../models/general-data';
import { Group } from '../../../models/group';
import { User } from '../../../models/user';
import GroupServices from '../../../services/group-services';
import UserServices from '../../../services/user-services';
import InputText from '../../input-text/input-text';
import SelectBox from '../../select-box';
import AssignedUserTable from './assigned-user-table';

const EditGroupForm = ({ group }: any) => {
  const [users, setUsers] = useState<User[]>();
  const [groups, setGroups] = useState<Group[]>();

  const { id } = useParams();

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<GroupFormData>();

  function handleCreateGroupButton(data: GroupFormData) {
    console.log(data);
  }

  function deleteUser(user: User) {
    console.log(user);
  }

  async function fetchGroups() {
    const result = await GroupServices.getGroups();
    setGroups(result);
  }

  async function fetchUsers() {
    const result = await UserServices.getUsers();
    const mappedUser = result.map((user) => {
      return {
        ...user,
        action: (
          <XIcon
            className="w-5 h-5 cursor-pointer"
            onClick={() => deleteUser(user)}
          />
        ),
      };
    });
    setUsers(mappedUser);
  }

  useEffect(() => {
    fetchGroups();
    fetchUsers();
  }, [id, group]);

  return groups && users ? (
    <div className="flex flex-col gap-4">
      <form
        className="space-y-8"
        onSubmit={handleSubmit(handleCreateGroupButton)}
      >
        <div className="space-y-6 sm:space-y-5">
          <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5">
            <InputText
              id="name"
              name="name"
              label="Name"
              type="text"
              errors={errors}
              register={register('name', {
                required: 'Name is required.',
              })}
            />
          </div>

          <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start  sm:pt-5">
            <InputText
              id="description"
              name="description"
              label="Description"
              type="text"
              errors={errors}
              register={register('description', {
                required: 'Description is required.',
              })}
            />
          </div>

          <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
            <label
              htmlFor="country"
              className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
            >
              Parent Group
            </label>
            <div className="mt-1 sm:mt-0 sm:col-span-2 flex flex-col gap-2">
              <div className="block max-w-lg w-full shadow-sm sm:text-sm border-gray-300 rounded-md">
                <SelectBox
                  items={groups as GeneralData[]}
                  defaultValue={'None'}
                />
              </div>
            </div>
          </div>
        </div>
        <AssignedUserTable users={users} />
      </form>
    </div>
  ) : (
    <></>
  );
};

export default EditGroupForm;
