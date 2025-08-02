import React, { useEffect, useMemo, useState, useCallback, useRef } from 'react'
import { useLocation, useParams } from 'react-router-dom'
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
import EditRecursiveTask from './components/EditRecursiveTask/EditRecursiveTask';
import TagSelector from '../../components/customSelectModal/CustomSelectModal';
import { useDeleteAttachment } from '../../api/delete/deleteAttachment';
import BulkUpdateTaskModal from '../../components/BulkUpdateTaskModal/BulkUpdateTaskModal';



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

               const location = useLocation();
    
    const accessType = location.state?.accessType;

    const [columnSizing, setColumnSizing] = useState<{ [key: string]: number }>({});

    const [bulkSelectedTasks, setBulkSelectedTasks] = useState<any[]>([]);

    const [openEditRecursiveTaskModal, setOpenEditRecursiveTaskModal] = useState(false);

  const [activeInterval, setActiveInterval] = useState<number>(intervalDays || 0);


  const [openBulkUpdateModal, setOpenBulkUpdateModal] = useState(false);

  const [selectedBulkUpdateTasks, setSelectedBulkUpdateTasks] = useState<any[]>([]);
    const [filters, setFilters] = useState<Record<string, string | string[]>>({});
        const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const currentMonth = dayjs().month() + 1; // 1 = January, 12 = December
  const currentYear = dayjs().year();
// const currentDate = Math.max(1, dayjs().date() - 2);

const today = dayjs();
let currentDate: number[] = [];

if (today.date() === 2) {
  // If today is the 2nd, get last date of previous month and 1st of current month
  const lastDayPrevMonth = today.subtract(1, 'month').endOf('month').date();
  currentDate = [lastDayPrevMonth, 1];
} else if (today.date() === 1) {
  // If today is the 1st, only last date of previous month
  const lastDayPrevMonth = today.subtract(1, 'month').endOf('month').date();
  currentDate = [lastDayPrevMonth];
} else {
  // Otherwise, previous two days
  currentDate = [today.date() - 2, today.date() - 1];
}



  // const selectedDate = filters.month ? '01' : currentDate;

  const selectedDate = filters.month ? '01' : currentDate[currentDate.length-1];
   const selectedMonth = filters.month || currentMonth;

  const selectedYear = filters.year || currentYear;




  const { data: recursiveTasks = [], isLoading, refetch: refetchRecursiveTasks } = useGetRecursiveTaskByUser(userid || '', Number(selectedDate), Number(selectedMonth), Number(selectedYear) );



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
// const allDates = useMemo(() => {
//   const now = dayjs();
//   const daysInMonth = now.daysInMonth();
//   // Start from today - 2
//   const startDay = Math.max(1, now.date() - 2);
//   const dates = Array.from({ length: daysInMonth - startDay + 1 }, (_, i) =>
//     now.date(startDay + i).format('YYYY-MM-DD')
//   );
//   return dates;
// }, []);

// const allDates = useMemo(() => {
//   // Use selected month/year from filters if available, else fallback to current
//   const month = filters.month ? Number(filters.month) - 1 : dayjs().month(); // dayjs months are 0-indexed
//   const year = filters.year ? Number(filters.year) : dayjs().year();

//   const base = dayjs().year(year).month(month).date(1);
//   const daysInMonth = base.daysInMonth();

//   // If current month/year, start from today - 2, else from 1
//   const isCurrentMonth = month === dayjs().month() && year === dayjs().year();
//   const startDay = isCurrentMonth ? Math.max(1, dayjs().date() - 2) : 1;

//   const dates = Array.from({ length: daysInMonth - startDay + 1 }, (_, i) =>
//     base.date(startDay + i).format('YYYY-MM-DD')
//   );
//   return dates;
// }, [filters.month, filters.year]);

