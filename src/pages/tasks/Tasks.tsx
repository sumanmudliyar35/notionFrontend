import type { ColumnDef } from "@tanstack/react-table";
import  { CustomTable } from "../../components/customTable/CustomTable"
import React, { useEffect, useState, useMemo, useRef } from "react";
import { useGetLeadsByUser } from "../../api/get/getLeadsByUser";
import { useCreateLead } from "../../api/post/newLead";
import { useUpdateLead } from "../../api/put/updateLead";
import * as styled from './style'
import { Button, Input, message, Select } from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { useGetAllUsers } from "../../api/get/getAllMember";
import CustomTag from "../../components/customTag/CustomTag";
import { useGetAllReferences } from "../../api/get/getAllReference";
import CustomSelect from "../../components/customSelect/CustomSelect";
import { useGetAllShoots } from "../../api/get/getAllShoot"; // <-- Add this import
import { useCreateVoiceRecord } from "../../api/post/newVoiceRecord";
import { ref } from "yup";
import { useUpdateComment } from "../../api/put/updateComment";
import { useDeleteComment } from "../../api/delete/deleteComment";
import CrossIcon from "../../assets/icons/CrossIcon";
import { Popconfirm } from "antd";
import { useUpdateEvent } from "../../api/put/updateEvent";
import CustomInput from "../../components/customInput/CustomInput";
import CustomTextArea from "../../components/customTextArea/CustomTextArea";
import { useDeleteEvent } from "../../api/delete/deleteEvent";
import CustomModal from "../../components/customModal/CustomModal";
import { useGetAllEventList } from "../../api/get/getAllEventList";
import MuiInputWithDate from "../../components/MuiDatePicker/MuiInputWithDate";
import Mui2InputWithDate from "../../components/Mui2InputWithDate/Mui2InputWithDate";
import { createPortal } from "react-dom";
import ReminderModal from "../../components/reminderModal/ReminderModal";
import { useCreateReminder } from "../../api/post/newReminder";
import DateInput from "../../components/CustomDateInput/CustomDateInput";
import dayjs from "dayjs";
import { useGetLeadsTablePreference } from "../../api/get/getLeadstablePreference";
import { useUpdateUsersTablePreference } from "../../api/put/updateUsersTablePreference";
import { useDownloadLeadsCSV } from "../../api/get/getLeadsCSV";
import Papa from "papaparse"; // Add at the top if not already imported
import { useUpdateBulkUsersTablePreference } from "../../api/put/updateBulkUpdateUsersTablePreference";
import DescriptionCell from "./components/DescriptionCell/DescriptionCell";
import CommentCell from "./components/CommentCell/CommentCell";
import DateTimeModal from "../leads/components/DateTimeModal/DateTimeModal";
import CommentModal from "../leads/components/CommentModal/CommentModal";
import VoiceModal from "../leads/components/VoiceModal/VoiceModal";
import { useGetTasksByUser } from "../../api/get/getAllTaskByUser";
import { useCreateTask } from "../../api/post/newTask";
import { useUpdateTask } from "../../api/put/updateTask";
import SharedCommentModal from "../../components/SharedCommentModal/SharedCommentModal";
import { useCreateComment } from "../../api/post/newComment";
import { useCreateTaskVoiceRecord } from "../../api/post/newTaskVoiceRecord";
import { useParams } from 'react-router-dom';
import { useGetTaskTablePreference } from "../../api/get/getTaskTablesPreference";
import { useUpdateBulkTask } from "../../api/put/updateBulkTask";
import { usePostGetByTask } from "../../api/get/postGetCommentByTask";
import { useCreateAttachment } from "../../api/post/newAttachment";
import { formatDisplayDate } from "../../utils/commonFunction";




interface Doc {
  id: any;
  name: string;
  dueDate?: string; // Ensure this matches your API
  category: string;
  project?: string; // Ensure this matches your API
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
  event?: string;
  contact?: string;
  description?: string;
  status?: string;
  voice?: string;
  followup?: string;
  reminder?: string;
  comment?: string;
  mentions?: string;
  converted?: string;
  leads?: string;
  eventCount?: number;
  commentCount?: number;
  assignedTo?: any;
  amount?: number;
  reference?: string; // Ensure this matches your API
  shoot?: string; // <-- Add this line
  referenceId?: number | null; // Ensure this matches your API
  shootId?: number | null; // <-- Add this line
  comments?: any[]; // Assuming comments is an array of objects
  visible?: boolean; // Add this field if needed
  voiceRecords?: { id: number; voiceUrl: string }[]; // Assuming voice records are stored like this
  
