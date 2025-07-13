import type { ColumnDef } from "@tanstack/react-table";
import  { CustomTable } from "../../components/customTable/CustomTable"
import React, { useEffect, useState, useMemo, useRef, useCallback } from "react";
import { useGetLeadsByUser } from "../../api/get/getLeadsByUser";
import { useCreateLead } from "../../api/post/newLead";
import { useUpdateLead } from "../../api/put/updateLead";
import * as styled from './style'
import { Badge, Button, DatePicker, Input, message, Select } from "antd";
import { DeleteOutlined, PlusOutlined, UploadOutlined } from "@ant-design/icons";
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
import { useLocation, useParams } from 'react-router-dom';
import { useGetTaskTablePreference } from "../../api/get/getTaskTablesPreference";
import { useUpdateBulkTask } from "../../api/put/updateBulkTask";
import { usePostGetByTask } from "../../api/get/postGetCommentByTask";
import { useCreateAttachment } from "../../api/post/newAttachment";
import { formatDisplayDate } from "../../utils/commonFunction";
import TagSelector from "../../components/customSelectModal/CustomSelectModal";
import TagMultiSelector from "../../components/CustomMultiSelectModal/CustomMultiSelectModal";
import CustomSwitch from "../../components/customSwitch/CustomSwitch";
import { usepostGetTaskAttachmentByTask } from "../../api/get/postGetTaskAttachmentByTask";
import { useCreateMultipleAttachments } from "../../api/post/newMultipleAttachments";
import { TaskCustomTable } from "./components/TaskCustomTable/TaskCustomTable";




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

       const [currentPage, setCurrentPage] = useState(0);

        const [tableData, setTableData] = useState<any[]>([]);

         const location = useLocation();
        
             const [highlightRowId, setHighlightRowId] = useState<number | null>(null);
        
          useEffect(() => {
            if (location.state && location.state.highlightRowId) {
              setHighlightRowId(location.state.highlightRowId);
              setTimeout(() => {
                setHighlightRowId(null); // Clear highlight after 5 seconds
              },3000);
            }
          }, [location.state]);


            const savedActiveFiltersValue = useMemo(() => {
      const activeFilters = localStorage.getItem('tasksActiveFilters');
      return activeFilters ? JSON.parse(activeFilters) : [];
    }, []);

     const savedFiltersValue = useMemo(() => {
      const filters = localStorage.getItem('tasksFilters');
      return filters ? JSON.parse(filters) : {};
    }, []);

    const [filters, setFilters] = useState<Record<string, string | string[]>>(savedFiltersValue);
    const [activeFilters, setActiveFilters] = useState<string[]>(savedActiveFiltersValue);
    
    const savedEnabledFiltersValue = useMemo(() => {
      const enabledFilters = localStorage.getItem('leadsEnabledFilters');
      return enabledFilters ? JSON.parse(enabledFilters) : {};
    }, []);
    
    const [enabledFilters, setEnabledFilters] = useState<Record<string, boolean>>(savedEnabledFiltersValue);
    
        

    const {data: TaskData, refetch: refetchTasksData} = useGetTasksByUser(Number(userid), offset, filters, enabledFilters);

    const {data: taskTablePreference, refetch: refetchTaskTablePreference} = useGetTaskTablePreference(userid);

    useEffect(() => {
  if (TaskData?.data) {
    console.log("TaskData:", offset);
    setTableData(prev => {
      if (offset === 0) return TaskData.data;
      console.log("Previous Table Data:", prev);
      console.log("Appending TaskData:", Array.isArray(prev), TaskData.data);
      return [...TaskData.data];
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
  const [assigneeOptions, setAssigneeOptions] = useState<{ id: string | number, label: string; value: any }[]>([]);

 

    const [columnSizing, setColumnSizing] = useState({});


     
     



  useEffect(() => {
    if (allMembersData) {
      setAssigneeOptions(
        allMembersData
          .filter((u: any) => u.name && u.userId)
          .map((u: any) => ({
            id: u.userId,
            label: u.name,
            value: u.userId,
          }))
      );
    }
  }, [allMembersData]);

 

  useEffect(() => {
  if (roleid === "3") {
    // Only allow current user as assignee
    // setAssigneeOptions([
    //   {
    //     id: userid,
    //     label: localStorage.getItem('name') || 'You',
    //     value: userid,
    //   },
    // ]);
  } else if (allMembersData) {
    setAssigneeOptions(
      allMembersData
        .filter((u: any) => u.name && u.userId)
        .map((u: any) => ({
          id: u.userId,
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

const [commentsVisible, setCommentsVisible] = useState<boolean>(false);

        const toggleAllCommentsVisibility = useCallback(() => {
          setCommentsVisible(prev => !prev);
        }, []);

        const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);

        const [isTimeDateModalOpen, setIsTimeDateModalOpen] = useState(false);  

        const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
        const [selectedVoiceRow, setSelectedVoiceRow] = useState<any>(null);

        const [editingComment, setEditingComment] = useState<{ rowId: any; commentId: any } | null>(null);





        // useEffect(()=>{
        //   setTableData(TaskData?.data)

        // },[TaskData]);


       


                const createAttachmentMutation = useCreateAttachment();

                const createMultipleAttachmentsMutation = useCreateMultipleAttachments();
        
       

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
    const response = await useUpdateCommentMutate.mutateAsync([body, commentId, loggedInUserId]);

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
  const reponse = await useDeleteCommentMutate.mutateAsync([body,commentId]);
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
            id: u.userId,
            label: u.name,
            value: u.userId,
          }))
      );
    }
  }, [allMembersData]);





  const taskStatusOptions = [
  { id: 'notStarted', label: 'Not Started', value: 'notStarted', color: '#ff4d4f' },      // red
  { id: 'inProgress', label: 'In Progress', value: 'inProgress', color: '#faad14' },     // orange
  { id: 'forApproval', label: 'For Approval', value: 'forApproval', color: '#1890ff' },  // blue
  { id: 'completed', label: 'Done', value: 'completed', color: '#52c41a' },              // green
];


const postGetTaskAttachmentMutate = usepostGetTaskAttachmentByTask();


const columns :ColumnDef<Doc>[] = [
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

  return formatDisplayDate(getValue.getValue());

},
  },
    {
      header: 'Created By',
      accessorKey: 'createdBy', // or 'assignedTo' if that's your field
      meta: {
        editable: false,
        // editorType: 'select',
        selectOptions: assigneeOptions,
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
  cell: (row: any) => {
    const dueDateValue = row.row.original.dueDate;
    const createdAtValue = row.row.original.createdAt;
    const currentDate = new Date();
    const [isEditing, setIsEditing] = useState(false);

    const [selectedDate, setSelectedDate] = useState<any>(dueDateValue ? dayjs(dueDateValue) : null);
    
      const [isPickerOpen, setIsPickerOpen] = useState(false); // <-- new state

    
    // Function to handle date changes
    const handleDateChange = (date: any) => {

      setSelectedDate(date);
      const formattedDate = date ? date.format('YYYY-MM-DD') : null;
      
      // Update the row data directly
      const updatedTask = {
        ...row.row.original,
        dueDate: formattedDate
      };
      
      // Call your API to update the task
      updateTaskMutate.mutateAsync([
        { dueDate: formattedDate }, 
        row.row.original.id, 
        userid
      ]).then(() => {
        setIsEditing(false);
        setTableData(prev => prev.map(item => item.id === row.row.original.id ? { ...item, dueDate: formattedDate } : item));
      });
    };
    
    // Display editor when in edit mode
    if (isEditing && row.row.original.createdBy === loggedInUserId) {
      return (
        <DatePicker
                   autoFocus

          value={selectedDate}
          onChange={handleDateChange}
          format="DD-MM-YYYY"
          style={{
            width: '100%',
            borderRadius: 4,
            backgroundColor: 'rgb(25, 25, 25)',
            color: 'white',
          }}
        open={isPickerOpen} // <-- control popup
        onOpenChange={(open) => setIsPickerOpen(open)} // <-- handle popup open/close

        
          
          // onBlur={() => setIsEditing(false)}
        />
      );
    }
    
    // Display formatted date when not editing
    if (!dueDateValue) {
      return (
        <span 
          style={{ color: '#aaa', cursor: 'pointer' }}
          onClick={() => {setIsEditing(true),           setIsPickerOpen(true); // <-- open calendar
}}
        >
          Set due date
        </span>
      );
    }
    
    const dueDate = new Date(dueDateValue);
    
    // Calculate difference in days
    const diffTime = dueDate.getTime() - currentDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (isNaN(diffDays)) return '';
    
    if (diffDays >= 0) {
      return (
        <span 
          style={{ color: 'green', fontWeight: 500, cursor: 'pointer' }}
          onClick={() => {setIsEditing(true), setIsPickerOpen(true)}}
        >
          {formatDisplayDate(dueDateValue)} ({diffDays} day{diffDays !== 1 ? 's' : ''})
        </span>
      );
    } else {
      return (
        <span 
          style={{ color: 'red', fontWeight: 500, cursor: 'pointer' }}
          onClick={() => {setIsEditing(true), setIsPickerOpen(true)}}
        >
          {formatDisplayDate(dueDateValue)} ({Math.abs(diffDays)} day{Math.abs(diffDays) !== 1 ? 's' : ''})
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

 
  
//   { header: 'Status', accessorKey: 'status',
//      meta: {
//       editable: true,
//       editorType: 'select',
//       selectOptions: [
//         { label: 'Not Started', value: 'notStarted' },
//         { label: 'In Progress', value: 'inProgress' },
//         { label: 'For Approval', value: 'forApproval' },
//         { label: 'Done', value: 'completed' },
//       ],
//     },
//  },


{
  header: 'Status',
  accessorKey: 'status',
  meta: {
    // editorType: 'select',
    selectOptions:taskStatusOptions,
  },
  cell: ({ row, getValue }) => {
    const value = getValue();
    // const options = [
    //   { id: 'notStarted', label: 'Not Started', value: 'notStarted' },
    //   { id: 'inProgress', label: 'In Progress', value: 'inProgress' },
    //   { id: 'forApproval', label: 'For Approval', value: 'forApproval' },
    //   { id: 'completed', label: 'Done', value: 'completed' },
    // ];
    const options = taskStatusOptions; // Use the predefined options array  

    // You may want to handle the change and update logic here
    const [selected, setSelected] = React.useState<string | number | null>(value as string | number | null);

    const handleChange =async (newValue: string | number | null) => {
      // setSelected(newValue);
      const body={
        status: newValue,
      }
            const response = await updateTaskMutate.mutateAsync([body, row.original.id, userid]);
            setTableData(prev => prev.map(item => item.id === row.original.id ? { ...item, status: newValue } : item));

      // Call your update logic here, e.g. API call or table update
      // Example: updateTaskStatus(row.original.id, newValue);
    };

    return (
      <TagSelector
        options={options}
        value={selected}
        onChange={handleChange}
        placeholder="Select status..."
        allowCreate={false}
        isWithDot={true}
      />
    );
  }
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
      visible={commentsVisible}
      isCommentText={true} // Pass this prop to control text display
    />
  );
}


},

            { header: 'Project', accessorKey: 'project',
               meta: {
      editable: true,
      editorType: 'select',
      selectOptions: [
        { id: 'toStart', label: 'To Start', value: 'toStart' },
        { id: 'ongoing', label: 'Current Working', value: 'ongoing' },
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


                        const triggerMultipleFileUpload = (e: React.MouseEvent) => {
  e.preventDefault();
  e.stopPropagation();
  // Create a new file input element dynamically
  const input = document.createElement('input');
  input.type = 'file';
  input.multiple = true; // <-- allow multiple files
  input.onchange = (e) => {
    const files = (e.target as HTMLInputElement).files;
    if (files && files.length > 0) {
      handleMultipleUpload(files, row.original, row.original.id); // <-- use your multiple upload handler
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
                            
                           
                            
                          
      
                            const response = await createAttachmentMutation.mutateAsync([formData, userid]);

                            const attachmentResponse = await postGetTaskAttachmentMutate.mutateAsync([row.original.id]);
                            setTableData(prev =>
                              prev.map(item => item.id === row.original.id ? { ...item, files: attachmentResponse } : item)
                            );

                            // refetchTasksData();
                            
                            
                          } catch (error) {
                            console.error("Error uploading file:", error);
                            if (error instanceof Error) {
                              console.error("Error message:", error.message);
                            }
                            alert("Failed to upload file. Please try again.");
                          }
                        };


                        const handleMultipleUpload = async (files: FileList, log: any, taskId: any) => {
  try {
    const formData = new FormData();
    // Append all files
    Array.from(files).forEach(file => {
      formData.append("files", file); // "files" should match your backend field for multiple files
    });
    formData.append("taskId", taskId);
    // formData.append("logId", log.id);

    // Use your multiple attachments mutation
    const response = await createMultipleAttachmentsMutation.mutateAsync([formData, userid]);

    const attachmentResponse = await postGetTaskAttachmentMutate.mutateAsync([log.id]);
    setTableData(prev =>
      prev.map(item => item.id === log.id ? { ...item, files: attachmentResponse } : item)
    );

    // refetchTasksData();

  } catch (error) {
    console.error("Error uploading files:", error);
    if (error instanceof Error) {
      console.error("Error message:", error.message);
    }
    alert("Failed to upload files. Please try again.");
  }
};

                        return (
                <div>
                  <Badge count={attachments ? attachments.length : 0}>

                   <Button
                onClick={triggerMultipleFileUpload}
                                  icon={<UploadOutlined />}
                                   style={{ 
                    background: 'white', 
                    border: 'none', 
                    cursor:  'pointer',
                    opacity:  1,
                    height: 24,
                    width: 24,
                  }}

              >
              </Button>

                                </Badge>


{commentsVisible &&(


              attachments && attachments.length > 0 &&  (
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
        project:"ongoing",

      };
      const response = await newTaskMutate.mutateAsync([body, userid]);

  refetchTasksData(); // ADD THIS LINE



    };





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

     
    
 

    const filterableKeys = [
  "status",
  "createdBy",
  "project",
  "dueDate",
  "createdAt",
 

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
    givenBy: loggedInUserId,
  }

  const response = await commentMutate.mutateAsync([body, loggedInUserId]);
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


    const relatedKeys = {
   
      'createdAt': ['createdAt', 'createdAtType', 'createdAtStart', 'createdAtEnd'],


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
// Filter tableData based on filters



const dateOption =[
  { label: 'Before', value: 'before' },
          { label: 'After', value: 'after' },
          { label: 'On Date', value: 'on' },
          { label: 'In Between', value: 'between' },
]

const savedFilterSwitches = useMemo(() => {
  const switches = localStorage.getItem('tasksFilterSwitches');
  return switches ? JSON.parse(switches) : {};
}, []);

const [filterSwitches, setFilterSwitches] = useState<Record<string, boolean>>(savedFilterSwitches);

useEffect(() => {
  localStorage.setItem('tasksFilterSwitches', JSON.stringify(filterSwitches));
}, [filterSwitches]);




const filteredData = React.useMemo(() => {

  const hasActiveFilters = Object.entries(filters).some(([key, val]) => {
    const isEnabled = enabledFilters[key] !== false; // Default to true if not set
    console.log("Checking filter", key, "isEnabled:", isEnabled, "value:", val);
    return isEnabled && val !== undefined && val !== null && val !== '';
  });

console.log("Filters", hasActiveFilters, filters);

  return tableData?.filter((row) => {


    const followupType = filters.followupType;

  return Object.entries(filters).every(([key, val]) => {


    // Event Data filter


   const isEnabled = enabledFilters[key] !== false; // Default to true if not set
      if (!isEnabled) return true;
   


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

     if (key === 'createdAt' || key === 'createdAtType' || key === 'createdAtStart' || key === "createdAtEnd") {
  if (!filters.createdAtType || !val) return true;

  const createdAtDate = row.createdAt?.slice(0, 10);

  if (filters.createdAtType === 'between' && filters.createdAtStart && filters.createdAtEnd) {
    const start = filters.createdAtStart;
    const end = filters.createdAtEnd;
    
    // If no range is set, don't filter
    if (!start || !end) return true;
    
    // If no createdAt date, exclude this row
    if (!createdAtDate) return false;

    // For date-only comparisons, use string comparison (YYYY-MM-DD format)
    return createdAtDate >= start && createdAtDate <= end;
  }

  if (filters.createdAtType === 'before' && filters.createdAt) {
    return createdAtDate <= filters.createdAt;
  }
  
  if (filters.createdAtType === 'after' && filters.createdAt) {
    return createdAtDate >= filters.createdAt;
  }
  
  if (filters.createdAtType === 'on' && filters.createdAt) {
    console.log("createdAtDate", createdAtDate, "filters.createdAt", filters.createdAt, createdAtDate === filters.createdAt);
    return createdAtDate === filters.createdAt;
  }
  
  return true;
}

    




    if (key === 'createdBy') {
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

    console.log("keysuman", key, "val", val, "row[key]", row[key as keyof Doc]);
    return val
      ? String(row[key as keyof Doc] || '').toLowerCase().includes(String(val).toLowerCase())
      : true;
  });
});
}, [tableData, filters, enabledFilters, offset]);


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

    const meta: { editorType?: string; selectOptions?: Array<{ id: string | number; label: string; value: any }> } = col.meta || {};

        const isFilterEnabled = enabledFilters[key] !== false; // Default to true if not set

      const filterSwitch = (
  <CustomSwitch
    enabled={isFilterEnabled}
    onChange={() => {
      // Define related filter keys that should be toggled together
      const relatedKeys = {
        'followup': ['followup', 'followupType', 'followupStart', 'followupEnd'],
        'followupType': ['followup', 'followupType', 'followupStart', 'followupEnd'],
      
        'eventData': ['eventData', 'eventType', 'eventDataStart', 'eventDataEnd'],
        'eventType': ['eventData', 'eventType', 'eventDataStart', 'eventDataEnd'],
        'createdAt': ['createdAt', 'createdAtType', 'createdAtStart', 'createdAtEnd'],

        
      };

      // Get all keys that need to be toggled
      const keysToToggle = relatedKeys[key as keyof typeof relatedKeys] || [key];
      
      // Toggle all related keys
      setEnabledFilters(prev => {
        const newState = { ...prev };
        keysToToggle.forEach(k => {
          newState[k] = !isFilterEnabled;
        });
        
        // Update localStorage immediately
        localStorage.setItem('leadsEnabledFilters', JSON.stringify(newState));
        return newState;
      });
    }}
  />
);

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
   
if (key === 'createdAt') {
  const createdAtType = filters.createdAtType;
  return (
    <styled.FilterTag key={key} active={!!filters[key]} style={{ background: 'rgb(25, 25, 25)' }}>
        <span style={{ color: '#bbb', marginRight: 6, fontWeight: 500, minWidth: "fit-content" }}>
          {col.header?.toString()}:
        </span>
       
      <CustomSelect
        size="small"
        style={{ width: 100 }}
        value={dateOption?.find(opt => opt.value === createdAtType) || null}
        onChange={val => {
          setFilters(prev => ({ ...prev, createdAtType: val.value }));
        }}
        options={dateOption}
      />

      {createdAtType === 'between' ? (
        <>
          <styled.singleDateDiv>
            <DateInput
              value={filters.createdAtStart || ''}
              onChange={date =>
                setFilters(prev => ({
                  ...prev,
                  createdAtStart: date && dayjs(date).isValid() ? date.format('YYYY-MM-DD') : ''
                }))
              }
              placeholder="Start date"
            />
          </styled.singleDateDiv>
          <styled.singleDateDiv>
            <DateInput
              value={filters.createdAtEnd || ''}
              onChange={date =>
                setFilters(prev => ({
                  ...prev,
                  createdAtEnd: date && dayjs(date).isValid() ? date.format('YYYY-MM-DD') : ''
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
          handleRemoveFilter('createdAt');
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

  <styled.FilterHeader>
            <span style={{ color: '#bbb', marginRight: 6, fontWeight: 500 }}>
              {col.header?.toString()}:
            </span>
            {filterSwitch}
          </styled.FilterHeader>


{key === 'status' || key === 'createdBy' ? (
  // <CustomSelect
  //   placeholder={col.header?.toString()}
  //   isMulti={true}
  //   value={meta?.selectOptions?.filter((opt: any) =>
  //     Array.isArray(filters[key]) ? filters[key].includes(opt.value) : false
  //   )}
  //   onChange={(options: any[]) =>
  //     handleFilterChange(key, options ? options.map(opt => opt.value) : [])
  //   }
  //   options={meta?.selectOptions || []}
  // />

  <TagSelector
  options={meta?.selectOptions || []}
value={
              Array.isArray(filters[key])
                ? (filters[key][0] ?? null)
                : filters[key]
            }  onChange={(newVals: any) => handleFilterChange(key, newVals)}
  placeholder={col.header?.toString()}
  allowCreate={false}
  isWithDot={key === 'status' ? true : false}
/>
) 
     : meta?.editorType === 'select' ? (
      // <CustomSelect
      //   placeholder={col.header?.toString()}
      //   isMulti={false}
      //   value={meta?.selectOptions?.find((opt: any) => opt.value === filters[key]) || null}
      //   onChange={(option: any) => handleFilterChange(key, option ? option.value : '')}
      //   options={meta?.selectOptions || []}
       
      // />
      
             <TagSelector
                  options={meta?.selectOptions || []}
                  value={
                    Array.isArray(filters[key])
                      ? (filters[key][0] ?? null)
                      : filters[key]
                  }
                  onChange={(val: any) => handleFilterChange(key, val)}
                  placeholder={col.header?.toString()}
                  allowCreate={false}
      
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

   <styled.CommentToggleButton 
      onClick={toggleAllCommentsVisibility}
      type="button"
    >
      {commentsVisible ? 'Hide Comments' : 'Show Comments'}
    </styled.CommentToggleButton>


</styled.FiltersDiv>


        
        <TaskCustomTable
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
  highlightRowId={highlightRowId}
  onPageChange={(newPage) => {
    console.log("Page changed to:", newPage);
    setOffset(10 * (newPage-1));
    setCurrentPage(newPage);
  }}
  totalDataCount={TaskData?.totalCount}
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