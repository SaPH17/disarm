import ShowChecklistData from "../../../components/page/checklist/show-checklist-data";


const ManageChecklistShow = () => {
  return (
    <>
      <div className="flex flex-row justify-between">
        <div className="text-xl font-semibold">Checklist Detail</div>
      </div>
      <ShowChecklistData />
    </>
  );
};

export default ManageChecklistShow;