  eventData?: { eventId: number; eventDate: string; noOfGuests: number; note?: string }[]; // Assuming events are stored like this
  files?: any;
}




const DROPDOWN_HEIGHT = 150; // px



const Tasks = () => {

  // const userid = Number(localStorage.getItem('userid'));

const { userid } = useParams(); // If your route is defined as /user/:userId/recursive-task
  const roleid = localStorage.getItem('roleid');
  const loggedInUserId = Number(localStorage.getItem('userid'));

const [offset, setOffset] = useState(0);

        const [tableData, setTableData] = useState<any[]>([]);

    const {data: TaskData, refetch: refetchTasksData} = useGetTasksByUser(Number(userid), offset);

    const {data: taskTablePreference, refetch: refetchTaskTablePreference} = useGetTaskTablePreference(userid);

    useEffect(() => {
  if (TaskData?.data) {
    console.log("TaskData:", offset);
    setTableData(prev => {
      if (offset === 0) return TaskData.data;
      console.log("Previous Table Data:", prev);
      console.log("Appending TaskData:", Array.isArray(prev), TaskData.data);
      return Array.isArray(prev) ? [...prev, ...TaskData.data] : [...TaskData.data];
    });
  }
}, [TaskData, offset]);




    const columnWidthMap = useMemo(() => {
  if (!taskTablePreference) return {};
  return taskTablePreference.reduce((acc: any, pref: any) => {
    acc[pref.accessorKey] = pref.width;
    acc[pref.orderId] = pref.orderId;
    return acc;
  }, {});
}, [taskTablePreference]);

    const {data: allMembersData} = useGetAllUsers();
 

  // Store userId and name in state
  const [assigneeOptions, setAssigneeOptions] = useState<{ label: string; value: any }[]>([]);

 

    const [columnSizing, setColumnSizing] = useState({});





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

 

  useEffect(() => {
  if (roleid === "3") {
    // Only allow current user as assignee
    setAssigneeOptions([
      {
        label: localStorage.getItem('name') || 'You',
        value: userid,
      },
    ]);
  } else if (allMembersData) {
    setAssigneeOptions(
      allMembersData
        .filter((u: any) => u.name && u.userId)
        .map((u: any) => ({
          label: u.name,
          value: u.userId,
        }))
    );
  }
}, [allMembersData, roleid, userid]);

      const [isEventModalOpen, setIsEventModalOpen] = useState(false);

            const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);

            const [isMentionModalOpen, setIsMentionModalOpen] = useState(false);

        // const [tableData, setTableData] = useState<any[]>(TaskData?.data);

        const [selectedTaskId, setSelectedTaskId] = useState<number>();


        const [selectedMentionLeadId, setSelectedMentionLeadId] = useState<number>();

        const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);

        const [isTimeDateModalOpen, setIsTimeDateModalOpen] = useState(false);  

        const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
        const [selectedVoiceRow, setSelectedVoiceRow] = useState<any>(null);

        const [editingComment, setEditingComment] = useState<{ rowId: any; commentId: any } | null>(null);





        // useEffect(()=>{
        //   setTableData(TaskData?.data)

        // },[TaskData]);


       


                const createAttachmentMutation = useCreateAttachment();
        
       

    const openCommentModal = (rowData: Doc) => {
          setSelectedTaskId(rowData?.id)
          setIsCommentModalOpen(true);
  };

  const openMentionModal = (rowData: Doc) => {
          setSelectedMentionLeadId(rowData?.id);
          setIsMentionModalOpen(true);
  };

  const openVoiceModal = (rowData: Doc) => {
          setSelectedVoiceRow(rowData);
          setIsVoiceModalOpen(true);
  };


  const handleOpenReminderModal = (rowId: any, reminder: any) => {
    setSelectedTaskId(rowId);
    setIsReminderModalOpen(true);
  };

  const useUpdateCommentMutate = useUpdateComment();

  const handleEditComment = async(rowId: any, commentId: any, commentText: string, mentionedMember: any) => {

  
    const body={
      comment: commentText,
      mentionedMember: mentionedMember,
    }
    const response = await useUpdateCommentMutate.mutateAsync([body, commentId, userid]);

    // refetchTasksData();
    setEditingComment(null);
    const commentsResponse = await postGetComment.mutateAsync([rowId]);
    setTableData(prev =>
      prev.map(row =>
        row.id === rowId ? { ...row, comments: commentsResponse } : row
      )
    );

  
  };


  const useDeleteCommentMutate = useDeleteComment();

