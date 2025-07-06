import React, { useEffect, useMemo, useState, useCallback } from 'react'
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
import ChangeDateModal from './components/ChangeDateModal/ChangeDateModal';
import { useUpdateRecursiveTaskDate } from '../../api/put/updateRecursiveTaskDate';
import { usePostGetRecursiveTaskById } from '../../api/get/postGetRecursiveTaskById';
import { useUpdateRecursiveTask } from '../../api/put/updateRecursiveTask';
import { useGetCommentByRecursiveTaskLogId } from '../../api/get/postGetCommentByRecursiveTaskLogs';
import { formatDisplayDate } from '../../utils/commonFunction';
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';

const RecursiveTask = () => {
  const { userid } = useParams()
  const { data: recursiveTasks = [], isLoading, refetch: refetchRecursiveTasks } = useGetRecursiveTaskByUser(userid || '');
  const [tasks, setTasks] = useState<any[]>([]);

      const {data: allMembersData} = useGetAllUsers();
          const [editingComment, setEditingComment] = useState<{ rowId: any; commentId: any } | null>(null);
  
  const [openRecursiveTaskModal, setOpenRecursiveTaskModal] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<any>(null);
  const [selectedRecursiveTask, setSelectedRecursiveTask] = useState<any>(null);
  const [selectedRecursiveTaskLogDate, setSelectedRecursiveTaskLogDate] = useState<any>(null);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);

              const [openChangeDateModal, setOpenChangeDateModal] = useState(false);
  
                const [assigneeOptions, setAssigneeOptions] = useState<{ label: string; value: any }[]>([]);
              

                 const memoizedAssigneeOptions = useMemo(() => {
                    if (!allMembersData) return [];
    
                    return allMembersData
                      .filter((u: any) => u.name && u.userId)
                      .map((u: any) => ({
                        label: u.name,
                        value: u.userId,
                      }));
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

  // State to track which rows have hidden comments
const [hiddenCommentRows, setHiddenCommentRows] = useState<{ [key: string]: boolean }>({});

const toggleCommentsVisibility = (
  e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  id: any
): void => {
  e.preventDefault();
  e.stopPropagation();
  setHiddenCommentRows(prev => ({
    ...prev,
    [id]: !prev[id],
  }));
}


   const openCommentModal = (recursiveTaskLog: any) => {
    console.log("Opening comment modal for task ID:", recursiveTaskLog.id);
          setSelectedTaskId(recursiveTaskLog.id)
          setIsCommentModalOpen(true);
  };


  const useCreateRecursiveTaskMutate = useCreateRecursiveTask();


  const handleCreateRecursiveTask = useCallback(async (data: { 
    name: string; 
    startDate: string, 
    endDate: string, 
    interval: number 
  }) => {
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
  }, [useCreateRecursiveTaskMutate, userid, refetchRecursiveTasks]);
  

  const UpdateRecursiveTaskDateMutate = useUpdateRecursiveTaskDate();

  const postGetRecursiveTask = usePostGetRecursiveTaskById();

  const handleRecursiveTaskDateChange = useCallback(async (
    originalDate: string, 
    newDate: string, 
    taskId: string
  ) => {
    try {
      console.log('Changing date for task:', taskId, 'from', originalDate, 'to', newDate);
      const body = {
        currentDate: originalDate,
        newDate: newDate,
      };
      const response = await UpdateRecursiveTaskDateMutate.mutateAsync([body, taskId]);

      const taskData = await postGetRecursiveTask.mutateAsync([taskId]);
      setTasks(prev => prev.map(task => 
        task.id === taskId ? { ...task, ...taskData } : task
      ));
      console.log('Date change response:', response);
    } catch (error) {
      console.error('Error updating recursive task date:', error);
    }
  }, [UpdateRecursiveTaskDateMutate, postGetRecursiveTask]);
  

  const postGetComment = useGetCommentByRecursiveTaskLogId();

  const commentMutate = useCreateComment();
  const handleComment= useCallback(async(data: any) => {
    console.log("Adding comment:", data, "for task ID:", selectedTaskId);
    const body = {
      comment: data.comment,
      mentionedMembers: data.mentionedMembers || [],
      recursiveTaskLogId: selectedTaskId,
      givenBy: userid,
    }

    const response = await commentMutate.mutateAsync([body, userid]);
    const commentResponse = await postGetComment.mutateAsync([selectedTaskId]);
    
    setTasks(prev =>
      prev.map(task => {
        return task.id === commentResponse?.[0]?.recursiveTaskId 
          ? { 
              ...task, 
              recursiveTaskLogs: task.recursiveTaskLogs.map((log: any) => 
                log.id === selectedTaskId 
                  ? { ...log, comments: commentResponse } 
                  : log
              ) 
            } 
          : task;
      })
    );
  }, [commentMutate, postGetComment, selectedTaskId, userid]);
  

  const useUpdateCommentMutate = useUpdateComment();
  
  const handleEditComment = useCallback(async(
    rowId: any, 
    commentId: any, 
    commentText: string, 
    mentionedMember: any
  ) => {
    console.log("Editing comment:", rowId, commentId, commentText, mentionedMember);
    const body = {
      comment: commentText,
      mentionedMember: mentionedMember,
    }
    const response = await useUpdateCommentMutate.mutateAsync([body, commentId, userid]);
    const commentResponse = await postGetComment.mutateAsync([rowId]);
    
    setTasks(prev =>
      prev.map(task => {
        return task.id === commentResponse?.[0]?.recursiveTaskId 
          ? { 
              ...task, 
              recursiveTaskLogs: task.recursiveTaskLogs.map((log: any) => 
                log.id === selectedTaskId 
                  ? { ...log, comments: commentResponse } 
                  : log
              ) 
            } 
          : task;
      })
    );
    setEditingComment(null);
  }, [useUpdateCommentMutate, postGetComment, selectedTaskId, userid]);
  

  const useDeleteCommentMutate = useDeleteComment();
  
  const handleDeleteComment = useCallback(async (rowId: any, commentId: any) => {
    const body = {
      deletedAt: new Date()
    }
    console.log("commentid", commentId)
    const response = await useDeleteCommentMutate.mutateAsync([body, commentId]);
    const commentResponse = await postGetComment.mutateAsync([rowId]);
    
    setTasks(prev =>
      prev.map(task => {
        return task.id === commentResponse?.[0]?.recursiveTaskId 
          ? { 
              ...task, 
              recursiveTaskLogs: task.recursiveTaskLogs.map((log: any) => 
                log.id === selectedTaskId 
                  ? { ...log, comments: commentResponse } 
                  : log
              ) 
            } 
          : task;
      })
    );
  }, [useDeleteCommentMutate, postGetComment, selectedTaskId]);
  

  const updateBulkRecursiveTaskMutate = useUpdateBulkRecursiveTask();

  const handleDeleteRecursiveTask = useCallback(async (allTask: any) => {
    const taskWithDeletedAt = allTask.map((task: any) => ({
      id: task?.original?.id,
      data: { deletedAt: new Date() },
    }));

    try {
      await updateBulkRecursiveTaskMutate.mutateAsync([taskWithDeletedAt, userid]);
      setTasks(prev => prev.filter(task => 
        !allTask.some((t: any) => t.original.id === task.id)
      ));
    } catch (error) {
      console.error('Error deleting recursive tasks:', error);
    }
  }, [updateBulkRecursiveTaskMutate, userid]);
  

  const updateRecursiveTaskLogsMutate = useUpdateRecursiveTaskLog();

  const handleCheck = useCallback((checked: boolean, log: any, date: string, taskId: any) => {
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
      },
    });
  }, [updateRecursiveTaskLogsMutate]);
  

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const updateRecursiveTaskMutate = useUpdateRecursiveTask();

  const handleRowEdit = useCallback((row: any) => {
    console.log('Editing row:', row);
    const body = {
      title: row.title,
    }
    updateRecursiveTaskMutate.mutateAsync([body, row.id]);


    setTasks(prev =>
      prev.map(task => (task.id === row.id ? { ...task, title: row.title } : task))
    );  
  }, [updateRecursiveTaskMutate]);

  const createAttachmentMutation = useCreateAttachment();
  

  const columns = useMemo(() => [
    {
      header: 'Name',
      accessorKey: 'title',
      meta: {
        editable: true,
      },
      cell: ({ row }: { row: any }) => (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>{row.original.title}</span>
          <button
            type="button"
            onClick={(e) => toggleCommentsVisibility(e, row.original.id)}
            title={hiddenCommentRows[row.original.id] ? "Show comments" : "Hide comments"}
            style={{ 
              background: 'none', 
              border: 'none', 
              cursor: 'pointer',
              fontSize: '14px',
              padding: '2px 6px',
              marginLeft: '8px',
              color: '#1677ff'
            }}
          >
            {hiddenCommentRows[row.original.id] ? <EyeOutlined /> : <EyeInvisibleOutlined />}
          </button>
        </div>
      ),
    },
    ...allDates.map(date => {
      // Check if the date is in the past
      const isPastDate = dayjs(date).isBefore(dayjs().startOf('day'));
      
      return {
        header: formatDisplayDate(date),
        accessorKey: date,
        cell: ({ row }: { row: any }) => {
          const log = (row.original.recursiveTaskLogs || []).find((l: any) => l.date === date);
          if (!log) return null;
          
          const checked = log.status === 'completed';
          const attachments = log.files || [];
          const comments = log.comments || [];
          const areCommentsHidden = hiddenCommentRows[row.original.id];
          
          // Create handlers inside the cell renderer, but they use the memoized parent handlers
          const triggerFileUpload = (e: React.MouseEvent) => {
            if (isPastDate) return;
            
            e.preventDefault();
            e.stopPropagation();
            const input = document.createElement('input');
            input.type = 'file';
            input.onchange = (e) => {
              const files = (e.target as HTMLInputElement).files;
              if (files && files.length > 0) {
                handleUpload(files[0], log, date, log.id);
              }
            };
            input.click();
          };
          
          const openDateChangeModal = (e: React.MouseEvent) => {
            if (isPastDate) return;
            
            e.preventDefault();
            e.stopPropagation();
            setSelectedRecursiveTask(row.original.id);
            setSelectedRecursiveTaskLogDate(date);
            setOpenChangeDateModal(true);
          };
          
          // Modified handleUpload to take file directly
          const handleUpload = async (file: File, log: any, date: string, taskId: any) => {
            try {
              const formData = new FormData();
              formData.append("file", file);
              formData.append("recursiveTaskLogId", taskId);
              formData.append("logId", log.id);
              formData.append("date", date);
              
              if (!userid) {
                throw new Error("User ID is undefined");
              }
              
              await createAttachmentMutation.mutateAsync([formData, userid]);
              refetchRecursiveTasks();
            } catch (error) {
              console.error("Error uploading file:", error);
              alert("Failed to upload file. Please try again.");
            }
          };
          
          return (
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: 4,
              opacity: isPastDate ? 0.7 : 1 
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={e => !isPastDate && handleCheck(e.target.checked, log, date, row.original.id)}
                  disabled={isPastDate}
                   style={{
    accentColor: checked ? '#52c41a' : undefined,
    transform: 'scale(1.2)',
    cursor: isPastDate ? 'not-allowed' : 'pointer'
  }}
                  
                />
                
                <button
                  type="button"
                  onClick={openDateChangeModal}
                  disabled={isPastDate}
                  style={{ 
                    background: 'none', 
                    border: 'none', 
                    cursor: isPastDate ? 'not-allowed' : 'pointer',
                    fontSize: '14px',
                    opacity: isPastDate ? 0.5 : 1
                  }}
                >
                  📅
                </button>
                
                <button
                  type="button"
                  onClick={triggerFileUpload}
                  disabled={isPastDate}
                  style={{ 
                    background: 'none', 
                    border: 'none', 
                    cursor: isPastDate ? 'not-allowed' : 'pointer',
                    opacity: isPastDate ? 0.5 : 1
                  }}
                >
                  📎
                </button>
              </div>
              
              {/* Only show comments if not hidden */}
              {!areCommentsHidden && (
                <CommentCell
                  comments={comments}
                  rowId={log.id}
                  openCommentModal={isPastDate ? () => {} : openCommentModal}
                  handleEditComment={handleEditComment}
                  handleDeleteComment={handleDeleteComment}
                  editingComment={editingComment}
                  setEditingComment={setEditingComment}
                  assigneeOptions={assigneeOptions}
                  disabled={isPastDate}
                />
              )}
              
              {/* Attachments section */}
              {attachments && attachments.length > 0 && (
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
      };
    }),
  ], [
    allDates, 
    handleCheck, 
    handleEditComment, 
    handleDeleteComment, 
    assigneeOptions, 
    editingComment, 
    createAttachmentMutation, 
    userid, 
    refetchRecursiveTasks,
    hiddenCommentRows, // Add this dependency
    toggleCommentsVisibility // And this one
  ]);

  if (isLoading) return <div>Loading...</div>


  return (
    <div>
      

      <CustomTable
        data={tasks}
        columns={columns}
        onDataChange={() => {}  }
        isDownloadable={false}
        createEmptyRow={() => {
          setOpenRecursiveTaskModal(true);
          return {};
        }}
        onRowEdit={handleRowEdit}
        
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
       
        assigneeOptions={assigneeOptions}
        onSave={handleComment}
      />
        )}

        {openChangeDateModal && (
          <ChangeDateModal
            open={openChangeDateModal}
            onClose={() => setOpenChangeDateModal(false)}
            title="Change Date"
            initialDate={selectedRecursiveTaskLogDate}
            onSave={handleRecursiveTaskDateChange}
            taskId={selectedRecursiveTask}
          />
        )}

    </div>
  )
}



export default RecursiveTask

