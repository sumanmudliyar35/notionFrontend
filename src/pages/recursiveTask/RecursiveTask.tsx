import React, { useEffect, useMemo, useState } from 'react'
import { useGetRecursiveTaskByUser } from '../../api/get/getRecursiveTaskByUser'
import { useParams } from 'react-router-dom'
import { CustomTable } from '../../components/customTable/CustomTable'
import dayjs from 'dayjs';
import RecursiveTaskModal from './components/RecursiveTaskModal/RecursiveTaskModal';
import { useCreateRecursiveTask } from '../../api/post/newRecursiveTask';
import { useUpdateRecursiveTaskLog } from '../../api/put/updateRecursiveTaskLogs';
import { useUpdateBulkRecursiveTask } from '../../api/put/updateBulkRecursiveTask';
import { useCreateAttachment } from '../../api/post/newAttachment';
import SharedCommentModal from '../../components/SharedCommentModal/SharedCommentModal';
import { useGetAllUsers } from '../../api/get/getAllMember';
import { useCreateComment } from '../../api/post/newComment';
import CommentCell from './components/CommentCell/CommentCell';
import { useUpdateComment } from '../../api/put/updateComment';
import { useDeleteComment } from '../../api/delete/deleteComment';

const RecursiveTask = () => {
  const { userid } = useParams()
  const { data: recursiveTasks = [], isLoading, refetch: refetchRecursiveTasks } = useGetRecursiveTaskByUser(userid || '');
  const [tasks, setTasks] = useState<any[]>([]);

      const {data: allMembersData} = useGetAllUsers();
          const [editingComment, setEditingComment] = useState<{ rowId: any; commentId: any } | null>(null);
  
  const [openRecursiveTaskModal, setOpenRecursiveTaskModal] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<any>(null);
              const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  
                const [assigneeOptions, setAssigneeOptions] = useState<{ label: string; value: any }[]>([]);
              

                 useEffect(() => {
                    if (allMembersData) {
                      setAssigneeOptions(
                        allMembersData
                          .filter((u: any) => u.name && u.userId)
                          .map((u: any) => ({
                            label: u.name,
                            value: u.userId,
                          }))
                      );
                    }
                  }, [allMembersData]);

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
  }, []);


   const openCommentModal = (recursiveTaskLog: any) => {
    console.log("Opening comment modal for task ID:", recursiveTaskLog.id);
          setSelectedTaskId(recursiveTaskLog.id)
          setIsCommentModalOpen(true);
  };


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


  const commentMutate = useCreateComment();
  const handleComment= async(data: any) => {
  
    const body = {
      comment: data.comment,
      mentionedMembers: data.mentionedMembers || [],
      recursiveTaskLogId: selectedTaskId,
      givenBy: userid,
    }
  
    const response = await commentMutate.mutateAsync([body, userid]);
    refetchRecursiveTasks();
    // const commentsResponse = await postGetComment.mutateAsync([selectedTaskId]);
    // setTableData(prev =>
    //   prev.map(row =>
    //     row.id === selectedTaskId ? { ...row, comments: commentsResponse } : row
    //   )
    // );
  
    // refetchTasksData();
  };



    const useUpdateCommentMutate = useUpdateComment();
  
    const handleEditComment = async(rowId: any, commentId: any, commentText: string, mentionedMember: any) => {

    console.log("Editing comment:", rowId, commentId, commentText, mentionedMember);
    // setEditingComment({ rowId, commentId });
    const body={
      comment: commentText,
      mentionedMember: mentionedMember,
    }
    const response = await useUpdateCommentMutate.mutateAsync([body, commentId, userid]);
    // refetchLeadsData();
    // const commentsResponse = await usePostGetComment.mutateAsync([rowId]);
    // setTableData(prev =>
    //   prev.map(row =>
    //     row.id === rowId ? { ...row, comments: commentsResponse } : row
    //   )
    // );
    // setEditingComment(null);


  
  };


    const useDeleteCommentMutate = useDeleteComment();
  
  const handleDeleteComment = async (rowId: any, commentId: any) => {
  const body={
    deletedAt: new Date()
  }
  console.log("commentid", commentId)
  const reponse = await useDeleteCommentMutate.mutateAsync([body,commentId]);
  refetchRecursiveTasks();
//  const commentsResponse = await usePostGetComment.mutateAsync([rowId]);
//       setTableData(prev =>
//         prev.map(row =>
//           row.id === rowId ? { ...row, comments: commentsResponse } : row
//         )
//       );



}
  


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

    console.log('Checkbox changed:', checked, log, date, taskId);


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

       
        const createAttachmentMutation = useCreateAttachment();
  

  
  // First, create a ref for the file input