const handleDeleteComment = async (rowId: any, commentId: any) => {
  const body={
    deletedAt: new Date()
  }
  console.log("commentid", commentId)
  const reponse = await useDeleteCommentMutate.mutateAsync([body,commentId]);
    // refetchTasksData();
    const commentsResponse = await postGetComment.mutateAsync([rowId]);
    setTableData(prev =>
      prev.map(row =>
        row.id === rowId ? { ...row, comments: commentsResponse } : row
      )
    );




}

const [editingRow, setEditingRow] = useState<any>(null);
const [editingRowValue, setEditingRowValue] = useState<any>({});


const handleOpenDateTimeModal = (row: any, date: any, time: any) => {
  setEditingRow(row);
  setEditingRowValue({ date, time });
  setIsTimeDateModalOpen(true)
};






 


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




  


const columns: ColumnDef<Doc>[] = [
  {
    header: 'Name',
    accessorKey: 'name',

    size: 500,

    meta: { editable: true },
      enableSorting: true,
      cell: ({ row }) => (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span  style={{ whiteSpace: 'pre-line' }}>{row.original.name}</span>
         
           
        </div>
      ),
  },

   {
    header: 'Created Date',
    accessorKey: 'createdAt',
    enableSorting: true,
    meta: { editable: false },
  cell: (getValue: any) => {
  // const value = getValue.getValue();
  // if (!value) return '';
  // const dateObj = new Date(value);
  // const dateStr = `${dateObj.getDate().toString().padStart(2, '0')}-${(dateObj.getMonth() + 1)
  //   .toString()
  //   .padStart(2, '0')}-${dateObj.getFullYear()}`;
  // let hours = dateObj.getHours();
  // const minutes = dateObj.getMinutes().toString().padStart(2, '0');
  // const ampm = hours >= 12 ? 'pm' : 'am';
  // hours = hours % 12;
  // hours = hours ? hours : 12; // the hour '0' should be '12'
  // const timeStr = `${hours.toString().padStart(2, '0')}:${minutes} ${ampm}`;
  // return `${dateStr} ${timeStr}`;
  return formatDisplayDate(getValue.getValue());

},
  },
    {
      header: 'Created By',
      accessorKey: 'createdBy', // or 'assignedTo' if that's your field
      meta: {
        editable: false,
        // editorType: 'select',
        // selectOptions: assigneeOptions,
      },
      cell: ({ getValue }) => {
        const value = getValue();
    
        const option = assigneeOptions.find(opt => opt.value == value);
        return option ? option.label : '';
      },
    },
 

  {
    header: 'Due Date',
    accessorKey: 'dueDate',
    enableSorting: true,
    meta: { editable: true, editorType: 'date' },
    cell: (row: any) => {
  const dueDateValue = row.row.original.dueDate;
  const createdAtValue = row.row.original.createdAt;
  const currentDate = new Date();
  if (!dueDateValue || !createdAtValue) return '';

  const dueDate = new Date(dueDateValue);
  const createdAt = new Date(createdAtValue);

  

  // Calculate difference in days
  const diffTime = dueDate.getTime() - currentDate.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (isNaN(diffDays)) return '';

  if (diffDays >= 0) {
    return (
      <span style={{ color: 'green', fontWeight: 500 }}>
        {formatDisplayDate(dueDate)} ({diffDays} day{diffDays !== 1 ? 's' : ''})
      </span>
    );
  } else {
    return (
      <span style={{ color: 'red', fontWeight: 500 }}>
        {formatDisplayDate(dueDate)} ({Math.abs(diffDays)} day{Math.abs(diffDays) !== 1 ? 's' : ''})
      </span>
    );
  }
},
  },
 

            {
      header: 'Assignee',
      accessorKey: 'assignedTo', // or 'assignedTo' if that's your field
      meta: {
        editable: roleid ==="1" ? true : false, // Only allow editing for admin
        editorType: 'select',
        selectOptions: assigneeOptions,
      },
      cell: ({ getValue }) => {
        const value = getValue();
    
        const option = assigneeOptions.find(opt => opt.value == value);
        return option ? option.label : '';
      },
    },

 
  
  { header: 'Status', accessorKey: 'status',
     meta: {
      editable: true,
      editorType: 'select',
      selectOptions: [
        { label: 'Not Started', value: 'notStarted' },
        { label: 'In Progress', value: 'inProgress' },
        { label: 'For Approval', value: 'forApproval' },
        { label: 'Done', value: 'completed' },
      ],
    },
 },
  {
  header: 'Voice note',
  accessorKey: 'voice',
  cell: ({ row }) => {
    const voiceRecords = row.original.voiceRecords || [];
    return (
      <div
        style={{ cursor: "pointer", color: "#52c41a" }}
        // onClick={() => {
        //   setSelectedVoiceRow(row.original);
        //   setIsVoiceModalOpen(true);
        // }}
      >
        {voiceRecords.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {voiceRecords.map((v: any) => (
              <audio
                key={v.id}
                controls
                src={v.voiceUrl}
  style={{ width: "100%", minWidth: 120, maxWidth: "100%", marginBottom: 4 }}

              />
            ))}
          </div>
        ) : (
          
          <span style={{ color: "#aaa" }}></span>
        )}
        <Button
          size="small"
          icon={<PlusOutlined />}
          style={{ marginTop: 4 }}
          onClick={e => {
            e.stopPropagation();
            setSelectedVoiceRow(row.original);
            setIsVoiceModalOpen(true);
          }}
        />
      </div>
    );
  },
},
   


 
  //     { header: 'Reminder', accessorKey: 'reminder',

  //       cell: (getValue: any) => {
  //   const value = getValue.getValue();
  //   return (
  //     <span
  //       style={{ cursor: 'pointer', color: '#fff' }}
  //       onClick={() => handleOpenReminderModal(getValue.row.original.id, value,)}
  //     >
  //       {value || <span style={{ color: '#888' }}>Set reminder</span>}
  //     </span>
  //   );
  // },
  //      },
      
        { header: 'Comments', accessorKey: 'comment',   size: 200,
    minSize: 80,
    maxSize: 400,
    enableResizing: true, 

cell: ({ row }) => {
  const comments = row.original.comments || [];
  const rowId = row.original.id;

  return (
    <CommentCell
      comments={comments}
      rowId={rowId}
      openCommentModal={openCommentModal}
      handleEditComment={handleEditComment}
      handleDeleteComment={handleDeleteComment}
      editingComment={editingComment}
      setEditingComment={setEditingComment}
      assigneeOptions={assigneeOptions}
    />
  );
}


},

            { header: 'Project', accessorKey: 'project',
               meta: {
      editable: true,
      editorType: 'select',
      selectOptions: [
        { label: 'To Start', value: 'toStart' },
        { label: 'Current Working', value: 'ongoing' },
      ],
    }

             },
             {header: 'Files', accessorKey: "files",
              cell:({row})=>{

              
const attachments = row.original.files

                  const triggerFileUpload = (e: React.MouseEvent) => {
                          e.preventDefault();
                          e.stopPropagation();
                          // Create a new file input element dynamically
                          const input = document.createElement('input');
                          input.type = 'file';
                          input.onchange = (e) => {
                            const files = (e.target as HTMLInputElement).files;
                            if (files && files.length > 0) {
                              handleUpload(files[0], row.original, row.original.id);
                            }
                          };
                          // Trigger click on the input
                          input.click();
                        };
                
                        // Modified handleUpload to take file directly
                        const handleUpload = async (file: File, log: any, taskId: any) => {
                          
                          try {
                            const formData = new FormData();
                            formData.append("file", file);
                            formData.append("taskId", taskId);
                            // formData.append("logId", log.id);
                            
                            for (let [key, value] of formData.entries()) {
                              console.log(`${key}: ${value}`);
                            }
                            
                            if (!userid) {
                              throw new Error("User ID is undefined");
                            }
                            
                            const response = await createAttachmentMutation.mutateAsync([formData, userid]);
                            refetchTasksData();
                            
                            
                          } catch (error) {
                            console.error("Error uploading file:", error);
                            if (error instanceof Error) {
                              console.error("Error message:", error.message);
                            }
                            alert("Failed to upload file. Please try again.");
                          }
                        };

                        return (
                <div>
                   <button
                type="button"
                onClick={triggerFileUpload}
                title="Upload file"
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                📎
              </button>

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
                        )


              }



             }
          

    
              

        
];


