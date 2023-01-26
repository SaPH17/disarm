import { useState } from 'react';
import { useQuery } from 'react-query';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ActionButton, {
  ActionButtonItem,
} from '../../../components/action-button';
import DeletePopup from '../../../components/popup/delete-popup';
import PrimaryButton from '../../../components/primary-button';
import SelectedDetail from '../../../components/selected-detail';
import TableCheckbox from '../../../components/table-checkbox';
import { defaultChecklist } from '../../../data/default-values';
import { DeleteChecklistsHandler } from '../../../handlers/checklist/delete-checklist-handler';
import { Checklist } from '../../../models/checklist';
import ChecklistServices from '../../../services/checklist-services';
import { toReadableDateTime } from '../../../utils/functions/dates';

const title = ['name', 'lastModified', 'createdBy', 'status'];

const contentTitle = [
  'id',
  'name',
  'status',
  'createdBy',
  'createdAt',
  'lastModified',
];

export default function ManageChecklistIndex() {
  const navigate = useNavigate();
  const [openDeletePopup, setOpenDeletePopup] = useState(false);
  const { data: checklistsData, refetch } = useQuery(
    'checklists',
    ChecklistServices.getChecklists
  );

  const checklists =
    checklistsData?.map((checklist: Checklist) => ({
      ...checklist,
      lastModified: toReadableDateTime(new Date(checklist.updated_at)),
      createdBy: checklist.User?.username || '-',
      createdAt: toReadableDateTime(new Date(checklist.created_at)),
    })) || null;
  const [activeChecklist, setActiveChecklist] =
    useState<Checklist>(defaultChecklist);
  const [selectedChecklist, setSelectedChecklist] = useState<Checklist[]>([]);

  const items: ActionButtonItem[] = [
    {
      id: '1',
      name: 'Delete Checklist',
      onClickFunction: () => {
        if (!selectedChecklist) return;
        if (
          !selectedChecklist.filter(
            (checklist: Checklist) => checklist.id !== -1
          ).length
        )
          return;
        setOpenDeletePopup(true);
      },
    },
  ];

  async function deleteChecklists() {
    if (!selectedChecklist) return;
    const ids = selectedChecklist.map((checklist: Checklist) => checklist.id);
    try {
      ids.forEach(async (id, index) => {
        await toast.promise(DeleteChecklistsHandler.handleDeleteChecklistSubmit(id), {
          success: `Successfully deleted ${selectedChecklist[index].name} checklist!`,
          pending: `deleting ${ids.length} checklist(s)!`,
          error: {
            render({ data }: any) {
              return data.message;
            },
          },
        });
      })
      
      refetch();
      setSelectedChecklist([]);
    } catch (e) {}
  }

  return checklists ? (
    <>
      <div className="text-xl font-semibold">Manage Checklist</div>
      <div className="flex flex-row justify-between gap-2 sm:gap-4">
        <Link to={'create'}>
          <PrimaryButton content="Create Checklist" />
        </Link>
        <ActionButton items={items} />
      </div>
      <div className="flex flex-col gap-1 sm:gap-2">
        <div className="text-lg font-semibold">Checklists</div>
        {checklists && (
          <TableCheckbox
            title={title}
            content={checklists as object[]}
            selectedData={selectedChecklist}
            setSelectedData={setSelectedChecklist}
            onRowClickFunction={(checklist: any) => {
              setActiveChecklist(checklist);
            }}
            onClickFunction={(checklist: any) => {
              navigate(`/checklists/${checklist.id}`);
            }}
          />
        )}
      </div>

      <SelectedDetail
        title={'Checklist Detail'}
        contentTitle={contentTitle}
        content={activeChecklist}
      >
        <div className="flex items-center gap-4">
          <Link
            to={`/checklists/${activeChecklist.id}`}
            className={'underline'}
          >
            View Detail
          </Link>
          <Link to={`/checklists/${activeChecklist.id}/edit`}>
            <PrimaryButton content="Edit" />
          </Link>
        </div>
      </SelectedDetail>
      {selectedChecklist && (
        <DeletePopup
          title="Delete Checklists"
          selectedData={selectedChecklist}
          onClickFunction={deleteChecklists}
          open={openDeletePopup}
          setOpen={setOpenDeletePopup}
        />
      )}
    </>
  ) : (
    <></>
  );
}
