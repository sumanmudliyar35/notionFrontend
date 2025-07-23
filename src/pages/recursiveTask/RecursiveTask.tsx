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

import * as styled from './style';
import { useGetRecursiveTaskByUser } from '../../api/get/getRecursiveTaskByUser';
import { useGetAllUsers } from '../../api/get/getAllMember';
import { useCreateRecursiveTask } from '../../api/post/newRecursiveTask';
import { useUpdateRecursiveTaskDate } from '../../api/put/updateRecursiveTaskDate';
import { usePostGetRecursiveTaskById } from '../../api/get/postGetRecursiveTaskById';
import { useUpdateComment } from '../../api/put/updateComment';
import { useDeleteComment } from '../../api/delete/deleteComment';
import { useUpdateBulkRecursiveTask } from '../../api/put/updateBulkRecursiveTask';
import { useUpdateRecursiveTaskLog } from '../../api/put/updateRecursiveTaskLogs';
import { useUpdateRecursiveTask } from '../../api/put/updateRecursiveTask';
import { useCreateAttachment } from '../../api/post/newAttachment';
import { DateWithThreeMonthletters, formatDisplayDate } from '../../utils/commonFunction';
import CommentCell from './components/CommentCell/CommentCell';
import { CustomTable } from '../../components/customTable/CustomTable';
import RecursiveTaskModal from './components/RecursiveTaskModal/RecursiveTaskModal';
import SharedCommentModal from '../../components/SharedCommentModal/SharedCommentModal';
import ChangeDateModal from './components/ChangeDateModal/ChangeDateModal';
import { useGetCommentByRecursiveTaskLogId } from '../../api/get/postGetCommentByRecursiveTaskLogs';
import { useCreateComment } from '../../api/post/newComment';
import DateInput from '../../components/CustomDateInput/CustomDateInput';
import CustomSelect from '../../components/customSelect/CustomSelect';
import { useCreateMultipleAttachments } from '../../api/post/newMultipleAttachments';
import { usepostGetRecursiveTaskLogsAttachmentByTask } from '../../api/get/postGetAttachmentByRecursiveTaskLog';
import RecursiveTaskLogCell from './components/RecursiveTaskLogCell/RecursiveTaskLogCell';
import { TaskCustomTable } from '../tasks/components/TaskCustomTable/TaskCustomTable';
import CustomEditableCell from '../../components/CustomEditableCell/CustomEditableCell';
import { useUpdateUsersTablePreference } from '../../api/put/updateUsersTablePreference';
import { useGetRecursiveTaskTablePreference } from '../../api/get/getRecursiveTaskTablePreference';
import imageCompression from 'browser-image-compression';



interface RecursiveTask {
    intervalDays?: number;
    customFilters?: Record<string, string | string[]>;
    customActiveFilters?: string[];
    isCommentVisible?: boolean;
    customSearchText?: string;
    tableIndex?: number; // Optional index prop for the table

}