// const columnsWithWidth = columns.map((col: any) => ({
//   ...col,
//   size: columnWidthMap[col.accessorKey as string] || col.size || 200,
//   orderId: leadsTablePreference?.find((p: any) => p.accessorKey === col.accessorKey)?.orderId ?? col.orderId,

// }));


const columnsWithWidth = columns
  .map((col: any) => ({
    ...col,
    size: columnWidthMap[col.accessorKey as string] || col.size || 200,
    orderId: taskTablePreference?.find((p: any) => p.accessorKey === col.accessorKey)?.orderId ?? col.orderId,
    isVisible: taskTablePreference?.find((p: any) => p.accessorKey === col.accessorKey)?.isVisible ?? col.isVisible,


  }))
  .sort((a, b) => {
    // If both have orderId, sort numerically; otherwise, keep original order
    if (typeof a.orderId === "number" && typeof b.orderId === "number") {
      return a.orderId - b.orderId;
    }
    return 0;
  });

const createEmptyDoc = (): Doc => {
  const now = new Date().toLocaleString();
  return {
    id: '',
    name: '',
    category: '',
    createdBy: 'You',
    createdAt: now,
    updatedBy: 'You',
    updatedAt: now,
    event: '',
    contact: '',
    description: '',
    status: '',
    voice: '',
    followup: '',
    reminder: '',
    comment: '',
    mentions: '',
    converted: '',
    leads: '',
    assignedTo: userid, // <-- add this field
  };
};


    const newTaskMutate = useCreateTask();

    const postGetComment = usePostGetByTask();

    const handleRowCreate=async(newRow: Doc)=>{
      const body={
        name: newRow.name,
        createdBy: loggedInUserId,
        assignedTo: userid,
        status:"notStarted",

      };
      const response = await newTaskMutate.mutateAsync([body, userid]);

  refetchTasksData(); // ADD THIS LINE



    };


    console.log("Table Data:", tableData);  



    const updateTaskMutate = useUpdateTask()
    

    const handleRowEdit=async(updatedRow: Doc, rowIndex: number)=>{
      console.log("Updated Row:", updatedRow);
      const body={
              name: updatedRow?.name,
              dueDate: updatedRow?.dueDate,
              project: updatedRow?.project,
              status: updatedRow?.status,
              assignedTo: updatedRow?.assignedTo,
            
      };



      const response = await updateTaskMutate.mutateAsync([body, updatedRow.id, userid]);
      refetchTasksData();

    };


    const handleRowDelete = async (rowIndex: number) => {

      const taskid = tableData[rowIndex].id;
      await updateTaskMutate.mutateAsync([{deletedAt: new Date()}, taskid, userid]);
      refetchTasksData();

    }

    const updateLeadMutate = useUpdateLead();

    const handleFollowupChange = async (date: any,time: any, leadID: any) => {
      const body = {
        followup: date ,
        followupTime: time,
        mentionedMembers: [],
      };
      try {
        await updateLeadMutate.mutateAsync([body, leadID, userid]);

        refetchTasksData();
      } catch (error) {
        console.error("Error updating followup:", error);
      }

    };



    const updateBulkUsersTablePreferences = useUpdateBulkUsersTablePreference();

    const handleColumnOrder= async(newOrder: string[]) => {
      const updatedColumns = newOrder.map((key) => {
        const col = columns.find((c: any) => c.accessorKey === key);
        return col ? { ...col, order: newOrder.indexOf(key) } : null;
      }).filter(Boolean) as ColumnDef<Doc>[];



       const orderPayload = updatedColumns.map((col:any) => ({
    accessorKey: col.accessorKey,
    orderId: col.order
  }));

    const result = await updateBulkUsersTablePreferences.mutateAsync([orderPayload, "task", userid]);
      refetchTaskTablePreference();

    };


   



    



