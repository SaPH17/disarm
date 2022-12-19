import EditUserForm from '../../../components/page/user/edit-user-form';

export default function ManageUserEdit() {
  return (
    <>
      <div className="flex flex-row justify-between">
        <div className="text-xl font-semibold">Edit User</div>
      </div>
      <EditUserForm />
    </>
  );
}
