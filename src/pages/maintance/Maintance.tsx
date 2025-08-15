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
import { DateWithThreeMonthletters, formatDisplayDate, formatDurationShort } from '../../utils/commonFunction';
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
import { useGetAllMaintanceByUser } from '../../api/get/getMaintanceByUser';
import { useCreateMaintance } from '../../api/post/newMaintance';
import { useUpdateMaintance } from '../../api/put/updateMaintance';
import { useUpdateBulkMaintance } from '../../api/put/updateBulkMaintance';
import TemoraryUserModal from './components/TemporaryUserModal/TemoraryUserModal';
import { useGetAllTemporaryUsers } from '../../api/get/getAllTemporaryUser';
import AssigneMaintanceModal from './components/AssignMaintanceModal/AssigneMaintanceModal';
import { useUpdateMaintanceTaskLogs } from '../../api/put/updateMaintanceTaskLogs';
import { useGetMaintanceTaskLogs } from '../../api/get/postGetMaintanceTaskLogs';
import { useGetCommentByMaintanceTaskLogId } from '../../api/get/postGetCommentsByMaintanceTaskLog';
import { useUpdateMaintanceTaskDate } from '../../api/put/updateMaintanceTaskDate';
import TagMultiSelector from '../../components/CustomMultiSelectModal/CustomMultiSelectModal';
import { Label } from '../../components/CustomSearchInput/style';
import ManageTaskOrder from '../../components/ManageTaskOrder/ManageTaslOrder';



interface RecursiveTask {
    intervalDays?: number;
    customFilters?: Record<string, string | string[]>;
    customActiveFilters?: string[];
    isCommentVisible?: boolean;
    customSearchText?: string;
    tableIndex?: number; // Optional index prop for the table

}