const reminderMutate = useCreateReminder();

    const handleReminderChange = async (date: any, time: any, leadID: any, title: any) => {

      const body = {
        reminderDate: date,
        reminderTime: time,
        leadId: selectedTaskId,
        userId: userid,
        message: title,
      };
      try {
        await reminderMutate.mutateAsync([body, selectedTaskId]);
        refetchTasksData();
        setSelectedTaskId(0);
        setIsReminderModalOpen(false);
      } catch (error) {
        console.error("Error creating reminder:", error);
      }
    };

      const savedFiltersValue = useMemo(() => {
      const filters = localStorage.getItem('tasksFilters');
      return filters ? JSON.parse(filters) : {};
    }, []);
    
    const savedActiveFiltersValue = useMemo(() => {
      const activeFilters = localStorage.getItem('tasksActiveFilters');
      return activeFilters ? JSON.parse(activeFilters) : [];
    }, []);

    const [filters, setFilters] = useState<Record<string, string | string[]>>(savedFiltersValue);
    const [activeFilters, setActiveFilters] = useState<string[]>(savedActiveFiltersValue);
    
        

    const filterableKeys = [
  "status",
  "createdBy",
  "project",
  "dueDate",
 

];

// const availableFilterColumns = columns.filter(
//   (col: any) =>
//     col.meta?.editable &&
//     !activeFilters.includes(col.accessorKey as string)
// );

