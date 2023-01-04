import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { EditUserHandler } from '../../../handlers/user/edit-user-handler';
import { UserFormData } from '../../../models/forms/user-form-data';
import { Group } from '../../../models/group';
import { User } from '../../../models/user';
import UserServices from '../../../services/user-services';
import InputText from '../../input-text/input-text';
import PrimaryButton from '../../primary-button';

export default function EditUserForm() {
  const params = useParams();
  const { data: userData, refetch } = useQuery(`users/${params.id}`, () =>
    UserServices.getOneUser(params.id)
  );
  const { data: usersData } = useQuery(`users`, UserServices.getUsers);

  const user =
    {
      ...userData,
    } || null;
  const users = usersData?.filter((u: User) => u.id !== user.id) || null;

  const [selectedGroups, setSelectedGroups] = useState<Group[]>([]);
  const [availableGroups, setAvailableGroups] = useState<Group[]>();

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<UserFormData>();

  function getCurrentGroup(item: any) {
    const tempSelectedGroup = [...selectedGroups, item];
    resetAssignedGroupState(tempSelectedGroup);
  }

  function removeCurrentGroup(group: any) {
    const tempSelectedUser = selectedGroups.filter(
      (selectedGroup) => selectedGroup.id !== group.id
    );
    resetAssignedGroupState(tempSelectedUser);
  }

  function resetAssignedGroupState(tempSelectedGroup: Group[]) {
    setSelectedGroups(tempSelectedGroup);
    // setAvailableGroups(
    //   groups!.filter(
    //     (group) =>
    //       !tempSelectedGroup.find(
    //         (selectedGroup) => selectedGroup.id === group.id
    //       )
    //   )
    // );
  }

  function handleEditUserButton(data: UserFormData) {
    try {
      toast.promise(EditUserHandler.handleEditUserFormSubmit(data, user.id), {
        success: 'Successfully edit new user',
        pending: 'Waiting for edit new user!',
        error: {
          render({ data }: any) {
            return data.message;
          },
        },
      });
      refetch();
    } catch (e) {}
  }

  useEffect(() => {
    if (!user) return;
    reset({
      ...user,
      direct_supervisor: (user as User).Supervisor?.email || '',
    });
  }, [userData]);

  return user ? (
    <form className="space-y-8" onSubmit={handleSubmit(handleEditUserButton)}>
      <div className="space-y-6 sm:space-y-5">
        <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5">
          <InputText
            id="username"
            name="username"
            label="Username"
            type="text"
            errors={errors}
            register={register('username', {
              required: 'Username is required.',
            })}
          />
        </div>

        <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5">
          <InputText
            id="email"
            name="email"
            label="Email"
            type="email"
            errors={errors}
            register={register('email', {
              required: 'Email is required.',
            })}
          />
        </div>

        <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5">
          <InputText
            id="direct-supervisor"
            name="direct_supervisor"
            label="Direct Supervisor"
            type="email"
            datalist={
              <datalist id="direct-supervisors">
                {users &&
                  users.map((user: User) => {
                    return <option key={user.id} value={user.email}></option>;
                  })}
                <option value=""></option>
              </datalist>
            }
            listId={'direct-supervisors'}
            errors={errors}
            register={register('direct_supervisor', {
              validate: (email) => {
                if (!email) return true;
                const countUser = users.filter(
                  (user: User) => user.email === email
                ).length;
                return !countUser
                  ? 'Direct supervisor email is not existsx'
                  : true;
              },
            })}
          />
        </div>

        {/* {availableGroups && (
          <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
            <label
              htmlFor="last_name"
              className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
            >
              Groups
            </label>
            <div className="flex flex-col gap-4 mt-1 sm:mt-0 sm:col-span-2">
              <div className="flex flex-col gap-2">
                <div className="block w-full max-w-lg border-gray-300 rounded-md shadow-sm sm:text-sm">
                  <SelectBox
                    defaultValue="Select Group"
                    items={availableGroups as GeneralData[]}
                    onClickFunction={getCurrentGroup}
                  />
                </div>
                <Link to="/groups/create">
                  <span className="text-gray-500 underline cursor-pointer hover:text-gray-700">
                    Create a new group
                  </span>
                </Link>
              </div>
              <div className="flex flex-col w-full max-w-lg gap-2 border-gray-300 rounded-md sm:text-sm">
                {selectedGroups.map((selectedGroup, index) => (
                  <GroupCard
                    key={index}
                    group={selectedGroup}
                    onClickFunction={removeCurrentGroup}
                  />
                ))}
              </div>
            </div>
          </div>
        )} */}
      </div>
      <div className="flex flex-row justify-end">
        <PrimaryButton content="Edit User" type="submit" />
      </div>
    </form>
  ) : (
    <></>
  );
}