const Maintance = ({intervalDays, customFilters, customActiveFilters, isCommentVisible, customSearchText, tableIndex}: RecursiveTask) => {
    const loggedInUserId = Number(localStorage.getItem('userid'));

               const location = useLocation();
    
    const accessType = location.state?.accessType;

    const [columnSizing, setColumnSizing] = useState<{ [key: string]: number }>({});

    const [bulkSelectedTasks, setBulkSelectedTasks] = useState<any[]>([]);

    const [manageColumnOrder, setManageColumnOrder] = useState<string[]>([]);

    const [openTemporaryUserModal, setOpenTemporaryUserModal] = useState(false);

    const [openEditRecursiveTaskModal, setOpenEditRecursiveTaskModal] = useState(false);

  const [activeInterval, setActiveInterval] = useState<number>(intervalDays || 0);


  const [openBulkUpdateModal, setOpenBulkUpdateModal] = useState(false);

  const [openAssigneeModal, setOpenAssigneeModal] = useState(false);

  const [selectedMaintenance, setSelectedMaintance] = useState<any>(null);

  const [openOrderChangingModal, setOpenOrderChangingModal] = useState(false);

  const [selectedBulkUpdateTasks, setSelectedBulkUpdateTasks] = useState<any[]>([]);
    const [filters, setFilters] = useState<Record<string, string | string[]>>({});
        const [activeFilters, setActiveFilters] = useState<string[]>([]);

  // const currentMonth = dayjs().month() + 1; // 1 = January, 12 = December

  const today = dayjs();
let currentMonth = today.month() + 1; // 1 = January, 12 = December

if (today.date() === 1 || today.date() === 2) {
  // If today is 1st or 2nd, set currentMonth to previous month
  currentMonth = today.subtract(1, 'month').month() + 1;
}
  const currentYear = dayjs().year();
// const currentDate = Math.max(1, dayjs().date() - 2);

let currentDate: number[] = [];

if (today.date() === 2) {
  // If today is the 2nd, get last date of previous month and 1st of current month
  const lastDayPrevMonth = today.subtract(1, 'month').endOf('month').date();
  currentDate = [lastDayPrevMonth, 1, 2];
} else if (today.date() === 1) {
  // If today is the 1st, only last date of previous month
  const lastDayPrevMonth = today.subtract(1, 'month').endOf('month').date();
  currentDate = [lastDayPrevMonth, 1];
} else {
  // Otherwise, previous two days
  currentDate = [today.date() - 2, today.date() - 1, today.date()];
}



  // const selectedDate = filters.month ? '01' : currentDate;


  const {data: temporaryUserData, refetch: refetchTemporaryUsers} = useGetAllTemporaryUsers(loggedInUserId);

  const [temporaryUsers, setTemporaryUsers] = useState<any[]>([]);

  useEffect(() => {
  if (temporaryUserData && Array.isArray(temporaryUserData)) {

    setTemporaryUsers(
      temporaryUserData.map((user: any) => ({
        id: user?.id,
        value: user?.id,
        label: user?.name,
      }))
    );
  }
}, [temporaryUserData]);

  const selectedDate = filters.month ? '01' : currentDate[0];
   const selectedMonth = filters.month || currentMonth;

  const selectedYear = filters.year || currentYear;

  const [selectedType, setSelectedType] = useState<string>('all');  
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const [usersAssignedTime , setUsersAssignedTime] = useState([]);



  const shouldFetchRecursiveTasks =
  selectedType === 'between'
    ? !!startDate && !!endDate
    : selectedType === "after"
   ? !!startDate :
    selectedType === "before" ? !!endDate
    : true;


//   const { data: recursiveTasks = [], isLoading, refetch: refetchRecursiveTasks } = useGetRecursiveTaskByUser(loggedInUserId || '', 
// Number(selectedDate), Number(selectedMonth),
//  Number(selectedYear), selectedType, startDate, 
// endDate,shouldFetchRecursiveTasks );

const {data : maintanceData = [], isLoading, refetch: refetchMaintance} = useGetAllMaintanceByUser(Number(loggedInUserId), Number(selectedDate), Number(selectedMonth),Number(selectedYear), selectedType, startDate,endDate,shouldFetchRecursiveTasks );  

//   const {data: recursiveTaskTablePreference} = useGetRecursiveTaskTablePreference(loggedInUserId || '');



//    const columnWidthMap = useMemo(() => {
//     if (!recursiveTaskTablePreference) return {};
//     return recursiveTaskTablePreference.reduce((acc: any, pref: any) => {
//       acc[pref.accessorKey] = pref.width;
//       acc[pref.orderId] = pref.orderId;
//       return acc;
//     }, {});
//   }, [recursiveTaskTablePreference]);




 

  
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
    setTasks(maintanceData.data);
  setManageColumnOrder(maintanceData.data);
    setUsersAssignedTime(maintanceData.totalTimePerUser);

  }, [maintanceData]);


    const updateBulkMaintenanceMutate = useUpdateBulkMaintance();


const handleOrderChange = async(newOrder: any[]) => {
  console.log('Neworder:', newOrder);
  setTasks(prevTasks => {
    return newOrder
      .map((orderItem, idx) => {
        const task = prevTasks.find(task => task.id === orderItem.id);
        return task ? { ...task, orderId: idx + 1 } : null;
      })
      .filter(Boolean);
  });

  const customNewOrder = newOrder.map((order: any) => ({
      id: order?.id,
      data: { orderId: order?.orderId },
    }));

        await updateBulkMaintenanceMutate.mutateAsync([customNewOrder, loggedInUserId]);








};



  const [maintanceAssignedTo, setMaintanceAssignedTo] = useState<any[]>([]);
  const [maintanceTime, setMaintanceTime ] = useState<string | null>(null);

  const [maintanceEndTime, setMaintanceEndTime] = useState<string | null>(null);

  const handleAssignMaintance = async(data: any, assignedTo: any[], time: string | null, endTime: string | null)=>{
    setSelectedTaskId(data);
    setOpenAssigneeModal(true);
    setMaintanceAssignedTo(assignedTo);
    setMaintanceTime(time);
    setMaintanceEndTime(endTime);
  }