const availableFilterColumns = columns.filter(
  (col: any) =>
    filterableKeys.includes(col.accessorKey as string) &&
    !activeFilters.includes(col.accessorKey as string)
);

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

useEffect(() => {
  localStorage.setItem('tasksFilters', JSON.stringify(filters));
}, [filters]);

useEffect(() => {
  localStorage.setItem('tasksActiveFilters', JSON.stringify(activeFilters));
}, [activeFilters]);



const commentMutate = useCreateComment();
const handleComment= async(data: any) => {

  const body = {
    comment: data.comment,
    mentionedMembers: data.mentionedUserIds || [],
    taskId: selectedTaskId,
    givenBy: userid,
  }

  const response = await commentMutate.mutateAsync([body, userid]);
  const commentsResponse = await postGetComment.mutateAsync([selectedTaskId]);
  setTableData(prev =>
    prev.map(row =>
      row.id === selectedTaskId ? { ...row, comments: commentsResponse } : row
    )
  );

  // refetchTasksData();
}


const createVoiceRecordMutation  = useCreateTaskVoiceRecord();
const handleSaveVoice = async(audioBlob: Blob) => {
  if (selectedVoiceRow) {
    const url = URL.createObjectURL(audioBlob);


    setTableData(prev =>
      prev.map(row =>
        row.id === selectedVoiceRow.id ? { ...row, voice: url } : row
      )
    );

     createVoiceRecordMutation.mutate({
      blob: audioBlob,
      taskId: selectedVoiceRow?.id, // assuming you have this
      createdBy: Number(userid), // or get it from auth/user state
    }, {
      onSuccess: () => {
        refetchTasksData();
        console.log("Voice record created successfully.");
      },
      onError: (error) => {
        console.error("Error uploading voice record:", error);
      },
    });
    setIsVoiceModalOpen(false);
    setSelectedVoiceRow(null);
  }
};






const handleRemoveFilter = (key: string) => {
  setFilters((prev) => {
    const newFilters = { ...prev };
    delete newFilters[key];
    return newFilters;
  });

  setActiveFilters((prev: string[]) => prev.filter((k) => k !== key));
};
// Filter tableData based on filters



const dateOption =[
  { label: 'Before', value: 'before' },
          { label: 'After', value: 'after' },
          { label: 'On Date', value: 'on' },
          { label: 'In Between', value: 'between' },
]




