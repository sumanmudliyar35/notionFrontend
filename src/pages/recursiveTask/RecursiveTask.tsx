import React, { useEffect, useMemo, useState } from 'react'
import { useGetRecursiveTaskByUser } from '../../api/get/getRecursiveTaskByUser'
import { useParams } from 'react-router-dom'
import { CustomTable } from '../../components/customTable/CustomTable'
import dayjs from 'dayjs';
import RecursiveTaskModal from './components/RecursiveTaskModal/RecursiveTaskModal';
import { useCreateRecursiveTask } from '../../api/post/newRecursiveTask';
import { useUpdateRecursiveTaskLog } from '../../api/put/updateRecursiveTaskLogs';
import { useUpdateBulkRecursiveTask } from '../../api/put/updateBulkRecursiveTask';

const RecursiveTask = () => {
  const { userid } = useParams()
  const { data: recursiveTasks = [], isLoading, refetch: refetchRecursiveTasks } = useGetRecursiveTaskByUser(userid || '');
  const [tasks, setTasks] = useState<any[]>([]);

  const [openRecursiveTaskModal, setOpenRecursiveTaskModal] = useState(false);

  // Sync tasks state with fetched data
  useEffect(() => {
    setTasks(recursiveTasks);
  }, [recursiveTasks]);

  // Compute all unique dates from recursiveTaskLogs
  const allDates = useMemo(() => {
    const now = dayjs();
    const daysInMonth = now.daysInMonth();
    const today = now.format('YYYY-MM-DD');
    const dates = Array.from({ length: daysInMonth }, (_, i) =>
      now.date(i + 1).format('YYYY-MM-DD')
    );
    // Move today to the front
    // const rest = dates.filter(date => date !== today);
    return [...dates];
  }, [])


  const useCreateRecursiveTaskMutate = useCreateRecursiveTask();


  const handleCreateRecursiveTask = async (data: { name: string; startDate: string, endDate: string, interval: number }) => {
    try {
      await useCreateRecursiveTaskMutate.mutateAsync([{
        title: data.name,
        startDate: data.startDate,
        endDate: data.endDate,
        intervalDays: data.interval,
        assignedTo: userid,
      }, userid]);
      setOpenRecursiveTaskModal(false);
      refetchRecursiveTasks();
    } catch (error) {
      console.error('Error creating recursive task:', error);
    }
  };



  const updateRecursiveTaskMutate = useUpdateBulkRecursiveTask();

  const handleDeleteRecursiveTask = async (allTask: any) => {
  const now = new Date();



  // Add deletedAt to each task
  const taskWithDeletedAt = allTask.map((task: any) => ({
    id: task?.original?.id,
    data: { deletedAt: new Date() },
  }));

  try {
    await updateRecursiveTaskMutate.mutateAsync([taskWithDeletedAt, userid]);
    setTasks(prev => prev.filter(task => !allTask.some((t: any) => t.original.id === task.id)));
  } catch (error) {
    console.error('Error deleting recursive tasks:', error);
  }


 
};

  const updateRecursiveTaskLogsMutate = useUpdateRecursiveTaskLog();

  const handleCheck = (checked: boolean, log: any, date: string, taskId: any) => {
    const body = {
      status: checked ? 'completed' : 'pending',
    };

    updateRecursiveTaskLogsMutate.mutateAsync([body, date, taskId], {
      onSuccess: () => {
        setTasks(prev =>
          prev.map(task =>
            task.id === taskId
              ? {
                  ...task,
                  recursiveTaskLogs: task.recursiveTaskLogs.map((l: any) =>
                    l.date === date ? { ...l, status: body.status } : l
                  ),
                }
              : task
          )
        );
        // Optionally, you can also call refetch() to sync with backend
      },
    });
  };

        const handleComment = () => {
          // TODO: open comment modal for this log/date
          // console.log('Comment clicked', log, date, row.original);
        };
        const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
          // TODO: handle file upload for this log/date
          if (e.target.files && e.target.files[0]) {
            // console.log('File selected:', e.target.files[0], log, date, row.original);
          }
        };

  const columns = [
    {
      header: 'Name',
      accessorKey: '',
      cell: ({ row }: { row: any }) => <span>{row.original.title}</span>,
    },
    ...allDates.map(date => ({
      header: date,
      accessorKey: date,
      cell: ({ row }: { row: any }) => {
        const log = (row.original.recursiveTaskLogs || []).find((l: any) => l.date === date);
        if (!log) return null; // No controls if no log for this date

        const checked = log.status === 'completed';

      

        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <input
              type="checkbox"
              checked={checked}
        onChange={e => handleCheck(e.target.checked, log, date, row.original.id)}
              title="Mark as done"
            />
            <button type="button" onClick={handleComment} title="Add comment" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
              📝
            </button>
            <label style={{ margin: 0, cursor: 'pointer' }} title="Upload file">
              📎
              <input
                type="file"
                style={{ display: 'none' }}
                onChange={handleUpload}
              />
            </label>
          </div>
        );
      },
    })),
  ]

  if (isLoading) return <div>Loading...</div>

  console.log('Recursive Tasks:', openRecursiveTaskModal);

  return (
    <div>
      

      <CustomTable
        data={tasks}
        columns={columns}
        onDataChange={() => {}}
        isDownloadable={false}
        createEmptyRow={() => {
          setOpenRecursiveTaskModal(true);
          return {};
        }}
        isWithNewRow={true}
        onSelectionChange={handleDeleteRecursiveTask}
      />

{openRecursiveTaskModal && (
      
      <RecursiveTaskModal
        open={openRecursiveTaskModal}
        onClose={() => setOpenRecursiveTaskModal(false)}
        title="Add Recursive Task"
        onSave={(data) => {
          handleCreateRecursiveTask(data);
          setOpenRecursiveTaskModal(false);
        }}
      />

)}

    </div>
  )
}

export default RecursiveTask