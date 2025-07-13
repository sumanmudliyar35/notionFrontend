import React, { useEffect, useMemo, useState, useCallback, useRef } from 'react'
import { useParams } from 'react-router-dom'
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

import { CalculatorOutlined, CommentOutlined, EyeInvisibleOutlined, EyeOutlined, UploadOutlined } from '@ant-design/icons';
import { Badge, Tabs } from 'antd';
import type { TabsProps } from 'antd';


import { Button, Checkbox, Input } from 'antd';
import { Header } from 'antd/es/layout/layout';
import { useGetRecursiveTaskByUser } from '../../../../api/get/getRecursiveTaskByUser';
import { useGetAllUsers } from '../../../../api/get/getAllMember';
import { useCreateRecursiveTask } from '../../../../api/post/newRecursiveTask';
import { useUpdateRecursiveTaskDate } from '../../../../api/put/updateRecursiveTaskDate';
import { usePostGetRecursiveTaskById } from '../../../../api/get/postGetRecursiveTaskById';
import { useGetCommentByRecursiveTaskLogId } from '../../../../api/get/postGetCommentByRecursiveTaskLogs';
import { useCreateComment } from '../../../../api/post/newComment';
import { useUpdateComment } from '../../../../api/put/updateComment';
import { useDeleteComment } from '../../../../api/delete/deleteComment';
import { useUpdateBulkRecursiveTask } from '../../../../api/put/updateBulkRecursiveTask';
import { useUpdateRecursiveTaskLog } from '../../../../api/put/updateRecursiveTaskLogs';
import { useUpdateRecursiveTask } from '../../../../api/put/updateRecursiveTask';
import { useCreateAttachment } from '../../../../api/post/newAttachment';
import { formatDisplayDate } from '../../../../utils/commonFunction';
import CommentCell from '../CommentCell/CommentCell';
import * as styled from './style';
import CustomSelect from '../../../../components/customSelect/CustomSelect';
import DateInput from '../../../../components/CustomDateInput/CustomDateInput';
import { CustomTable } from '../../../../components/customTable/CustomTable';
import RecursiveTaskModal from '../RecursiveTaskModal/RecursiveTaskModal';
import SharedCommentModal from '../../../../components/SharedCommentModal/SharedCommentModal';
import ChangeDateModal from '../ChangeDateModal/ChangeDateModal';


interface RecursiveTask {
    intervalDays: number;
    customFilters?: Record<string, string | string[]>;
    customActiveFilters?: string[];
    isCommentVisible?: boolean;
    customSearchText?: string;
    tableIndex?: number; // Optional index prop for the table

}