const filteredData = React.useMemo(() => {

   const hasActiveFilters = Object.values(filters).some(val => val !== undefined && val !== null && val !== '');
  if (!hasActiveFilters) return tableData;

console.log("Filters", hasActiveFilters, filters);

  return tableData?.filter((row) => {


    const followupType = filters.followupType;

  return Object.entries(filters).every(([key, val]) => {


    // Event Data filter


    console.log("key", key, "val", val);

   


    if (key === 'dueDate' || key === 'followupType' || key ==='followupStart' || key ==="followupEnd") {
            if (!followupType || !val) return true;

      const followupDate = row.dueDate?.slice(0, 10);

      console.log("key", key, "followupDate", followupDate, followupType);

            // if (!followupDate || !filters.followup) return false;




  if (followupType === 'between' && filters.followupStart && filters.followupEnd) {


  const start = filters.followupStart;
  const end = filters.followupEnd;
  
  // If no range is set, don't filter
  if (!start || !end) return true;
  
  // If no followup date, exclude this row
  if (!followupDate) return false;

  // For date-only comparisons, use string comparison (YYYY-MM-DD format)
  // This avoids timezone issues and is more reliable for date-only filtering
  return followupDate >= start && followupDate <= end;
}

      // if(filters.followup!=="between"){

      // }


      if (followupType === 'before' && filters.dueDate) {

        console.log("inside before");
        console.log("followupDate", followupDate, "filters.dueDate", filters.dueDate, followupDate < filters.dueDate);

        return followupDate < filters.dueDate;
      }
      if (followupType === 'after' && filters.dueDate) {

        console.log("inside after");
        console.log("followupDate", followupDate, "filters.dueDate", filters.dueDate, followupDate > filters.dueDate);
        return followupDate > filters.dueDate;
      }
      if (followupType === 'on' && filters.dueDate) {
        console.log("followupDate", followupDate, "filters.dueDate", filters.dueDate, followupDate === filters.dueDate);

        return followupDate === filters.dueDate;
      }
      return true;
    }

    




    if (key === 'assignedTo') {
      if (Array.isArray(val)) {
        // If val is an array, check if any value matches
        return val.some(v => String(row[key as keyof Doc] || '').includes(String(v)));
      }
      return val ? String(row[key as keyof Doc] || '').includes(String(val)) : true;
    }
    if (key === 'mentions') {
      return Array.isArray(row.mentions)
        ? row.mentions.some((m: any) =>
            m.userName && m.userName.toLowerCase().includes(String(val).toLowerCase())
          )
        : false;
    }
    return val
      ? String(row[key as keyof Doc] || '').toLowerCase().includes(String(val).toLowerCase())
      : true;
  });
});
}, [tableData, filters]);


  const updateTablePreferences = useUpdateUsersTablePreference();

  const handleColumnResize = (columnId: string, newSize: number) => {
    const body={
      width: newSize,

    }
    
const response = updateTablePreferences.mutateAsync([body, columnId,"task", userid]);
refetchTaskTablePreference();


  };



  const downloadLeadsMutate = useDownloadLeadsCSV();


  const downloadCSV = async () => {
  // Fetch the data
  const result = await downloadLeadsMutate.mutateAsync([]);

  // If your API returns { success, data }, use result.data
  const leads = result?.data || result;

  // Keys to remove from CSV
  const keysToRemove = [
    "category",
    "updatedAt",
    "deletedAt",
    "assignedTo",
    "referenceId",
    "eventCount",
    "shootId",
    "id"
  ];

  // Flatten nested arrays/objects for CSV and remove unwanted keys
  const flatten = (row: any) => {
    const flat: any = {};
    Object.entries(row).forEach(([key, value]) => {
      if (keysToRemove.includes(key)) return;
      if (Array.isArray(value) || (typeof value === "object" && value !== null)) {
        flat[key] = JSON.stringify(value);
      } else {
        flat[key] = value;
      }
    });
    return flat;
  };

  const csv = Papa.unparse(leads.map(flatten));

  // Download as CSV
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "leads.csv";
  a.click();
  URL.revokeObjectURL(url);
};


const handleColumnVisibilityChange = async(columnKey: string, isVisible: boolean) => {
  console.log("Column visibility change:", columnKey, isVisible);
  const body = {
    isVisible: isVisible,
  };
  const updatedResult = await updateTablePreferences.mutateAsync([body, columnKey, "task", userid]);

  refetchTaskTablePreference();

};


const updateBulkTask = useUpdateBulkTask();