const allDates = useMemo(() => {
  // Use selected month/year from filters if available, else fallback to current
  const month = filters.month ? Number(filters.month) - 1 : dayjs().month(); // dayjs months are 0-indexed
  const year = filters.year ? Number(filters.year) : dayjs().year();

  // If month/year filter is applied, start from 1st day of month, else current date - 2
  const isMonthYearFilterApplied = !!filters.month || !!filters.year;
  const startDate = isMonthYearFilterApplied
    ? dayjs().year(year).month(month).date(1)
    : dayjs().year(year).month(month).date(dayjs().date());

  // End at startDate + 35 days (36 days window)
  const endDate = startDate.add(35, 'day');
  const today = dayjs();
let currentDate: number[] = [];
  if (today.date() === 2) {
    // If today is the 2nd, get last date of previous month and 1st of current month
    const lastDayPrevMonth = today.subtract(1, 'month').endOf('month').date();
    currentDate = [lastDayPrevMonth, 1];
  } else if (today.date() === 1) {
    // If today is the 1st, only last date of previous month
    const lastDayPrevMonth = today.subtract(1, 'month').endOf('month').date();
    currentDate = [lastDayPrevMonth];
  } else {
    // Otherwise, previous two days
    currentDate = [today.date() - 2, today.date() - 1];
  }

  const dates: string[] = [];
  let current = startDate;




  console.log("Start Date:", startDate.format('YYYY-MM-DD') , currentDate);
  console.log("End Date:", endDate.format('YYYY-MM-DD'),);

  while (current.isSameOrBefore(endDate, 'day')) {
    dates.push(current.format('YYYY-MM-DD'));
    current = current.add(1, 'day');
  }

  return dates;
}, [filters.month, filters.year]);

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

        if(accessType=="read"){
        alert("You do not have permission to update a task.");
        return;

      }
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

        if(accessType=="read"){
        alert("You do not have permission to update a task.");
        return;

      }
      const body = {
        currentDate: originalDate,
        newDate: newDate,
      };
      const response = await UpdateRecursiveTaskDateMutate.mutateAsync([body, taskId, loggedInUserId]);

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

      if(accessType=="read"){
        alert("You do not have permission to update a task.");
        return;

      }
    console.log("Adding comment:", data, "for task ID:", selectedTaskId);
    const body = {
      comment: data.comment,
      mentionedMembers: data.mentionedMembers || [],
      recursiveTaskLogId: selectedTaskId,
      givenBy: loggedInUserId,
    }

    const response = await commentMutate.mutateAsync([body, loggedInUserId]);
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

      if(accessType=="read"){
        alert("You do not have permission to update a task.");
        return;

      }
    console.log("Editing comment:", rowId, commentId, commentText, mentionedMember);
    const body = {
      comment: commentText,
      mentionedMember: mentionedMember,
    }
    const response = await useUpdateCommentMutate.mutateAsync([body, commentId, loggedInUserId]);
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
  
  const handleDeleteComment = useCallback(async (rowId: any, commentId: any, recursiveTaskId: any) => {
      if(accessType=="read"){
        alert("You do not have permission to update a task.");
        return;

      }

      console.log("Deleting comment:", rowId, commentId, recursiveTaskId);
    const body = {
      deletedAt: new Date()
    }
    const response = await useDeleteCommentMutate.mutateAsync([body, commentId, loggedInUserId]);
    const commentResponse = await postGetComment.mutateAsync([rowId]);
    
    setTasks(prev =>
      prev.map(task => {
        return task.id === recursiveTaskId 
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
        if(accessType=="read"){
        alert("You do not have permission to update a task.");
        return;

      }
      await updateBulkRecursiveTaskMutate.mutateAsync([taskWithDeletedAt, loggedInUserId]);
      setTasks(prev => prev.filter(task => 
        !allTask.some((t: any) => t.original.id === task.id)
      ));
    } catch (error) {
      console.error('Error deleting recursive tasks:', error);
    }
  }, [updateBulkRecursiveTaskMutate, userid]);
  


  const handleBulkUpdateRecursiveTask = useCallback(async (allTask: any, data: any) => {
    const taskWithUpdatedData = allTask.map((task: any) => ({
      id: task?.original?.id,
      data: {
        endDate: data.endDate ? dayjs(data.endDate).format('YYYY-MM-DD') : '',  
      },
    }));


    try {
        if(accessType=="read"){
        alert("You do not have permission to update a task.");
        return;

      }
      await updateBulkRecursiveTaskMutate.mutateAsync([taskWithUpdatedData, loggedInUserId]);
      refetchRecursiveTasks();
      // setTasks(prev => prev.map(task => 
      //   taskWithUpdatedData.find(t => t.id === task.id) ? { ...task, ...t.data } : task
      // ));
    } catch (error) {
      console.error('Error updating recursive tasks:', error);
    }


  }, [updateBulkRecursiveTaskMutate, userid]);  
  const updateRecursiveTaskLogsMutate = useUpdateRecursiveTaskLog();

  const handleCheck = useCallback((checked: boolean, log: any, date: string, taskId: any) => {

      if(accessType=="read"){
        alert("You do not have permission to update a task.");
        return;

      }
    const body = {
      status: checked ? 'completed' : 'pending',
    };

    updateRecursiveTaskLogsMutate.mutateAsync([body, date, taskId, loggedInUserId], {
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
  const handleEditDateByRecursiveTask = useCallback(async(taskId: any, newDate: any) => {
    const body = {
      endDate: newDate ? dayjs(newDate).format('YYYY-MM-DD') : '',
    };

    const response = await updateRecursiveTaskMutate.mutateAsync([body, taskId, loggedInUserId]);
     const taskData = await postGetRecursiveTask.mutateAsync([taskId]);
      setTasks(prev => prev.map(task => 
        task.id === taskId ? { ...task, ...taskData } : task
      ));

  },[updateRecursiveTaskMutate]);

  const handleRowEdit = useCallback((row: any) => {

      if(accessType=="read"){
        alert("You do not have permission to update a task.");
        return;

      }
    console.log('Editing row:', row);
    const body = {
      title: row.title,
    }
    updateRecursiveTaskMutate.mutateAsync([body, row.id, loggedInUserId]);


    setTasks(prev =>
      prev.map(task => (task.id === row.id ? { ...task, title: row.title } : task))
    );  
  }, [updateRecursiveTaskMutate]);

  const createAttachmentMutation = useCreateMultipleAttachments();

  const postGetAttachmentByTask= usepostGetRecursiveTaskLogsAttachmentByTask();

     const handleMultipleUpload = async (files: FileList, log: any, date: any,taskId: any) => {
            try {

                if(accessType=="read"){
        alert("You do not have permission to update a task.");
        return;

      }
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
              await createAttachmentMutation.mutateAsync([formData, loggedInUserId]);
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


        const deleteAttachmentMutation = useDeleteAttachment();


          const handleDeleteAttachment = useCallback(async (attachmentId: any, logId: any, recursiveTaskLogId: any) => {
            try {


              console.log("Deleting attachment:", attachmentId, logId, recursiveTaskLogId);

              await deleteAttachmentMutation.mutateAsync([attachmentId, loggedInUserId]);


              setTasks(prev =>
                prev.map(task => {
                  if (task.id === recursiveTaskLogId) {
                    return {
                      ...task,
                      recursiveTaskLogs: task.recursiveTaskLogs.map((log:any) => {
                        if (log.id === logId) {
                          return {
                            ...log,
                            files: log.files.filter((file: any) => file.id !== attachmentId)
                          };
                        }
                        return log;
                      })
                    };
                  }
                  return task;
                })
              );
            } catch (error) {
              console.error("Error deleting attachment:", error);
            }
          }, [deleteAttachmentMutation]);

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
          opnenEditModal={()=>{setSelectedRecursiveTask(row.original.id); setOpenEditRecursiveTaskModal(true)}}
          showEditButton={true}
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
      onDeleteAttachment={handleDeleteAttachment}
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



 

//       useEffect(() => {
//   if (customFilters) setFilters(customFilters);
//   if (customActiveFilters) setActiveFilters(customActiveFilters);
// }, [customFilters, customActiveFilters]);

         const availableFilterColumns = [
 
  {header: 'Date', accessorKey: 'taskDate'},
  { header: 'Month/Year', accessorKey: 'monthYear' },
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
  setActiveFilters((prev) => [...prev, columnKey]);
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


  const handleBulkUpdate = (selectedRows: any[]) => {
    setOpenBulkUpdateModal(true);
    setSelectedBulkUpdateTasks(selectedRows);

  }

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

    // Add Month-Year filter
    if (key === 'monthYear') {
      const monthOptions = [
        { label: 'January', value: '01' }, { label: 'February', value: '02' },
        { label: 'March', value: '03' }, { label: 'April', value: '04' },
        { label: 'May', value: '05' }, { label: 'June', value: '06' },
        { label: 'July', value: '07' }, { label: 'August', value: '08' },
        { label: 'September', value: '09' }, { label: 'October', value: '10' },
        { label: 'November', value: '11' }, { label: 'December', value: '12' },
      ];
      // Generate years from 2020 to current year + 2
      // const currentYear = dayjs().year();
      // const yearOptions = Array.from({ length: 7 }, (_, i) => {
      //   const year = 2020 + i;
      //   return { label: String(year), value: String(year) };
      // });

      const currentYear = dayjs().year();
const yearOptions = Array.from({ length: 5 }, (_, i) => {
  const year = currentYear - 1 + i; // 1 before, current, and 3 after
  return { label: String(year), value: String(year) };
});

      return (
        <styled.FilterTag key={key} active={!!filters[key]} style={{ background: 'rgb(25, 25, 25)' }}>
          <span style={{ color: '#bbb', marginRight: 6, fontWeight: 500, minWidth: "fit-content" }}>
            Month/Year
          </span>
          <CustomSelect
            size="small"
            style={{ width: 110, marginRight: 8 }}
            value={monthOptions.find(opt => opt.value === filters.month) || null}
            onChange={val => setFilters(prev => ({ ...prev, month: val.value }))}
            options={monthOptions}
            placeholder="Month"
          />
          <CustomSelect
            size="small"
            style={{ width: 90, marginRight: 8 }}
            value={yearOptions.find(opt => opt.value === filters.year) || null}
            onChange={val => setFilters(prev => ({ ...prev, year: val.value }))}
            options={yearOptions}
            placeholder="Year"
          />
          <span
            onClick={() => {
              handleRemoveFilter('monthYear');
              setFilters(prev => ({ ...prev, month: '', year: '' }));
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
    }

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


   {/* <CustomSelect
    placeholder="+ Filter"
    size="small"
    width="150px"
    value={null}
    onChange={handleAddFilter}
    options={[
      ...availableFilterColumns.map((col: any) => ({
        label: col.header,
        value: col.accessorKey,
      })),
       // Add this line
    ]}
  /> */}

  <TagSelector
  placeholder="+ Filter"
  options={[
    ...availableFilterColumns.map((col: any) => ({
      id: col.accessorKey,  
      label: col.header,
      value: col.accessorKey,
    })),
    // Add this line if you want to add more options
  ]}
  value={null}
  onChange={handleAddFilter}
  allowCreate={false}
  horizontalOptions={false}
  isWithDot={false}
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
        handleBulkUpdate={ handleBulkUpdate }
        showBulkUpdateButton={true}
        
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


        {openEditRecursiveTaskModal && (
          <EditRecursiveTask
            open={openEditRecursiveTaskModal}
            onClose={() => setOpenEditRecursiveTaskModal(false)}
            title="Edit Recursive Task"
            taskId={selectedRecursiveTask}
            onSave={handleEditDateByRecursiveTask}
            width={600}
          />
        )}


        {openBulkUpdateModal && (
          <BulkUpdateTaskModal
            open={openBulkUpdateModal}
            onClose={() => setOpenBulkUpdateModal(false)}
            title="Bulk Update Recursive Tasks"
            selectedIds={selectedBulkUpdateTasks}
            onSave={handleBulkUpdateRecursiveTask}
          />
        )}

    </styled.recursiveTaskContainer>
  )
}



export default RecursiveTaskTable