const RecursiveTaskTable = ({intervalDays, customFilters, customActiveFilters, isCommentVisible, customSearchText, tableIndex}: RecursiveTask) => {
  const { userid } = useParams();
    const loggedInUserId = Number(localStorage.getItem('userid'));

    console.log("Logged in user ID:", customActiveFilters, customFilters);






    const [columnSizing, setColumnSizing] = useState<{ [key: string]: number }>({});

  const [activeInterval, setActiveInterval] = useState<number>(intervalDays);

  const { data: recursiveTasks = [], isLoading, refetch: refetchRecursiveTasks } = useGetRecursiveTaskByUser(userid || '');
  const [tasks, setTasks] = useState<any[]>([]);

      const {data: allMembersData} = useGetAllUsers();
          const [editingComment, setEditingComment] = useState<{ rowId: any; commentId: any } | null>(null);
  
  const [openRecursiveTaskModal, setOpenRecursiveTaskModal] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<any>(null);
  const [selectedRecursiveTask, setSelectedRecursiveTask] = useState<any>(null);
  const [selectedRecursiveTaskLogDate, setSelectedRecursiveTaskLogDate] = useState<any>(null);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);

  const [commentsVisible, setCommentsVisible] = useState<boolean>(isCommentVisible || true);

  useEffect(() => {
    isCommentVisible? setCommentsVisible(isCommentVisible): setCommentsVisible(false);
  }, [isCommentVisible]);



  
          const toggleAllCommentsVisibility = useCallback(() => {
            setCommentsVisible(prev => !prev);
          }, []);

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
        intervalDays: activeInterval,
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
      givenBy: loggedInUserId,
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
      size: 250,
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
          </button>
        </div>
      ),
    },
    {
      header: "Interval",
      accessorKey: 'intervalDays',
      size: 80,
      cell: ({ row }: { row: any }) => {
        const interval = row.original.intervalDays;
        return (
          <span>
            {interval} {interval === 1 ? 'day' : 'days'}
          </span>
        );
      },
    },
    ...allDates.map(date => {
      // Check if the date is in the past
      const isPastDate = dayjs(date).isBefore(dayjs().startOf('day'));
      
      return {
        header: formatDisplayDate(date),
        accessorKey: date,
        size:115,
        cell: ({ row }: { row: any }) => {
          const log = (row.original.recursiveTaskLogs || []).find((l: any) => l.date === date);
          if (!log) return null;
          
          const checked = log.status === 'completed';
          const attachments = log.files || [];
          const comments = log.comments || [];
          
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
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Input
                type="checkbox"
  checked={checked}
  onChange={(e: any)=> !isPastDate && handleCheck(e.target.checked, log, date, row.original.id)}
  disabled={isPastDate}
  style={{
    accentColor: checked ? '#52c41a' : '#aaa',
    transform: 'scale(1.2)',
    cursor: isPastDate ? 'not-allowed' : 'pointer',
    height: 20,
    width: 20,
    transition: 'accent-color 0.2s'
  }}
/>
                
                <Button
                  onClick={openDateChangeModal}
                  disabled={isPastDate}
                  style={{ 
                    background: 'white', 
                    border: 'none', 
                    cursor: isPastDate ? 'not-allowed' : 'pointer',
                    fontSize: '14px',
                    opacity: isPastDate ? 0.5 : 1,
                    height: 24,
                    width: 24,
                  }}
                  icon={<CalculatorOutlined />}
                >
                  
                </Button>

                <Badge count={attachments.length} size="small" color="#1677ff">

                
                <Button
                  onClick={triggerFileUpload}
                  disabled={isPastDate}
                  style={{ 
                    background: 'white', 
                    border: 'none', 
                    cursor: isPastDate ? 'not-allowed' : 'pointer',
                    opacity: isPastDate ? 0.5 : 1,
                    height: 24,
                    width: 24,
                  }}
                  icon={<UploadOutlined />}
                >
                  </Button>

                  </Badge>


<Badge count={comments.length} size="small" color="#1677ff">

                      <Button
                  onClick={()=>openCommentModal(log)}
                  disabled={isPastDate}
                  style={{ 
                    background: 'white', 
                    border: 'none', 
                    cursor: isPastDate ? 'not-allowed' : 'pointer',
                    opacity: isPastDate ? 0.5 : 1,
                    height: 24,
                    width: 24,
                  }}
  icon={<CommentOutlined />}
                >
                  </Button>
                  </Badge>

              </div>
              
              {/* Only show comments if not hidden */}
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
                  visible={commentsVisible}
                  isCommentText={true}

                />
            
              
              {/* Attachments section */}
              {commentsVisible && ( 

            
              attachments && attachments.length > 0 && (
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
              )


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
    toggleCommentsVisibility, // And this one
    activeInterval
  ]);

  const dateOption =[
  { label: 'Before', value: 'before' },
          { label: 'After', value: 'after' },
          { label: 'On Date', value: 'on' },
          { label: 'In Between', value: 'between' },
]




    const [filters, setFilters] = useState<Record<string, string | string[]>>(customFilters || {});
      const [activeFilters, setActiveFilters] = useState<string[]>(customActiveFilters || []);

      useEffect(() => {
  if (customFilters) setFilters(customFilters);
  if (customActiveFilters) setActiveFilters(customActiveFilters);
}, [customFilters, customActiveFilters]);

         const availableFilterColumns = [
 
  {header: 'Date', accessorKey: 'taskDate'},
];


const handleFilterChange = (key: string, value: string) => {
  setFilters((prev) => ({
    ...prev,
    [key]: value,
  }));
};

  const handleAddFilter = (columnKey: any) => {
  console.log("Adding filter for column:", columnKey);
  setActiveFilters((prev) => [...prev, columnKey.value]);
};


 const handleColumnResize = (columnId: string, newSize: number) => {
    const body={
      width: newSize,

    }
    setColumnSizing((prev) => ({
      ...prev,
      [columnId]: newSize,
    }));

  };

const handleRemoveFilter = (key: string) => {



    const relatedKeys = {
   
      'createdAt': ['createdAt', 'createdAtType', 'createdAtStart', 'createdAtEnd'],
      'taskDate': ['taskDate', 'dateType', 'taskStartDate', 'taskEndDate'],
      'taskStartDate': ['taskStartDate', 'dateType', 'taskDate', 'taskEndDate'],
      'taskEndDate': ['taskEndDate', 'dateType', 'taskDate', 'taskStartDate'],
      'assignedTo': ['assignedTo'],

  };


    const keysToRemove = relatedKeys[key as keyof typeof relatedKeys] || [key];


  // Remove all related keys from filters
  setFilters((prev) => {
    const newFilters = { ...prev };
    keysToRemove.forEach(k => delete newFilters[k]);
    return newFilters;
  });

  setActiveFilters((prev: string[]) => prev.filter((k) => k !== key));
};

    const filteredTasks = useMemo(() => {
    return tasks.filter(task => task.intervalDays === activeInterval);
  }, [tasks, activeInterval]);



  const filteredColumns = useMemo(() => {
  // If no date filter, return all columns

  console.log("Current filters:", 1);

  if (!filters.dateType || !filters.taskDate) return columns;


  console.log("Filtering columns based on date filters:", filters);
  // Find all date columns (skip the first two: 'Name' and 'Interval')
  const dateColumns = columns.slice(2);

  // Parse filter values
  const filterDate = dayjs(Array.isArray(filters.taskDate) ? filters.taskDate[0] : filters.taskDate);
  const startDate = filters.taskStartDate
    ? dayjs(Array.isArray(filters.taskStartDate) ? filters.taskStartDate[0] : filters.taskStartDate)
    : null;
  const endDate = filters.taskEndDate
    ? dayjs(Array.isArray(filters.taskEndDate) ? filters.taskEndDate[0] : filters.taskEndDate)
    : null;

  let filteredDateColumns = dateColumns;

  if (filters.dateType === 'after') {
    filteredDateColumns = dateColumns.filter(col =>
      dayjs(col.accessorKey).isSameOrAfter(filterDate, 'day')
    );
  } else if (filters.dateType === 'before') {
    filteredDateColumns = dateColumns.filter(col =>
      dayjs(col.accessorKey).isSameOrBefore(filterDate, 'day')
    );
  } else if (filters.dateType === 'on') {
    filteredDateColumns = dateColumns.filter(col =>
      dayjs(col.accessorKey).isSame(filterDate, 'day')
    );
  } else if (filters.dateType === 'between' && startDate && endDate) {
    filteredDateColumns = dateColumns.filter(col =>
      dayjs(col.accessorKey).isSameOrAfter(startDate, 'day') &&
      dayjs(col.accessorKey).isSameOrBefore(endDate, 'day')
    );
  }

  // Always include the first two columns ('Name' and 'Interval')
  return [...columns.slice(0, 2), ...filteredDateColumns];
}, [columns, filters,customFilters, customActiveFilters]);



const columnsWithSizing = filteredColumns.map(col =>{ 
  
  return ( {
  ...col,
  width: columnSizing?.[col.accessorKey] || 120, // fallback to default
})});



console.log("Filtered columns:", columnsWithSizing.slice(0, 3));
console.log("Filtered tasks:", columnSizing?.['title']);






    // Tabs items
//   const tabItems: TabsProps['items'] = intervalOptions.map(opt => ({
//     key: String(opt.value),
//     label: opt.label,
//   }));

  if (isLoading) return <div>Loading...</div>




  



  return (
    <styled.recursiveTaskContainer>


      <styled.FiltersDiv>

      
  


  </styled.FiltersDiv>
      

      <CustomTable
          // data={tasks}
        data={filteredTasks}
        // columns={filteredColumns}
                columns={columnsWithSizing}

        
        onDataChange={() => {}  }
        isDownloadable={false}
        createEmptyRow={() => {
          setOpenRecursiveTaskModal(true);
          return {};
        }}
          onColumnSizingChange={(newSizing, columnId) => {
    console.log("Columnresized:", columnId, "New size:", newSizing[columnId]);
    setColumnSizing(newSizing);
    // You can also call any callback here with columnId and newSizing[columnId]
    handleColumnResize(columnId, newSizing[columnId]);
    
  }}
        onRowEdit={handleRowEdit}
        scrollToColumn={dayjs().format('YYYY-MM-DD')}
        
        isWithNewRow={true}
        onSelectionChange={handleDeleteRecursiveTask}
        isManageColumn={false}
        isSearchable={false}
        customSearchText={customSearchText || ''}
        isVerticalScrolling={false}
        tableIndex={tableIndex || 0}
        // highlightRowId={0}

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

    </styled.recursiveTaskContainer>
  )
}



export default RecursiveTaskTable

