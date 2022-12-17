import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { projects } from '../../../data/projects';
import { ProjectFormData } from '../../../models/forms/project-form-data';
import { GeneralData } from '../../../models/general-data';
import { Project } from '../../../models/project';
import { User } from '../../../models/user';
import ProjectServices from '../../../services/project-services';
import UserServices from '../../../services/user-services';
import InputText from '../../input-text/input-text';
import PrimaryButton from '../../primary-button';
import SelectBox from '../../select-box';
import UserCard from './user-card';

const items: GeneralData[] = [
  {
    id: '1',
    name: 'Standard A',
  },
  {
    id: '2',
    name: 'Standard B',
  },
  {
    id: '3',
    name: 'Standard C',
  },
];

export default function EditProjectForm() {
  const params = useParams();
  const { data: projectData } = useQuery(`project/${params.id}`, () =>
    ProjectServices.getOneProject(params.id)
  );
  const { data: usersData } = useQuery('users', UserServices.getUsers);

  const project = projectData || [];

  const users = usersData?.map((user: User) => ({
    id: user.id,
    name: user.username,
    email: user.email
  })) || null;

  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [availableUsers, setAvailableUsers] = useState<User[]>();

  const {
    register,
    reset,
    formState: { errors },
    handleSubmit,
  } = useForm<ProjectFormData>();

  useEffect(() => {
    if (!project) return;
    reset(project);
  }, [projectData]);

  useEffect(() => {
    if (!users) return;
    const x = users;
    setAvailableUsers(users);
  }, [usersData]);

  function getCurrentUser(item: any) {
    const tempSelectedUser = [...selectedUsers, item];
    resetAssignedUserState(tempSelectedUser);
  }

  function removeCurrentUser(user: any) {
    const tempSelectedUser = selectedUsers.filter(
      (selectedUser) => selectedUser.id !== user.id
    );
    resetAssignedUserState(tempSelectedUser);
  }

  function resetAssignedUserState(tempSelectedUser: User[]) {
    setSelectedUsers(tempSelectedUser);
    setAvailableUsers(
      users!.filter(
        (user: User) =>
          !tempSelectedUser.find((selectedUser) => selectedUser.id === user.id)
      )
    );
  }

  function handleCreateProjectButton(data: ProjectFormData) {
    console.log(data);
  }

  return project && users ? (
    <form
      className="space-y-8"
      onSubmit={handleSubmit(handleCreateProjectButton)}
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

        <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
          <InputText
            id="company"
            name="company"
            label="Company"
            type="text"
            errors={errors}
            register={register('company', {
              required: 'Company name is required.',
            })}
          />
        </div>

        <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
          <label
            htmlFor="country"
            className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
          >
            Standard
          </label>
          <div className="flex flex-col gap-2 mt-1 sm:mt-0 sm:col-span-2">
            <div className="block w-full max-w-lg border-gray-300 rounded-md shadow-sm sm:text-sm">
              <SelectBox items={items} defaultValue={'Select Standard'} />
            </div>
            <span className="text-gray-500 underline cursor-pointer hover:text-gray-700">
              Create a new standard
            </span>
          </div>
        </div>

        <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
          <label
            htmlFor="last_name"
            className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
          >
            Assigned User
          </label>
          <div className="flex flex-col gap-4 mt-1 sm:mt-0 sm:col-span-2">
            <div className="block w-full max-w-lg border-gray-300 rounded-md shadow-sm sm:text-sm">
              {
                availableUsers && <SelectBox
                  items={availableUsers as GeneralData[]}
                  defaultValue={'Select User'}
                onClickFunction={getCurrentUser}
                />
              }

            </div>
            <div className="flex flex-col w-full max-w-lg gap-2 border-gray-300 rounded-md sm:text-sm">
              {selectedUsers && selectedUsers.map((selectedUser, index) => (
                <UserCard
                  key={index}
                  user={selectedUser}
                  onClickFunction={removeCurrentUser}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-row justify-end">
        <PrimaryButton content="Edit Project" type="submit" />
      </div>
    </form>
  ) : (
    <></>
  );
}
