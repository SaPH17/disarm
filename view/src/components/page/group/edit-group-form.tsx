import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery } from 'react-query';
import { GroupFormData } from '../../../models/forms/group-form-data';
import { GeneralData } from '../../../models/general-data';
import { Group } from '../../../models/group';
import { User } from '../../../models/user';
import GroupServices from '../../../services/group-services';
import UserServices from '../../../services/user-services';
import { toReadableDate } from '../../../utils/functions/dates';
import InputText from '../../input-text/input-text';
import SelectBox from '../../select-box';
import AssignedUserTable from './assigned-user-table';

const EditGroupForm = ({ group }: { group: Group }) => {
  const { data: usersData } = useQuery('users', UserServices.getUsers);
  const { data: groupsData } = useQuery('groups', GroupServices.getGroups);

  const users = usersData?.map((user: User) => ({
    id: user.id,
    name: user.username,
    email: user.email,
    dateCreated: toReadableDate(new Date(user.created_at || '')),
  })) || null;

  const groups =
    groupsData?.map((r: Group) => ({
      id: r.id,
      name: r.name,
      description: r.description,
      directParentGroup: r.directParentGroup,
      permissions: r.permissions,
    })) || null;

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<GroupFormData>();

  function handleCreateGroupButton(data: GroupFormData) {
    console.log(data);
  }

  function deleteUser(user: User) {
    console.log(user);
  }

  useEffect(() => {
    if (!group) return;
    reset(group);
  }, [group]);

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

          <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5">
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
            <div className="flex flex-col gap-2 mt-1 sm:mt-0 sm:col-span-2">
              <div className="block w-full max-w-lg border-gray-300 rounded-md shadow-sm sm:text-sm">
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