const fileInputRef = React.useRef<HTMLInputElement>(null);

// Update your column definition with this improved approach
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
        if (!log) return null;

        const checked = log.status === 'completed';
        const attachments = log.files || [];
        const comments = log.comments || [];
        const rowId= log.id;

        // Create a unique ID for each file input
        const fileInputId = `file-upload-${row.original.id}-${date}`;
        
        // Custom file upload handler
        const triggerFileUpload = (e: React.MouseEvent) => {
          e.preventDefault();
          e.stopPropagation();
          // Create a new file input element dynamically
          const input = document.createElement('input');
          input.type = 'file';
          input.onchange = (e) => {
            const files = (e.target as HTMLInputElement).files;
            if (files && files.length > 0) {
              handleUpload(files[0], log, date, log.id);
            }
          };
          // Trigger click on the input
          input.click();
        };

        // Modified handleUpload to take file directly
        const handleUpload = async (file: File, log: any, date: string, taskId: any) => {
          
          try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("recursiveTaskLogId", taskId);
            formData.append("logId", log.id);
            formData.append("date", date);
            
            // Log the form data entries
            console.log("Form data entries:");
            for (let [key, value] of formData.entries()) {
              console.log(`${key}: ${value}`);
            }
            
            if (!userid) {
              throw new Error("User ID is undefined");
            }
            
            const response = await createAttachmentMutation.mutateAsync([formData, userid]);
            
            refetchRecursiveTasks();
            
          } catch (error) {
            console.error("Error uploading file:", error);
            if (error instanceof Error) {
              console.error("Error message:", error.message);
            }
            alert("Failed to upload file. Please try again.");
          }
        };

        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <input
                type="checkbox"
                checked={checked}
                onChange={e => handleCheck(e.target.checked, log, date, row.original.id)}
                title="Mark as done"
              />
              {/* <button 
                type="button" 
                onClick={() => openCommentModal(log.id)} 
                title="Add comment" 
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                📝
              </button> */}
              {/* Replace label + input with a simple button */}
              <button
                type="button"
                onClick={triggerFileUpload}
                title="Upload file"
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                📎
              </button>
            </div>

             <CommentCell
                  comments={comments}
                  rowId={log.id}
                  openCommentModal={openCommentModal}
                  handleEditComment={handleEditComment}
                  handleDeleteComment={handleDeleteComment}
                  editingComment={editingComment}
                  setEditingComment={setEditingComment}
                  assigneeOptions={assigneeOptions}
                />


            
            {/* Display attachments if any */}
            {attachments && attachments.length > 0 &&  (
              <div style={{ marginTop: 4, fontSize: '0.8em' }}>
                {attachments.map((attachment: any, idx: number) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <a 
                      href={attachment?.downloadUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{ color: '#1677ff', textDecoration: 'underline' }}
                    >
                      {attachment?.fileName || `File ${idx + 1}`}
                    </a>
                  </div>
                ))}
              </div>
            )}
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


  {isCommentModalOpen && (
          <SharedCommentModal
        open={isCommentModalOpen}
        onClose={() => setIsCommentModalOpen(false)}
        title="Add Comments"
        Id={selectedTaskId || 0}
        refetch={() => {
          refetchRecursiveTasks();
        }}
        assigneeOptions={assigneeOptions}
        onSave={handleComment}
      />
        )}





    </div>
  )
}

export default RecursiveTask