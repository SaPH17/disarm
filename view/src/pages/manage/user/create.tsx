import CreateUserForm from "../../../components/page/user/create-user-form";
import PrimaryButton from "../../../components/primary-button";

export default function ManageUserCreate() {
  return (
    <>
      <div className="flex flex-row justify-between">
        <div className="text-xl font-semibold">Create User</div>
        <PrimaryButton content="Create User" />
      </div>
      <CreateUserForm />
    </>
  );
}