const RecursiveTaskTable = ({intervalDays, customFilters, customActiveFilters, isCommentVisible, customSearchText, tableIndex}: RecursiveTask) => {
  const { userid } = useParams();
    const loggedInUserId = Number(localStorage.getItem('userid'));







    const [columnSizing, setColumnSizing] = useState<{ [key: string]: number }>({});

  const [activeInterval, setActiveInterval] = useState<number>(intervalDays || 0);

  const currentMonth = dayjs().month() + 1; // 1 = January, 12 = December
  const currentYear = dayjs().year();
  const currentDate = dayjs().date() - 2;

  console.log("Current Date:", currentDate, "Current Month:", currentMonth, "Current Year:", currentYear);  


  const { data: recursiveTasks = [], isLoading, refetch: refetchRecursiveTasks } = useGetRecursiveTaskByUser(userid || '', currentDate, currentMonth, currentYear);



  const {data: recursiveTaskTablePreference} = useGetRecursiveTaskTablePreference(userid || '');



   const columnWidthMap = useMemo(() => {
    if (!recursiveTaskTablePreference) return {};
    return recursiveTaskTablePreference.reduce((acc: any, pref: any) => {
      acc[pref.accessorKey] = pref.width;
      acc[pref.orderId] = pref.orderId;
      return acc;
    }, {});
  }, [recursiveTaskTablePreference]);




 

  
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
  // const allDates = useMemo(() => {
  //   const now = dayjs();
  //   const daysInMonth = now.daysInMonth();
  //   const today = now.format('YYYY-MM-DD');
  //   const dates = Array.from({ length: daysInMonth }, (_, i) =>
  //     now.date(i + 1).format('YYYY-MM-DD')
  //   );
  //   // Move today to the front
  //   // const rest = dates.filter(date => date !== today);
  //   return [...dates];
  // }, []);
const allDates = useMemo(() => {
  const now = dayjs();
  const daysInMonth = now.daysInMonth();
  // Start from today - 2
  const startDay = Math.max(1, now.date() - 2);
  const dates = Array.from({ length: daysInMonth - startDay + 1 }, (_, i) =>
    now.date(startDay + i).format('YYYY-MM-DD')
  );
  return dates;
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
      const body = {
        currentDate: originalDate,
        newDate: newDate,
      };
      const response = await UpdateRecursiveTaskDateMutate.mutateAsync([body, taskId, userid]);

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
                log.id === commentResponse?.[0]?.recursiveTaskLogId 
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
    const response = await useDeleteCommentMutate.mutateAsync([body, commentId, loggedInUserId]);
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

    updateRecursiveTaskLogsMutate.mutateAsync([body, date, taskId, userid], {
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
    updateRecursiveTaskMutate.mutateAsync([body, row.id, userid]);


    setTasks(prev =>
      prev.map(task => (task.id === row.id ? { ...task, title: row.title } : task))
    );  
  }, [updateRecursiveTaskMutate]);

  const createAttachmentMutation = useCreateMultipleAttachments();

  const postGetAttachmentByTask= usepostGetRecursiveTaskLogsAttachmentByTask();

     const handleMultipleUpload = async (files: FileList, log: any, date: any,taskId: any) => {
            try {
              const formData = new FormData();

              const rescursiveTaskLogId = log.id;   
              // Append all files
              // Array.from(files).forEach(file => {
              //   formData.append("files", file); // "files" should match your backend field for multiple files
              // });


             for (const file of Array.from(files)) {
  let fileToUpload = file;

  // Check for image by MIME type and extension
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.bmp', '.tiff'];
  const fileName = file.name.toLowerCase();
  const isImageExtension = imageExtensions.some(ext => fileName.endsWith(ext));

  if (file.type.startsWith('image/') && isImageExtension) {
    try {
      console.log("Compressing image:", file);
    const   compressedBlob = await imageCompression(file, {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      });
          fileToUpload = new File([compressedBlob], file.name, { type: compressedBlob.type });

      console.log("Compressed image file:", fileToUpload);
    } catch (err) {
      console.error("Image compression failed, uploading original file.", err);
      fileToUpload = file;
    }
  }

  formData.append("files", fileToUpload);
}




              formData.append("recursiveTaskLogId", taskId);
              formData.append("logId", log.id);
              formData.append("date", date);          
              // Use your multiple attachments mutation
              await createAttachmentMutation.mutateAsync([formData, userid]);
              const attachmentResponse = await postGetAttachmentByTask.mutateAsync([log.id]);

              console.log("Attachment response:", rescursiveTaskLogId, taskId, log.recursiveTaskId);



              setTasks(prev =>
      prev.map(task => {
        return task.id === log.recursiveTaskId
          ? { 
              ...task, 
              recursiveTaskLogs: task.recursiveTaskLogs.map((log: any) => 
                log.id === rescursiveTaskLogId 
                  ? { ...log, files: attachmentResponse } 
                  : log
              ) 
            } 
          : task;
      })
    );

              // setTasks(prev =>
              //   prev.map(item => item.id === log.id ? { ...item, files: attachmentResponse } : item)
              // );
          
              // refetchTasksData();
          
            } catch (error) {
              console.error("Error uploading files:", error);
              if (error instanceof Error) {
                console.error("Error message:", error.message);
              }
              alert("Failed to upload files. Please try again.");
            }
          };


            const triggerMultipleFileUpload = (e: React.MouseEvent, log: any, date: any) => {
            e.preventDefault();
            e.stopPropagation();
            // Create a new file input element dynamically
            const input = document.createElement('input');
            input.type = 'file';
            input.multiple = true; // <-- allow multiple files
            input.onchange = (e) => {
              const files = (e.target as HTMLInputElement).files;
              if (files && files.length > 0) {
                handleMultipleUpload(files, log, date, log.id); // <-- use your multiple upload handler
              }
            };
            // Trigger click on the input
            input.click();
          };


           const openDateChangeModal = (e: React.MouseEvent, log: any, date: any) => {
                  const isPastDate = dayjs(date).isBefore(dayjs().startOf('day'));

            if (isPastDate) return;
            
            e.preventDefault();
            e.stopPropagation();
            setSelectedRecursiveTask(log.recursiveTaskId);
            setSelectedRecursiveTaskLogDate(date);
            setOpenChangeDateModal(true);
          };
  

  const columns = useMemo(() => [
    {
      header: 'Name',
      accessorKey: 'title',
      size: 250,
      headerStyle: { textAlign: 'center', fontSize: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' },

      enableSorting: false,
      meta: {
        
      },
      cell: ({ row }: { row: any }) => (
          <CustomEditableCell
          value={row.original.title} // or any string value you want to edit
          onSave={newValue => {

            handleRowEdit({ id: row.original.id, title: newValue });
            // handle save logic here, e.g. update state or call API
          }}
        />

      
      ),
    },
    // {
    //   header: "Interval",
    //   accessorKey: 'intervalDays',
    //   size: 60,
    //         enableSorting: false,

    //   cell: ({ row }: { row: any }) => {
    //     const interval = row.original.intervalDays;
    //     return (
    //       <span>
    //         {interval} {interval === 1 ? 'day' : 'days'}
    //       </span>
    //     );
    //   },
    // },
    ...allDates.map(date => {
      // Check if the date is in the past
      const isPastDate = dayjs(date).isBefore(dayjs().startOf('day'));
      
      return {
        header: DateWithThreeMonthletters(date),
        accessorKey: date,
        size:115,
              enableSorting: false,
cell: ({ row }: { row: any }) => {
    const log = (row.original.recursiveTaskLogs || []).find((l: any) => l.date === date);
  if (!log) return null;

  const checked = log.status === 'completed';
  const attachments = log.files || [];
  const comments = log.comments || [];

   return (
    <RecursiveTaskLogCell
      log={log}
      date={date}
      row={row}
      isPastDate={isPastDate}
      checked={checked}
      attachments={attachments}
      comments={comments}
      handleCheck={handleCheck}
      handleMultipleUpload={handleMultipleUpload}
      openDateChangeModal={openDateChangeModal}
      triggerMultipleFileUpload={triggerMultipleFileUpload}
      openCommentModal={openCommentModal}
      handleEditComment={handleEditComment}
      handleDeleteComment={handleDeleteComment}
      editingComment={editingComment}
      setEditingComment={setEditingComment}
      assigneeOptions={assigneeOptions}
      commentsVisible={commentsVisible}
    />
  );




},



      };
    }),
  ], [
    allDates, 
    handleCheck, 
    handleEditComment, 
    handleDeleteComment, 
    editingComment, 
    createAttachmentMutation, 
    userid, 
    hiddenCommentRows, // Add this dependency
    toggleCommentsVisibility, // And this one
    
  ]);

  const dateOption =[
  { label: 'Before', value: 'before' },
          { label: 'After', value: 'after' },
          { label: 'On Date', value: 'on' },
          { label: 'In Between', value: 'between' },
]



   const [filters, setFilters] = useState<Record<string, string | string[]>>({});
        const [activeFilters, setActiveFilters] = useState<string[]>([]);

//       useEffect(() => {
//   if (customFilters) setFilters(customFilters);
//   if (customActiveFilters) setActiveFilters(customActiveFilters);
// }, [customFilters, customActiveFilters]);

         const availableFilterColumns = [
 
  {header: 'Date', accessorKey: 'taskDate'},
];


 const columnsWithWidth = columns
  .map((col: any) => ({
    ...col,
    size: columnWidthMap[col.accessorKey as string] || col.size || 200,
    orderId: recursiveTaskTablePreference?.find((p: any) => p.accessorKey === col.accessorKey)?.orderId ?? col.orderId,
    isVisible: recursiveTaskTablePreference?.find((p: any) => p.accessorKey === col.accessorKey)?.isVisible ?? col.isVisible,


  }))
  .sort((a, b) => {
    // If both have orderId, sort numerically; otherwise, keep original order
    if (typeof a.orderId === "number" && typeof b.orderId === "number") {
      return a.orderId - b.orderId;
    }
    return 0;
  });

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


  const updateTablePreferences = useUpdateUsersTablePreference();


 const handleColumnResize = (columnId: string, newSize: number) => {
    const body={
      width: newSize,
    }

    if(columnId === 'title') {
    updateTablePreferences.mutateAsync([body, columnId,"recursiveTask",  userid]);

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

  //   const filteredTasks = useMemo(() => {
  //     return tasks
  // }, [tasks]);

  const filteredTasks = useMemo(() => {
  if (!tasks || tasks.length === 0) return [];

  // Sort tasks by intervalDays (optional, if not already sorted)
  const sortedTasks = [...tasks].sort((a, b) => a.intervalDays - b.intervalDays);

  let lastInterval: number | null = null;
  const result: any[] = [];

  // for (const task of sortedTasks) {
  //   if (task.intervalDays !== lastInterval) {
  //     // Insert a divider row
  //     result.push({ __divider: true,  title: `${task.intervalDays} days` });
  //     lastInterval = task.intervalDays;

  //   }
  //   result.push(task);
  // }

  for (const task of sortedTasks) {
  let intervalLabel = `${task.intervalDays} days`;
  // Map specific intervals to months/years
  switch (task.intervalDays) {
    case 1:
      intervalLabel = 'Every Day';
      break;
    case 30:
      intervalLabel = '1 Month';
      break;
    case 60:
      intervalLabel = '2 Months';
      break;
    case 90:
      intervalLabel = '3 Months';
      break;
    case 180:
      intervalLabel = '6 Months';
      break;
    case 365:
      intervalLabel = '1 Year';
      break;
    default:
      intervalLabel = `${task.intervalDays} days`;
  }

  if (task.intervalDays !== lastInterval) {
    // Insert a divider row
    result.push({ __divider: true, title: intervalLabel });
    lastInterval = task.intervalDays;
  }
  result.push(task);
}

  return result;
}, [tasks]);



  const filteredColumns = useMemo(() => {
  // If no date filter, return all columns


  if (!filters.dateType || !filters.taskDate) return columnsWithWidth;


  // Find all date columns (skip the first two: 'Name' and 'Interval')
  // const dateColumns = columnsWithWidth.slice(2);

    const dateColumns = columnsWithWidth;


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
  // return [
  //   ...columnsWithWidth.slice(0, 1),
  //    ...filteredDateColumns];


     return [
  ...columnsWithWidth.slice(0, 1),
  ...filteredDateColumns.filter(
    col =>
      !columnsWithWidth
        .slice(0, 1)
        .some(baseCol => baseCol.accessorKey === col.accessorKey)
  ),
];
}, [columnsWithWidth, filters,customFilters, customActiveFilters]);



const columnsWithSizing = filteredColumns.map(col =>{ 
  
  return ( {
  ...col,
  width: columnSizing?.[col.accessorKey] || 120, // fallback to default
})});









    // Tabs items
//   const tabItems: TabsProps['items'] = intervalOptions.map(opt => ({
//     key: String(opt.value),
//     label: opt.label,
//   }));

  if (isLoading) return <div>Loading...</div>




  



  return (
    <styled.recursiveTaskContainer>


      <styled.FiltersDiv>

{activeFilters.map((key: any) => {
 
  if (key === 'taskDate') {
    const dateType = filters.dateType;
    return (
      <styled.FilterTag key={key} active={!!filters[key]} style={{ background: 'rgb(25, 25, 25)' }}>
        <span style={{ color: '#bbb', marginRight: 6, fontWeight: 500, minWidth: "fit-content" }}>
Date       
 </span>
        <CustomSelect
          size="small"
          style={{ width: 100, marginRight: 8 }}
          value={dateOption?.find(opt => opt.value === dateType) || null}
          onChange={val => {
            setFilters(prev => ({ ...prev, dateType: val.value }));
          }}
          options={dateOption}
        />
        {dateType === 'between' ? (
          <>
            <styled.singleDateDiv>
              <DateInput
                value={filters.taskStartDate || ''}
                onChange={date =>
                  setFilters(prev => ({
                    ...prev,
                    taskStartDate: date && dayjs(date).isValid() ? date.format('YYYY-MM-DD') : ''
                  }))
                }
                placeholder="Start date"
              />
            </styled.singleDateDiv>
            <styled.singleDateDiv>
              <DateInput
                value={filters.taskEndDate || ''}
                onChange={date =>
                  setFilters(prev => ({
                    ...prev,
                    taskEndDate: date && dayjs(date).isValid() ? date.format('YYYY-MM-DD') : ''
                  }))
                }
                placeholder="End date"
              />
            </styled.singleDateDiv>
          </>
        ) : (
          <styled.singleDateDiv>
            <DateInput
              value={filters[key] || ''}
             onChange={date =>
                             handleFilterChange(
                               key,
                               date && dayjs(date).isValid() ? date.format('YYYY-MM-DD') : ''
                             )
                           }
              placeholder="Select date"
            />
          </styled.singleDateDiv>
        )}
        <span
          onClick={() => {
            handleRemoveFilter('dateType');
            handleRemoveFilter('taskDate');
            handleRemoveFilter('taskStartDate');
            handleRemoveFilter('taskEndDate');
          }}
          style={{
            cursor: 'pointer',
            padding: '0 6px',
            fontSize: 16,
            color: 'white',
          }}
        >
          ×
        </span>
      </styled.FilterTag>
    );
  };




  



  // Default rendering for other filters
  return (
    <styled.FilterTag key={key} active={!!filters[key]} style={{ background: 'rgb(25, 25, 25)' }}>
      <styled.FilterHeader>
        <span style={{ color: '#bbb', marginRight: 6, fontWeight: 500 }}>
          Date
        </span>
      </styled.FilterHeader>
      <styled.WhitePlaceholderInput
        size="small"
        value={filters[key]}
        onChange={(e: any) => handleFilterChange(key, e.target.value)}
          style={{
            width: 150,
            background: 'rgb(25, 25, 25)',
            color: 'white',
            border: 'transparent',
          }}
        />
    
      <span
        onClick={() => {
          
            handleRemoveFilter(key);
          
        }}
        style={{
          cursor: 'pointer',
          padding: '0 6px',
          fontSize: 16,
          color: 'white',
        }}
      >
        ×
      </span>

     

      
    </styled.FilterTag>
  );
})}


   <CustomSelect
    placeholder="+ Filter"
    size="small"
    width="150px"
    value={null}
    onChange={handleAddFilter}
    options={availableFilterColumns.map((col: any) => ({
      label: col.header,
      value: col.accessorKey,
    }))}


  />


    <styled.CommentToggleButton 
                      onClick={toggleAllCommentsVisibility}
                      type="button"
                    >
                      {commentsVisible ? 'Hide Comments' : 'Show Comments'}
                    </styled.CommentToggleButton>
  
  
      
  


  </styled.FiltersDiv>
      

      <TaskCustomTable
          // data={tasks}
        data={filteredTasks}
        // columns={filteredColumns}
                columns={columnsWithSizing}
                isColumnHeaderCentered={true}
                

        
        onDataChange={() => {}  }
        isDownloadable={false}
        createEmptyRow={() => {
          console.log('Creating empty row');
          setOpenRecursiveTaskModal(true);
          return{}
        }}
          onColumnSizingChange={(newSizing, columnId) => {
    setColumnSizing(newSizing);
    // You can also call any callback here with columnId and newSizing[columnId]
    handleColumnResize(columnId, newSizing[columnId]);
    
  }}
  columnSizing={columnSizing}
        onRowEdit={handleRowEdit}
        // scrollToColumn={dayjs().format('YYYY-MM-DD')}
        
        // isWithNewRow={true}
        onSelectionChange={handleDeleteRecursiveTask}
        isManageColumn={false}
        customSearchText={customSearchText || ''}
        isVerticalScrolling={false}
        tableIndex={tableIndex || 0}
        isRowHovered={false}
        isColumnHovered={true}
        openRecursiveTaskModal={openRecursiveTaskModal}
        setOpenRecursiveTaskModal={setOpenRecursiveTaskModal}
        withPagination={false}
        isWithNewRowButton={true}
        
        // highlightRowId={0}

      />

{openRecursiveTaskModal && (
      
      <RecursiveTaskModal
        open={openRecursiveTaskModal}
        onClose={() => setOpenRecursiveTaskModal(false)}
        title="Add Recursive Task"
        onSave={(data) => {
          handleCreateRecursiveTask(data);
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