const handleDeleteTask = async (tasks: any) => {
  const confirmed = window.confirm("Are you sure you want to delete the selected tasks?");
  if (!confirmed) return;

   const taskWithDeletedAt = tasks.map((task: any) => ({
    id: task?.original?.id,
    data: { deletedAt: new Date() },
  }));

  try {
    await updateBulkTask.mutateAsync([taskWithDeletedAt, userid]);
    refetchTasksData();
  } catch (error) {
    console.error("Error deleting tasks:", error);
  }
};  





  return (
    <div>

    <styled.FiltersDiv>
  {activeFilters.map((key: any) => {
    const col = columns.find((c: any) => c.accessorKey === key);
    if (!col) return null;

    const meta: { editorType?: string; selectOptions?: Array<{ label: string; value: any }> } = col.meta || {};

  if (key === 'dueDate') {
  const followupType = filters.followupType;
  return (
    <styled.FilterTag key={key} active={!!filters[key]} style={{ background: 'rgb(25, 25, 25)' }}>
       <span style={{ color: '#bbb', marginRight: 6, fontWeight: 500, minWidth: "fit-content" }}>
    {col.header?.toString()}:
  </span>
      <CustomSelect
        size="small"
        style={{ width: 100, marginRight: 8 }}
       
        // value={followupType}
                value={dateOption?.find(opt => opt.value === followupType) || null}
onChange={val => {
  setFilters(prev => ({ ...prev, followupType: val.value }));
}}        options={dateOption}
      />
      



      {followupType === 'between' ? (
        <>
        <styled.singleDateDiv>
          
          <DateInput
  value={filters.followupStart || ''}
  onChange={date =>
    setFilters(prev => ({
      ...prev,
      followupStart: date && dayjs(date).isValid() ? date.format('YYYY-MM-DD') : ''
    }))
  }
  placeholder="Start date"
/>
          </styled.singleDateDiv>
          <styled.singleDateDiv>
          
          <DateInput
  value={filters.followupEnd || ''}
  onChange={date =>
    setFilters(prev => ({
      ...prev,
      followupEnd: date && dayjs(date).isValid() ? date.format('YYYY-MM-DD') : ''
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
  console.log("Removing filter for key:", key);
  if (key === 'dueDate') {
    handleRemoveFilter('dueDate');
    handleRemoveFilter('followupType');
    handleRemoveFilter('followupStart');
    handleRemoveFilter('followupEnd');

    
  } else if (key === 'followupType') {
    handleRemoveFilter('followupType');
    handleRemoveFilter('dueDate');
     handleRemoveFilter('followupStart');
    handleRemoveFilter('followupEnd');

  }  else {
    handleRemoveFilter(key);
  }
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
   




    return (
  <styled.FilterTag key={key} active={!!filters[key]} style={{ background: 'rgb(25, 25, 25)' }}>

    <span style={{ color: '#bbb', marginRight: 6, fontWeight: 500 }}>
    {col.header?.toString()}:
  </span>
    {meta?.editorType === 'select' ? (
      <CustomSelect
        placeholder={col.header?.toString()}
        isMulti={false}
        value={meta?.selectOptions?.find((opt: any) => opt.value === filters[key]) || null}
        onChange={(option: any) => handleFilterChange(key, option ? option.value : '')}
        options={meta?.selectOptions || []}
       
      />
    ) : (
      <styled.WhitePlaceholderInput
        placeholder={col.header?.toString()}
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
    )}
     <span
onClick={() => {
  console.log("Removing filter for key:", key);
  if (key === 'followup') {
    handleRemoveFilter('followup');
    handleRemoveFilter('followupType');

    
  } else if (key === 'followupType') {
    handleRemoveFilter('followupType');
    handleRemoveFilter('followup');

  } else if (key === 'eventData') {
    handleRemoveFilter('eventData');
    handleRemoveFilter('eventType');
  } else if (key === 'eventType') {
    handleRemoveFilter('eventType');
    handleRemoveFilter('eventData');
  } else {
    handleRemoveFilter(key);
  }
}}    style={{
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
</styled.FiltersDiv>


        
        <CustomTable
         data={filteredData || []}
          onDataChange={setTableData}
          // columns={columns}
          columns={columnsWithWidth}
          createEmptyRow={createEmptyDoc}
          onRowCreate={handleRowCreate} // ✅ hook for API
          onRowEdit={handleRowEdit} // ✅ added
          isWithNewRow={true}
          columnSizing={columnSizing}
  onColumnSizingChange={(newSizing, columnId) => {
    setColumnSizing(newSizing);
    // You can also call any callback here with columnId and newSizing[columnId]
    handleColumnResize(columnId, newSizing[columnId]);
    
  }}
  onRowDelete={handleRowDelete} // ✅ added
  onColumnOrderChange={handleColumnOrder} // ✅ added
  downloadData={downloadCSV}
  isDownloadable={false}
  handleColumnVisibilityChange={handleColumnVisibilityChange}
  onSelectionChange={handleDeleteTask}
  // onOffsetChange={(newOffset) => {
  //   setOffset(newOffset);
  //   console.log("Offset changed:", newOffset);
  // }}

        />


      


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

        {/* {isMentionModalOpen && (
  <MentionModal
    open={isMentionModalOpen}
    onClose={() => setIsMentionModalOpen(false)}
    title="Mention Someone"
    leadId={selectedMentionLeadId || 0}
    refetch={refetchTasksData}
  />
)} */}


 {isTimeDateModalOpen && (
  <DateTimeModal
    open={isTimeDateModalOpen}
    onClose={() => setIsTimeDateModalOpen(false)}
    title="Add Time/Date"
    onSave={handleFollowupChange}
    leadID={editingRow}
    data={editingRowValue}
  />
)}

{isReminderModalOpen && (
  <ReminderModal
    open={isReminderModalOpen}
    onClose={() => setIsReminderModalOpen(false)}
    title="Add Reminder"
    onSave={handleReminderChange}
    leadID={selectedTaskId}
  />
)}



        {isVoiceModalOpen && (
          <VoiceModal
            open={isVoiceModalOpen}
            onClose={() => setIsVoiceModalOpen(false)}
            onSave={handleSaveVoice}
          />
        )}




    </div>
  )
}

export default Tasks;