import { useParams } from 'react-router-dom';
import Table from '../../../components/table';

const ManageGroupShow = () => {
  const params = useParams();

  return (
    <>
      <div className="text-xl font-semibold">Role {params.id}</div>
      <div className="flex flex-row gap-2 sm:gap-4 justify-between">
        {/* <SelectBox items={items} defaultValue={'-- Select Action --'} /> */}
      </div>
      <div className="flex flex-col gap-2 sm:gap-4 p-2 sm:p-4 bg-gray-100 rounded border-4 border-dashed">
        <div className="text-lg font-semibold">Groups</div>
        {/* <Table title={title} content={content} isClickable={true} /> */}
      </div>
    </>
  );
};

export default ManageGroupShow;