const allDates = useMemo(() => {
  // Use selected month/year from filters if available, else fallback to current
  const month = filters.month ? Number(filters.month) - 1 : dayjs().month(); // dayjs months are 0-indexed
  const year = filters.year ? Number(filters.year) : dayjs().year();


  if (filters.dateType === 'after' && startDate) {
    // All dates from startDate to end of month/year window
    const start = dayjs(startDate);
  const end = start.add(30, 'day'); // End is 30 days after startDate
  const dates: string[] = [];
  let current = start;
  while (current.isSameOrBefore(end, 'day')) {
    dates.push(current.format('YYYY-MM-DD'));
    current = current.add(1, 'day');
  }
  return dates;
  }

  if (filters.dateType === 'before' && endDate) {
  // All dates from endDate - 30 days to endDate
  const end = dayjs(endDate);
  const start = end.subtract(30, 'day');
  const dates: string[] = [];
  let current = start;
  while (current.isSameOrBefore(end, 'day')) {
    dates.push(current.format('YYYY-MM-DD'));
    current = current.add(1, 'day');
  }
  return dates;
}


 if (filters.dateType === 'between' && startDate && endDate) {
    // All dates from startDate to endDate
    const start = dayjs(startDate);
    const end = dayjs(endDate);
    const dates: string[] = [];
    let current = start;
    while (current.isSameOrBefore(end, 'day')) {
      dates.push(current.format('YYYY-MM-DD'));
      current = current.add(1, 'day');
    }
    return dates;
  }

  if (filters.dateType === 'on' && startDate) {
  // Only the selected date
  return [dayjs(startDate).format('YYYY-MM-DD')];
}

  // If month/year filter is applied, start from 1st day of month, else current date - 2
  const isMonthYearFilterApplied = !!filters.month || !!filters.year;
  const customStartDate = isMonthYearFilterApplied
    ? dayjs().year(year).month(month).date(1)
    : dayjs().year(year).month(month).date(dayjs().date()-2);

  // End at startDate + 35 days (36 days window)
  const customEndDate = customStartDate.add(35, 'day');
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
  let current = customStartDate;




  

  while (current.isSameOrBefore(customEndDate, 'day')) {
    dates.push(current.format('YYYY-MM-DD'));
    current = current.add(1, 'day');
  }

  return dates;
}, [filters.month, filters.year, filters.dateType, startDate, endDate]);
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


  const useCreateMaintanceMutate = useCreateMaintance();


  const handleCreateRecursiveTask = useCallback(async (data: { 
    name: string; 
    startDate: string, 
    endDate: string, 
    time: any,
    interval: any 
  }) => {
    try {

        if(accessType=="read"){
        alert("You do not have permission to update a task.");
        return;

      }
      await useCreateMaintanceMutate.mutateAsync([{
        name: data.name,
        startDate: data.startDate,
        endDate: data.endDate,
        time: data.time,
        interval: data.interval,
      }, loggedInUserId]);
      refetchMaintance();
      setOpenRecursiveTaskModal(false);

    } catch (error) {
      console.error('Error creating recursive task:', error);
    }
  }, [useCreateMaintanceMutate, loggedInUserId]);

  

  const UpdateMaintanceTaskDateMutate = useUpdateMaintanceTaskDate();

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
      const response = await UpdateMaintanceTaskDateMutate.mutateAsync([body, taskId, loggedInUserId]);

      // const taskData = await postGetRecursiveTask.mutateAsync([taskId]);
      // setTasks(prev => prev.map(task => 
      //   task.id === taskId ? { ...task, ...taskData } : task
      // ));
      console.log('Date change response:', response);
    } catch (error) {
      console.error('Error updating recursive task date:', error);
    }
  }, [UpdateMaintanceTaskDateMutate, postGetRecursiveTask]);
  

  const postGetComment = useGetCommentByMaintanceTaskLogId();

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
      maintanceTaskLogId: selectedTaskId,
      givenBy: loggedInUserId,
    }

    const response = await commentMutate.mutateAsync([body, loggedInUserId]);
    const commentResponse = await postGetComment.mutateAsync([selectedTaskId]);
    
    setTasks(prev =>
      prev.map(task => {
        return task.id === commentResponse?.[0]?.maintanceId 
          ? { 
              ...task, 
              maintanceTaskLogs: task.maintanceTaskLogs.map((log: any) => 
                log.id === selectedTaskId 
                  ? { ...log, comments: commentResponse } 
                  : log
              ) 
            } 
          : task;
      })
    );
  }, [commentMutate, postGetComment, selectedTaskId, loggedInUserId]);
  

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
        return task.id === commentResponse?.[0]?.maintanceId 
          ? { 
              ...task, 
              maintanceTaskLogs: task.maintanceTaskLogs.map((log: any) => 
                log.id === commentResponse?.[0]?.maintanceTaskLogId 
                  ? { ...log, comments: commentResponse } 
                  : log
              ) 
            } 
          : task;
      })
    );
    setEditingComment(null);
  }, [useUpdateCommentMutate, postGetComment, selectedTaskId, loggedInUserId]);
  

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
              maintanceTaskLogs: task.maintanceTaskLogs.map((log: any) => 
                log.id === selectedTaskId 
                  ? { ...log, comments: commentResponse } 
                  : log
              ) 
            } 
          : task;
      })
    );
  }, [useDeleteCommentMutate, postGetComment, selectedTaskId]);
  


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
      await updateBulkMaintenanceMutate.mutateAsync([taskWithDeletedAt, loggedInUserId]);
      setTasks(prev => prev.filter(task => 
        !allTask.some((t: any) => t.original.id === task.id)
      ));
    } catch (error) {
      console.error('Error deleting recursive tasks:', error);
    }
  }, [updateBulkMaintenanceMutate, loggedInUserId]);
  


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
      await updateBulkMaintenanceMutate.mutateAsync([taskWithUpdatedData, loggedInUserId]);
      refetchMaintance();
      // setTasks(prev => prev.map(task => 
      //   taskWithUpdatedData.find(t => t.id === task.id) ? { ...task, ...t.data } : task
      // ));
    } catch (error) {
      console.error('Error updating recursive tasks:', error);
    }


  }, [updateBulkMaintenanceMutate, loggedInUserId]);  
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

  const updateMaintanceMutate = useUpdateMaintance();
  const handleEditDateByRecursiveTask = useCallback(async(taskId: any, newDate: any) => {
    const body = {
      endDate: newDate ? dayjs(newDate).format('YYYY-MM-DD') : '',
    };

    const response = await updateMaintanceMutate.mutateAsync([body, taskId, loggedInUserId]);
     const taskData = await postGetRecursiveTask.mutateAsync([taskId]);
      setTasks(prev => prev.map(task => 
        task.id === taskId ? { ...task, ...taskData } : task
      ));

  },[updateMaintanceMutate]);

  const openMaintanceModal = useCallback((maintanceId: any) => {
    if(accessType=="read"){
      alert("You do not have permission to update a task.");
      return;
    }
    console.log("Opening maintenance modal for ID:", maintanceId);
    setSelectedTaskId(maintanceId);
    setOpenAssigneeModal(true);

  }, []);

  const handleRowEdit = useCallback((row: any) => {

      if(accessType=="read"){
        alert("You do not have permission to update a task.");
        return;

      }
    console.log('Editing row:', row);
    const body = {
      name: row.name,
    }
    updateMaintanceMutate.mutateAsync([body, row.id, loggedInUserId]);


    setTasks(prev =>
      prev.map(task => (task.id === row.id ? { ...task, name: row.name } : task))
    );  
  }, [updateMaintanceMutate]);

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
        maxSizeMB: 0.2,
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



          const updateMaintanceTaskMutate = useUpdateMaintanceTaskLogs();
          const postGetMaintanceTaskLogs = useGetMaintanceTaskLogs();
          const handleFinalAssignMaintance= async(userId: any, time: any, endTime: any)=>{
            console.log("Assigning maintenance to user:", userId, "for task ID:", time, selectedTaskId);
            const body={
              assignedTo: userId,
              startTime: time,
              endTime: endTime || null
            }
            await updateMaintanceTaskMutate.mutateAsync([body, selectedTaskId, loggedInUserId]);
            refetchMaintance();
            setMaintanceAssignedTo([]);

           
            setOpenAssigneeModal(false);
            setSelectedTaskId(null);

          }

           const openDateChangeModal = (e: React.MouseEvent, log: any, date: any) => {
                  const isPastDate = dayjs(date).isBefore(dayjs().startOf('day'));

            if (isPastDate) return;
            
            e.preventDefault();
            e.stopPropagation();
            setSelectedRecursiveTask(log.maintanceId);
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



          const handleDeleteAssignedUser = async (userId: any, maintanceTaskLogId: any) => {
            console.log("Deleting assigned user:", userId, "for task log ID:", maintanceTaskLogId);
            const body={
              removedUserId: userId,
            }
            await updateMaintanceTaskMutate.mutateAsync([body, maintanceTaskLogId, loggedInUserId]);
                        const response = await postGetMaintanceTaskLogs.mutateAsync([maintanceTaskLogId]);
           setTasks(prev =>
  prev.map(task => {
    return task.id === response?.maintanceId 
      ? { 
          ...task, 
          maintanceTaskLogs: task.maintanceTaskLogs.map((log: any) => 
            log.id === maintanceTaskLogId 
              ? { ...log, assignedTo: response.assignedTo } 
              : log
          ) 
        } 
      : task;
  })
);

          }

  const columns = useMemo(() => [
    {
      header: 'Name',
      accessorKey: 'name',
      size: 250,
      headerStyle: { textAlign: 'center', fontSize: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' },

      enableSorting: false,
      meta: {
        
      },
      cell: ({ row }: { row: any }) => (
          <CustomEditableCell
          value={row.original.name} // or any string value you want to edit
          onSave={newValue => {

            handleRowEdit({ id: row.original.id, name: newValue });
            // handle save logic here, e.g. update state or call API
          }}
          opnenEditModal={()=>{setSelectedRecursiveTask(row.original.id); setOpenEditRecursiveTaskModal(true)}}
          showEditButton={true}
        />

      
      ),
    },
    {
        header: "Time",
        accessorKey: 'time',
        size: 100,
        enableSorting: false,

        cell: ({ row }: { row: any }) => {
          const time = row.original.time;
          return <span>{formatDurationShort(time)}</span>;
        },
    },
    
    ...allDates.map(date => {
      // Check if the date is in the past
      const isPastDate = dayjs(date).isBefore(dayjs().startOf('day'));
      
      return {
        header: DateWithThreeMonthletters(date),
        accessorKey: date,
        size:250,
              enableSorting: false,
cell: ({ row }: { row: any }) => {
    const log = (row.original.maintanceTaskLogs || []).find((l: any) => l.date === date);
  if (!log) return null;

  const taskTime = row.original.time || '';
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
      temporaryUsers={temporaryUsers}
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
      onAssignMaintance={ handleAssignMaintance}
      onDeleteAssignedUser={ handleDeleteAssignedUser}
      tasktime={taskTime}

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
    loggedInUserId, 
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
  { header: 'Assignee', accessorKey: 'assignee' },
];


//  const columnsWithWidth = columns
//   .map((col: any) => ({
//     ...col,
//     size: columnWidthMap[col.accessorKey as string] || col.size || 200,
//     orderId: recursiveTaskTablePreference?.find((p: any) => p.accessorKey === col.accessorKey)?.orderId ?? col.orderId,
//     isVisible: recursiveTaskTablePreference?.find((p: any) => p.accessorKey === col.accessorKey)?.isVisible ?? col.isVisible,


//   }))
//   .sort((a, b) => {
//     // If both have orderId, sort numerically; otherwise, keep original order
//     if (typeof a.orderId === "number" && typeof b.orderId === "number") {
//       return a.orderId - b.orderId;
//     }
//     return 0;
//   });

const columnsWithWidth = columns;

const handleFilterChange = (key: string, value: string) => {
  console.log("Filter changed:", key, value);
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
    updateTablePreferences.mutateAsync([body, columnId,"recursiveTask",  loggedInUserId]);

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
   
     
      "taskDate": ['selectedType', 'startDate', 'endDate'],

  };


    const keysToRemove = relatedKeys[key as keyof typeof relatedKeys] || [key];


  // Remove all related keys from filters
  setFilters((prev) => {
    const newFilters = { ...prev };
    keysToRemove.forEach(k => delete newFilters[k]);
    return newFilters;
  });

  setActiveFilters((prev: string[]) => prev.filter((k) => k !== key));

    if (key === "taskDate") {
    setStartDate("");
    setEndDate("");
    setSelectedType("");
  }
};

  //   const filteredTasks = useMemo(() => {
  //     return tasks
  // }, [tasks]);

  const filteredTasks = useMemo(() => {
  if (!tasks || tasks.length === 0) return [];

  // Sort tasks by intervalDays (optional, if not already sorted)
  const sortedTasks = [...tasks].sort((a, b) => a.interval - b.interval);

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
  let intervalLabel = `${task.interval} days`;
  // Map specific intervals to months/years
  switch (task.interval) {
    case 1:
      case "1":
      intervalLabel = 'Shoot';
      break;
    case 30:
      case "30":
      intervalLabel = '1 Month';
      break;
    case 60:
      case "60":
      intervalLabel = '2 Months';
      break;
    case 90:
      case "90":
      intervalLabel = '3 Months';
      break;
    case 180:
      case "180":
      intervalLabel = '6 Months';
      break;
    case 365:
      case "365":
      intervalLabel = '1 Year';
      break;
    case "s1":
      intervalLabel = 'Shift 1- 9am to 6pm';
      break;
    case "s2":
      intervalLabel = 'Shift 2- 3pm to 12pm';
      break;
    default:
      intervalLabel = `${task.interval} days`;
  }

  console.log('Mapped interval:', task.interval, intervalLabel);

  if (task.interval !== lastInterval) {
    // Insert a divider row
    result.push({ __divider: true, title: intervalLabel });
    lastInterval = task.interval;
  }
  result.push(task);
}

  return result;
}, [tasks, handleOrderChange]);




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
  ...columnsWithWidth.slice(0, 2),
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


const filteredData = React.useMemo(() => {
  const todayStr = dayjs().format('YYYY-MM-DD');
  const result = filteredTasks?.filter((task) => {
    return Object.entries(filters).every(([key, val]) => {
      if (key === "assignee") {
        if (!val) return true;
        // Find the log for today
        const todayLog = Array.isArray(task.maintanceTaskLogs)
          ? task.maintanceTaskLogs.find((log: any) => log.date === todayStr)
          : null;
        if (!todayLog || !Array.isArray(todayLog.assignedTo)) return false;
        // Check if any assigned user matches the filter value
        return todayLog.assignedTo.some((user: any) =>
          String(user.id ?? user.value ?? user).includes(String(val))
        );
      }
      return true;
    });
  });
  return result;
}, [filteredTasks, filters]);






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
        {/* <CustomSelect
          size="small"
          style={{ width: 100, marginRight: 8 }}
          value={dateOption?.find(opt => opt.value === dateType) || null}
          onChange={val => {
            setFilters(prev => ({ ...prev, dateType: val.value }));
            setSelectedType(val.value); // <-- Set selectedType here

          }}
          options={dateOption}
        /> */}

        <CustomSelect
  size="small"
  style={{ width: 100, marginRight: 8 }}
  value={dateOption?.find(opt => opt.value === dateType) || null}
  onChange={val => {
    setFilters(prev => ({ ...prev, dateType: val.value }));
    setSelectedType(val.value);

    // If "after" is selected, set startDate from selected date
    if (val.value === 'after' && filters[key]) {
      setStartDate(Array.isArray(filters[key]) ? filters[key][0] : filters[key] as string);
      setEndDate(""); // clear endDate
    }
    // If "before" is selected, set endDate from selected date
    if (val.value === 'before' && filters[key]) {
      setEndDate(Array.isArray(filters[key]) ? filters[key][0] : filters[key] as string);
      setStartDate(""); // clear startDate
    }

     if (val.value === 'on' || val.value === 'between') {
      setStartDate("");
      setEndDate("");
    }
  }}
  options={dateOption}
/>

        
        {dateType === 'between' ? (
          <>
            <styled.singleDateDiv>
              <DateInput
                value={filters.taskStartDate || ''}
               onChange={date => {
          const formattedDate = date && dayjs(date).isValid() ? date.format('YYYY-MM-DD') : '';
          setFilters(prev => ({
            ...prev,
            taskStartDate: formattedDate
          }));
          setStartDate(formattedDate);
        }}
                placeholder="Start date"
              />
            </styled.singleDateDiv>
            <styled.singleDateDiv>
              <DateInput
                value={filters.taskEndDate || ''}
               onChange={date => {
          const formattedDate = date && dayjs(date).isValid() ? date.format('YYYY-MM-DD') : '';
          setFilters(prev => ({
            ...prev,
            taskEndDate: formattedDate
          }));
          setEndDate(formattedDate);
        }}
                placeholder="End date"
              />
            </styled.singleDateDiv>
          </>
        ) : (
          <styled.singleDateDiv>
            <DateInput
              value={filters[key] || ''}
             onChange={date => {
        const formattedDate = date && dayjs(date).isValid() ? date.format('YYYY-MM-DD') : '';
        handleFilterChange(key, formattedDate);

        // Set startDate or endDate depending on dateType
        if (dateType === 'after') {
          setStartDate(formattedDate);
          setEndDate('');
        } else if (dateType === 'before') {
          setEndDate(formattedDate);
          setStartDate('');
        } 
        else if(dateType === 'on' || dateType === 'between') {
          setStartDate(formattedDate);
          setEndDate(formattedDate); // For 'on', both start and end are the same date

        }
          else {
          setStartDate('');
          setEndDate('');
        }
      }}
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
        { id: "01", label: 'January', value: '01' }, { id:"02",  label: 'February', value: '02' },
        { id: '03', label: 'March', value: '03' }, {  id: '04', label: 'April', value: '04' },
        { id: '05' , label: 'May', value: '05' }, {  id: '06', label: 'June', value: '06' },
        {  id: '07' , label: 'July', value: '07' }, {  id: '08', label: 'August', value: '08' },
        { id: '09' ,  label: 'September', value: '09' }, { id: '10',  label: 'October', value: '10' },
        { id: '11',  label: 'November', value: '11' }, { id: '12',  label: 'December', value: '12' },
      ];
  

      const currentYear = dayjs().year();
const yearOptions = Array.from({ length: 5 }, (_, i) => {
  const year = currentYear - 1 + i; // 1 before, current, and 3 after
  return {id:String(year), label: String(year), value: String(year) };
});

      return (
        <styled.FilterTag key={key} active={!!filters[key]} style={{ background: 'rgb(25, 25, 25)' }}>
          <span style={{ color: '#bbb', marginRight: 6, fontWeight: 500, minWidth: "fit-content" }}>
            Month/Year
          </span>
          <TagSelector
            value={Array.isArray(filters.month) ? filters.month[0] : filters.month || null}
  onChange={val => setFilters(prev => ({ ...prev, month: val ? String(val) : '' }))}  
            options={monthOptions}
            placeholder="Month"
          />

          <TagSelector
            value={Array.isArray(filters.year) ? filters.year[0] : filters.year || null}
  onChange={val => setFilters(prev => ({ ...prev, year: val ? String(val) : '' }))}           
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



if (key === "assignee") {
  // Ensure value is a number to match option.value
  const selectedValue =
    Array.isArray(filters[key])
      ? Number(filters[key][0]) ?? undefined
      : filters[key]
      ? Number(filters[key])
      : undefined;

  return (
            <styled.FilterTag key={key} active={!!filters[key]} style={{ background: 'rgb(25, 25, 25)' }}>

    <TagSelector
      options={temporaryUsers || []}
      value={selectedValue}
      onChange={newVal =>
        handleFilterChange(key, newVal !== undefined && newVal !== null ? String(newVal) : "")
      }
      placeholder="Assignee"
      allowCreate={false}
      horizontalOptions={false}
    />
    <span
        onClick={() => {
          handleRemoveFilter('assignee');
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

                    <Button
                    type="primary"
                      onClick={() => setOpenTemporaryUserModal(true)}
                      style={{ marginLeft: 8 }}
                      
                      >Add User</Button>

                      <Button
                      type="primary"
                      onClick={() => setOpenOrderChangingModal(true)}
                      style={{ marginLeft: 8 }}
                      >
                        Change Order
                      </Button>



  </styled.FiltersDiv>

    <styled.usersAssignedTimeDiv>
  {usersAssignedTime?.map((user: any, idx: number) => {
    const hours = Math.floor(user?.time / 60);
    const minutes = Math.round(user?.time % 60);
    return (
      <div key={idx}>
        {user?.name}: {hours > 0 ? `${hours} hr${hours > 1 ? 's' : ''} ` : ''}
        {minutes > 0 ? `${minutes} min` : hours === 0 ? '0 min' : ''}
      </div>
    );
  })}
</styled.usersAssignedTimeDiv>
  
      

      <TaskCustomTable
        // data={filteredTasks}
       data={filteredData}
        // columns={filteredColumns}
                columns={columnsWithSizing}
                isColumnHeaderCentered={true}
                
                isRowHovered={true}

        
        onDataChange={() => {}  }
        isDownloadable={false}
        createEmptyRow={() => {
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
        isColumnHovered={true}
        openRecursiveTaskModal={openRecursiveTaskModal}
        setOpenRecursiveTaskModal={setOpenRecursiveTaskModal}
        withPagination={false}
        isWithNewRowButton={true}
        handleBulkUpdate={ handleBulkUpdate }
        showBulkUpdateButton={true}
         showRowLogs={true}
        
        handleLogClick={(data: any) => {

          setSelectedRecursiveTask(data?.original?.id);
          setOpenEditRecursiveTaskModal(true);
        }}

        // highlightRowId={0}

      />

{openRecursiveTaskModal && (
      
      <RecursiveTaskModal
        open={openRecursiveTaskModal}
        onClose={() => setOpenRecursiveTaskModal(false)}
        title="Add Cleaning Task"
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
            title="Edit Maintance Task"
            taskId={selectedRecursiveTask}
            onSave={handleEditDateByRecursiveTask}
            width={600}
          />
        )}

        {openAssigneeModal && (
          <AssigneMaintanceModal
            open={openAssigneeModal}
            onClose={() => setOpenAssigneeModal(false)}
            title="Assign Task"
            taskId={selectedTaskId}
            assigneeOptions={temporaryUsers}
            // onSave={handleAssignMaintance}
            assignedUsers={maintanceAssignedTo}
            onAssign={handleFinalAssignMaintance}
            time={maintanceTime}
            endTime={maintanceEndTime}

          />
        )}


        {openBulkUpdateModal && (
          <BulkUpdateTaskModal
            open={openBulkUpdateModal}
            onClose={() => setOpenBulkUpdateModal(false)}
            title="Bulk Update Cleaning Tasks"
            selectedIds={selectedBulkUpdateTasks}
            onSave={handleBulkUpdateRecursiveTask}
          />
        )}

        {openOrderChangingModal && (
          <ManageTaskOrder
            isOpen={openOrderChangingModal}
            onClose={() => setOpenOrderChangingModal(false)}
            columnManagerOrder={manageColumnOrder}
            table={tasks}
            onOrderChange={handleOrderChange}
          />
        )}

        {openTemporaryUserModal && (
          <TemoraryUserModal
            open={openTemporaryUserModal}
            onClose={() => setOpenTemporaryUserModal(false)}
            title="Add User"
            tempporaryUsers={temporaryUsers}
            refetchUsers={refetchTemporaryUsers}

          />
        )}

    </styled.recursiveTaskContainer>
  )
}



export default Maintance

