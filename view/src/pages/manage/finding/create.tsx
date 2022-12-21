import CreateFindingForm from '../../../components/page/finding/create-finding-form';

export default function ManageFindingCreate() {
  return (
    <>
      <div className="flex flex-row justify-between">
        <div className="text-xl font-semibold">Create Finding</div>
      </div>
      <CreateFindingForm />
    </>
  );
}
