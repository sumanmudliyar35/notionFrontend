import type { ColumnDef } from "@tanstack/react-table";
import  { CustomTable } from "../../components/customTable/CustomTable"
import React, { useEffect, useState, useMemo, useRef, useCallback } from "react";
import { useGetLeadsByUser } from "../../api/get/getLeadsByUser";
import { useCreateLead } from "../../api/post/newLead";
import { useUpdateLead } from "../../api/put/updateLead";
import * as styled from './style';
import { Button, Input, message, Select } from "antd";
import EventModal from "./components/EventModal/EventModal";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import CommentModal from "./components/CommentModal/CommentModal";
import { useGetAllUsers } from "../../api/get/getAllMember";
import MentionModal from "./components/MentionModal/MentionModal";
import CustomTag from "../../components/customTag/CustomTag";
import { useGetAllReferences } from "../../api/get/getAllReference";
import CustomSelect from "../../components/customSelect/CustomSelect";
import { useGetAllShoots } from "../../api/get/getAllShoot"; // <-- Add this import
import VoiceModal from "./components/VoiceModal/VoiceModal"; // adjust path if needed
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
import DescriptionCell from "./components/DescriptionCell/DescriptionCell";
import MuiInputWithDate from "../../components/MuiDatePicker/MuiInputWithDate";
import Mui2InputWithDate from "../../components/Mui2InputWithDate/Mui2InputWithDate";
import { createPortal } from "react-dom";


import CommentCell from "./components/CommentCell/CommentCell";
// import CommentCell from "../tasks/components/CommentCell/CommentCell";
import DateTimeModal from "./components/DateTimeModal/DateTimeModal";
import ReminderModal from "../../components/reminderModal/ReminderModal";
import { useCreateReminder } from "../../api/post/newReminder";
import DateInput from "../../components/CustomDateInput/CustomDateInput";
import dayjs from "dayjs";
import { useGetLeadsTablePreference } from "../../api/get/getLeadstablePreference";
import { useUpdateUsersTablePreference } from "../../api/put/updateUsersTablePreference";
import { useDownloadLeadsCSV } from "../../api/get/getLeadsCSV";
import Papa from "papaparse"; // Add at the top if not already imported
import { useUpdateBulkUsersTablePreference } from "../../api/put/updateBulkUpdateUsersTablePreference";
import CustomSelectWithAllOption from "../../components/CustomSelectWithAllOption/CustomSelectWithAllOption";
import { useUpdateMention } from "../../api/put/updateMention";
import CustomChip from "../../components/customChip/CustomChip";
import { useUpdateBulkLead } from "../../api/put/updateBulkLead";
import { formatDisplayDate } from "../../utils/commonFunction";
import { usePostGetCommentByLead } from "../../api/get/postGetCommentByLead";
import { useCreateComment } from "../../api/post/newComment";
import SharedCommentModal from "../../components/SharedCommentModal/SharedCommentModal";
import { useCreateEvent } from "../../api/post/newEvent";
import { usePostGetEventByLead } from "../../api/get/postGetEventsByLead";
import EventCell from "./components/EventCell/EventCell";
import CustomSwitch from "../../components/customSwitch/CustomSwitch";




interface Doc {
  id: any;
  name: string;
  category: string;
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
  
}




const DROPDOWN_HEIGHT = 150; // px



const Leads = () => {

  const userid = Number(localStorage.getItem('userid'));
  const roleid = localStorage.getItem('roleid');

    const {data: LeadsData, refetch: refetchLeadsData} = useGetLeadsByUser(Number(userid));

    const {data: leadsTablePreference, refetch: refetchLeadsTablePreference} = useGetLeadsTablePreference(userid);


 


    const columnWidthMap = useMemo(() => {
  if (!leadsTablePreference) return {};
  return leadsTablePreference.reduce((acc: any, pref: any) => {
    acc[pref.accessorKey] = pref.width;
    acc[pref.orderId] = pref.orderId;
    return acc;
  }, {});
}, [leadsTablePreference]);

    const {data: allMembersData} = useGetAllUsers();
    const { data: allReferencesData } = useGetAllReferences();
    const { data: allShootsData } = useGetAllShoots();

  // Store userId and name in state
  const [assigneeOptions, setAssigneeOptions] = useState<{ label: string; value: any }[]>([]);
  const [referenceOptions, setReferenceOptions] = useState<{ label: string; value: string }[]>([]);

  const [filtersEnabled, setFiltersEnabled] = useState<boolean>(true);

  const leadsOption =[
    {label: 'Excited', value: 'excited'},
     { label: 'Warm', value: 'warm' },
      { label: 'Cold', value: 'cold' },
  ]
  const [shootOptions, setShootOptions] = useState<{ label: string; value: string }[]>([]);

  const [editingEventCell, setEditingEventCell] = useState<{ rowId: any; eventId: any } | null>(null);
    const [columnSizing, setColumnSizing] = useState({});

    const inputRef = useRef<HTMLInputElement>(null);

    const eventInputRef = useRef<HTMLInputElement>(null);



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
    if (allReferencesData) {
      setReferenceOptions(
        allReferencesData
          .filter((ref: any) => ref.name && ref.id)
          .map((ref: any) => ({
            label: ref.name,
            value: ref.id,
          }))
      );
    }
  }, [allReferencesData]);

  useEffect(() => {
    if (allShootsData) {
      setShootOptions(
        allShootsData
          .filter((shoot: any) => shoot.name && shoot.id)
          .map((shoot: any) => ({
            label: shoot.name,
            value: shoot.id,
          }))
      );
    }
  }, [allShootsData]);

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

        const [tableData, setTableData] = useState<any[]>(LeadsData?.data);

        const [selectedLeadId, setSelectedLeadId] = useState<number>();

        const [selectedMentions, setSelectedMentions] = useState<any[]>([]);

        const [editingEvent, setEditingEvent] = useState<{ rowId: any; eventId: any } | null>(null);
const [editingEventValue, setEditingEventValue] = useState<any>({});

        const [selectedMentionLeadId, setSelectedMentionLeadId] = useState<number>();

        const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);

        const [isTimeDateModalOpen, setIsTimeDateModalOpen] = useState(false);  

        const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
        const [selectedVoiceRow, setSelectedVoiceRow] = useState<any>(null);

        const [editingComment, setEditingComment] = useState<{ rowId: any; commentId: any } | null>(null);
const [editingCommentValue, setEditingCommentValue] = useState<string>('');


 const {data: eventList, refetch: refetchEventList} = useGetAllEventList();
const [eventOptions, setEventOptions] = useState<{ label: string; value: string }[]>([]);

useEffect(() => {
  if (eventList && Array.isArray(eventList)) {
    setEventOptions(
      eventList?.map((event: any) => ({
        label: event?.eventName,
        value: event?.id,
      }))
    );
  }
}, [eventList]);

        useEffect(()=>{
          console.log("suman");
          setTableData(LeadsData?.data)

        },[LeadsData]);


//         useEffect(() => {
//   if (!editingComment) {
//     console.log("Setting table data from LeadsData");
//     setTableData(LeadsData?.data);
//   }
// }, [LeadsData, editingComment]);

       const openEventModal = useCallback((id: any) => {
  setSelectedLeadId(id);
  setIsEventModalOpen(true);
}, []);

const openCommentModal = useCallback((data: any) => {
  setSelectedLeadId(data.id);
  setIsCommentModalOpen(true);
}, []);

  const openMentionModal = (rowData: Doc) => {
          let mentions = rowData.mentions;
  if (!Array.isArray(mentions)) {
    try {
      mentions = mentions && typeof mentions === 'string' ? JSON.parse(mentions) : [];
    } catch {
      mentions = "";
    }
  }
  setSelectedMentionLeadId(rowData?.id);
  setSelectedMentions(Array.isArray(mentions) ? mentions : []); // Store the current mentions as array
  setIsMentionModalOpen(true);
  };

  const openVoiceModal = (rowData: Doc) => {
          setSelectedVoiceRow(rowData);
          setIsVoiceModalOpen(true);
  };


  const handleOpenReminderModal = (rowId: any, reminder: any) => {
    setSelectedLeadId(rowId);
    setIsReminderModalOpen(true);
  };

  const useUpdateCommentMutate = useUpdateComment();

  const usePostGetComment = usePostGetCommentByLead();

  const handleEditComment = async(rowId: any, commentId: any, commentText: string, mentionedMember: any) => {

    console.log("Editing comment:", rowId, commentId, commentText, mentionedMember);
    // setEditingComment({ rowId, commentId });
    const body={
      comment: commentText,
      mentionedMember: mentionedMember,
    }
    const response = await useUpdateCommentMutate.mutateAsync([body, commentId, userid]);
    // refetchLeadsData();
    const commentsResponse = await usePostGetComment.mutateAsync([rowId]);
    setTableData(prev =>
      prev.map(row =>
        row.id === rowId ? { ...row, comments: commentsResponse } : row
      )
    );
    setEditingComment(null);


  
  };


  const useDeleteCommentMutate = useDeleteComment();

const handleDeleteComment = async (rowId: any, commentId: any) => {
  const body={
    deletedAt: new Date()
  }
  console.log("commentid", commentId)
  const reponse = await useDeleteCommentMutate.mutateAsync([body,commentId]);
 const commentsResponse = await usePostGetComment.mutateAsync([rowId]);
      setTableData(prev =>
        prev.map(row =>
          row.id === rowId ? { ...row, comments: commentsResponse } : row
        )
      );



}


const updateMentionMutate = useUpdateMention();
const handleRemoveTags=async ( userid: any, leadId: any) => {
  const body = {
    deletedAt: new Date(),
   
  };
  await updateMentionMutate.mutateAsync([body, userid, leadId, "tag"]);
  refetchLeadsData();
}


const [editingRow, setEditingRow] = useState<any>(null);
const [editingRowValue, setEditingRowValue] = useState<any>({});


const handleOpenDateTimeModal = (row: any, date: any, time: any) => {
  setEditingRow(row);
  setEditingRowValue({ date, time });
  setIsTimeDateModalOpen(true)
};

const handleDescriptionChange = async (value: string, rowId: any, mentionedMembers: any[] ) => {
  console.log("Description changed for row:", rowId, "New value:", value);
  const body = {
    description: value,
    mentionedMembers: mentionedMembers

  };

  const response = await updateLeadMutate.mutateAsync([body,rowId, userid]);

  setTableData(prev =>
    prev.map(row =>
      row.id === rowId ? { ...row, description: value } : row
    )
  );




}

const updateEventMutate = useUpdateEvent();

const handleUpdateEvent = async (rowId: any, eventId: any, eventData: any) => {
  // const body = {  
  //   date: eventData.eventDate,
  //   eventName: eventData.eventName, 
  //   numberOfGuests: eventData.noOfGuests,
  //   note: eventData.note,
  //   crew: eventData.crew,
  //   eventListId: eventData.eventListId, // Ensure this is included
  // }

  const body = {
  date: eventData.eventDate,
  others: eventData.others,
  eventName: eventData.eventListId == 4 ? null : eventData.eventName,
  numberOfGuests: eventData.noOfGuests,
  note: eventData.note,
  crew: eventData.crew,
  eventListId: eventData.eventListId,
  eventIds: eventData.allEvents?.map((event: any) => event).join(',') || '', // returns "3,1" or ""  ...(eventData.eventListId == 4 && { others: eventData.eventName }),
};
  await updateEventMutate.mutateAsync([body, eventId]);
  refetchLeadsData();
};

const deleteEventMutate = useDeleteEvent();

const handleDeleteEvent = async (rowId: any, eventId: any) => {
  try {
    const body = {
      deletedAt: new Date(),
    };
    await deleteEventMutate.mutateAsync([body, eventId]);
    const eventsResponse = await getEventByLeadId.mutateAsync([rowId]);
    setTableData(prev =>
      prev.map(row =>
        row.id === rowId ? { ...row, eventData: eventsResponse } : row
      )
    );


  } catch (error) {
    console.error("Failed to delete event:", error);
  }
};






  const createEventMutate = useCreateEvent();

  const getEventByLeadId = usePostGetEventByLead();

const handleAddEvent = async (eventData: any, rowId: any) => {




 
  await createEventMutate.mutateAsync([eventData, rowId]);
  const eventsResponse = await getEventByLeadId.mutateAsync([rowId]);
  setTableData(prev =>
    prev.map(row =>
      row.id === rowId ? { ...row, eventData: eventsResponse } : row
    )
  );


};




  const createCommentMutate = useCreateComment();


const handleComment= async(data: any)=>{

  const body={

        leadId: selectedLeadId,
        comment: data.comment,
        mentionedMembers: data.mentionedMembers,
        givenBy: userid,
        
      }

      const response = await createCommentMutate.mutateAsync([body,userid]);

      const commentsResponse = await usePostGetComment.mutateAsync([selectedLeadId]);
      setTableData(prev =>
        prev.map(row =>
          row.id === selectedLeadId ? { ...row, comments: commentsResponse } : row
        )
      );

}



    const updateLeadMutate = useUpdateLead();

    const updateBulkLeadMutate = useUpdateBulkLead();

const handleDeleteLead = async (allLeads: any) => {
  const now = new Date();



  // Add deletedAt to each lead
  const leadsWithDeletedAt = allLeads.map((lead: any) => ({
    id: lead?.original?.id,
    data: { deletedAt: new Date() },
  }));


  await updateBulkLeadMutate.mutateAsync([leadsWithDeletedAt, userid]);
  refetchLeadsData();
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




  const initialDocs: Doc[] = [
  {
    id: "",
    name: 'Company mission and strategy',
    category: 'Strategy doc',
    createdBy: 'Suman Mudliyar',
    createdAt: 'May 24, 2025 9:43 PM',
    updatedBy: 'Suman Mudliyar',
    updatedAt: 'May 24, 2025 9:43 PM',
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
    eventCount:0,
    commentCount:0,
    reference: '',
    visible: true
  },
];



const columns = useMemo<ColumnDef<Doc>[]>(() => [
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
  header: 'Event',
  accessorKey: 'eventData',
  enableResizing: true ,

  meta: {
    editable: false,
    editorType: 'eventData',
    visible: true,
  },
   cell: ({ row }) => (
    <EventCell
      events={row.original.eventData || []}
      rowId={row.original.id}
      eventOptions={eventOptions}
      openEventModal={openEventModal}
      handleUpdateEvent={handleUpdateEvent}
      handleDeleteEvent={handleDeleteEvent}
    />
  )
// cell: ({ row }) => {
//   const events = row.original.eventData || [];
//   const rowId = row.original.id;

//   // State for editing event (move this to your parent component if you want to edit only one event at a time for the whole table)
//   const [editingIdx, setEditingIdx] = useState<number | null>(null);
//   const [localEditValue, setLocalEditValue] = useState<any>(null);

//   // When entering edit mode, set the local edit value
//   const startEdit = (event: any, idx: number) => {
//     setEditingIdx(idx);


//     setLocalEditValue({
//       eventDate: event?.eventDate,
//       // eventName: event?.eventName || '',
//             others: event?.eventName || '',

//       allEvents: event?.allEvents || [], // Use allEvents to store multiple selected events
//       eventId: event?.eventId || null,
//       noOfGuests: event?.noOfGuests,
//       note: event?.note || '',
//       crew: event?.crew || '',
//       eventListId: event?.eventListId || null, // Add this line to handle eventListId
//     });
//   };

//   // When saving, call your handler and reset editing state
//   const saveEdit = async (eventId: any) => {


//     await handleUpdateEvent(rowId, eventId, localEditValue);
//     setEditingIdx(null);
//     setLocalEditValue(null);
//   };

//   // When canceling, reset editing state
//   const cancelEdit = () => {
//     setEditingIdx(null);
//     setLocalEditValue(null);
//   };

//   return (
//     <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
//       {events.length === 0 && (
//         <span style={{ color: '#aaa' }}>No Events</span>
//       )}
//       {events.map((event: any, idx: number) => {
//         const isEditing = editingIdx === idx;

//         return (
//           <div
//             key={event.eventId || idx}
//             style={{
//               borderBottom: '1px solid #eee',
//               paddingBottom: 2,
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'space-between',
//             }}
//           >
//             {isEditing ? (
//               <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%' }}>
//                 {/* <Mui2InputWithDate
//                   name="eventDate"
//                   value={localEditValue.eventDate}
//                   onChange={e =>
//                     setLocalEditValue((prev: any) => ({
//                       ...prev,
//                       eventDate: e.target.value,
//                     }))
//                   }
//                   placeholder="Select date"
//                   required={false}
//                   error={undefined}
//                 /> */}
//                 <DateInput
//   value={localEditValue.eventDate || ''}
//   onChange={date =>
//     setLocalEditValue((prev: any) => ({
//       ...prev,
//       eventDate: date && dayjs(date).isValid() ? date.format('YYYY-MM-DD') : ''
//     }))
//   }
//   placeholder="Select date"
// />



//   <CustomSelectWithAllOption
//   name="eventId"
//   placeholder="Select an event"
//   options={eventOptions}
//   isMulti={true}
//   value={
//     Array.isArray(localEditValue.allEvents)
//       ? eventOptions.filter(option => localEditValue.allEvents.includes(String(option.value)))
//       : []
//   }
//   onChange={(inputValue: any) => {
//     // inputValue will be an array of selected option objects
//     setLocalEditValue((prev: any) => ({
//       ...prev,
//       allEvents: inputValue ? inputValue.map((opt: any) => String(opt.value)) : [],
//     }));
//   }}
// />


// {Array.isArray(localEditValue.allEvents) && localEditValue.allEvents.includes("4") && (
//   <CustomInput
//     placeholder="Event Name"
//     value={localEditValue.others}
//     onChange={e =>
//       setLocalEditValue((prev: any) => ({
//         ...prev,
//         others: e.target.value,
//       }))
//     }
//   />
// )}
//                 <CustomInput
//                   type="number"
//                   placeholder="No. of Guests"
//                   value={localEditValue.noOfGuests}
//                   onChange={e =>
//                     setLocalEditValue((prev: any) => ({
//                       ...prev,
//                       noOfGuests: e.target.value,
//                     }))
//                   }
//                 />
//                 <CustomInput
//                   type="text"
//                   placeholder="No. of Crew"
//                   value={localEditValue.crew}
//                   onChange={e =>
//                     setLocalEditValue((prev: any) => ({
//                       ...prev,
//                       crew: e.target.value,
//                     }))
//                   }
//                 />
//                 <CustomTextArea
//                   value={localEditValue.note}
//                   onChange={val =>
//                     setLocalEditValue((prev: any) => ({
//                       ...prev,
//                       note: val,
//                     }))
//                   }
//                 />
//                 <div>
//                   <Button
//                     size="small"
//                     type="primary"
//                     onClick={() => saveEdit(event.eventId)}
//                     style={{ marginRight: 8 }}
//                   >
//                     Save
//                   </Button>
//                   <Button size="small" onClick={cancelEdit}>
//                     Cancel
//                   </Button>
//                 </div>
//               </div>
//             ) : (
//               <>
//                 <div
//                   style={{ cursor: 'pointer', flex: 1 }}
//                   onClick={() => startEdit(event, idx)}
//                 >
//                   <div>
//                     <b>{ event?.allEventData  || event?.eventName} on</b>{' '}
//                     {formatDisplayDate(event?.eventDate)}
                  
//                   </div>
//              {event.noOfGuests !== undefined && event.noOfGuests !== null && event.noOfGuests !== 0 && (
//   <div>
//     <b>Guests:</b> {event.noOfGuests}
//   </div>
// )}
                
//                   {event.crew && (
//                     <div>
//                       <b>Crew:</b> {event.crew || 0}
//                     </div>
//                   )}
//                   {event.note && (
//                     <div>
//                       <b>Note:</b> {event.note}
//                     </div>
//                   )}
//                 </div>
//                 <Button
//                   size="small"
//                   danger
//                   icon={
//                     <DeleteOutlined
//                       style={{
//                         filter: 'brightness(0.7) grayscale(0.7)',
//                       }}
//                     />
//                   }
//                   onClick={e => {
//                     e.stopPropagation();
//                     handleDeleteEvent(rowId, event.eventId);
//                   }}
//                   style={{
//                     marginLeft: 8,
//                     background: 'lightgray',
//                     borderColor: 'lightgray',
//                   }}
//                 />
//               </>
//             )}
//           </div>
//         );
//       })}
//       <Button
//         size="small"
//         icon={<PlusOutlined />}
//         onClick={() => openEventModal(row.original.id)}
//       />
//     </div>
//   );
// }
},
  {
    header: 'Budget',
    accessorKey: 'amount',
    enableResizing: true ,
    meta: { editable: true },
      enableSorting: true,
    cell: ({ getValue }) => {
     let value = getValue();
  if (typeof value === 'string') {
    // Remove spaces and commas, then parse as number
    value = Number(value.replace(/[\s,]/g, ''));
  }
  return typeof value === 'number' && !isNaN(value)
    ? value.toLocaleString('en-IN', { maximumFractionDigits: 0 })
    : value;
},

  },

            {
      header: 'Created By',
      accessorKey: 'assignedTo', // or 'assignedTo' if that's your field
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
  { header: 'Contact', 
    accessorKey: 'contact',
    meta: { editable: true },
     cell: ( getValue: any) => {
  ;
    return (
      <span style={{ whiteSpace: 'pre-line' }}>
        {getValue.getValue()}
      </span>
    );
  },
 },
  { header: 'Description', 
    accessorKey: 'description', 
    meta: { editable: true },
     cell: ({row}) => {

    const value = row.original.description;
    return (
      // <span style={{ whiteSpace: 'pre-line' }}>
      //   {value}
      // </span>
     <DescriptionCell
      value={value}
      onChange={handleDescriptionChange}
            leadid={row.original.id}
            assigneeOptions={assigneeOptions}


    />

     
    );
  },
 },
  { header: 'Status', accessorKey: 'status',
     meta: {
      editable: true,
      editorType: 'select',
      selectOptions: [
        { label: 'Open', value: 'open' },
        { label: 'Closed', value: 'closed' },
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
    { header: 'Follow up', accessorKey: 'followup',     
      meta: { editorType: 'datetime', // <-- add this
 }
 ,
    cell: (getValue: any) => {
  const { followup, followupTime } = getValue.row.original;
  // if (!followup) return  <span style={{ color: '#888' }}>Set follow up</span>;

  // Combine date and time as a string in local time
  const dateTimeString = `${followup}T${followupTime || '00:00'}`;
  const d = new Date(dateTimeString);


  let displayValue = '';
  if (isNaN(d.getTime())) {
    displayValue = followup;
  } else {
    // Format as DD/MM/YYYY, hh:mm AM/PM (no timezone conversion)
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();

    let hour = d.getHours();
    const minute = String(d.getMinutes()).padStart(2, '0');
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12;
    hour = hour ? hour : 12; // the hour '0' should be '12'

    displayValue = `${day}/${month}/${year}, ${String(hour).padStart(2, '0')}:${minute} ${ampm}`;
  }

  return (
    <span
      style={{ cursor: 'pointer', color: '#fff' }}
      onClick={() =>
        handleOpenDateTimeModal(
          getValue.row.original.id,
          followup,
          followupTime
        )
      }
    >
      {formatDisplayDate(d) || <span style={{ color: '#888' }}>Set follow up</span>}
    </span>
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
      // editingComment={editingComment}
      // setEditingComment={setEditingComment}
      assigneeOptions={assigneeOptions}
    />
  );
}


},
          {
  header: 'Tags',
  accessorKey: 'mentions',
  meta: {
    editable: false,
    // visible: true,
    // editorType: 'select',
    selectOptions: assigneeOptions, // No options needed for tags
    orderId: 14,
    
    
    
  },
  cell: ({ row }) => {
    let mentions = row.original.mentions;

  // Ensure mentions is always an array
  if (!Array.isArray(mentions)) {
    try {
      // Try to parse if it's a JSON string
      mentions = mentions && typeof mentions === 'string' ? JSON.parse(mentions) : [];
    } catch {
      mentions = "";
    }
  }

  return (
    <div
      style={{
        cursor: 'pointer',
        color: '#52c41a',
        minHeight: 32,
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        flexWrap: 'wrap',
      }}
      onClick={() => openMentionModal(row.original)}
    >
      {Array.isArray(mentions) && mentions.length > 0 ? (
        mentions.map((m: any) => (
          <CustomTag key={m.userId} name={m.userName} onClose={() => handleRemoveTags(m.userId, row.original.id)} />
        ))
      ) : (
        <span style={{ color: '#aaa' }}>Tag</span>
      )}
    </div>
  );
},
          },
            { header: 'Converted', accessorKey: 'converted',
               meta: {
      editable: true,
      editorType: 'select',
      selectOptions: [
        { label: 'Yes', value: 'yes' },
        { label: 'No', value: 'no' },
      ],
    }

             },
             {
  header: 'Leads',
  accessorKey: 'leads',
  meta: {
    editable: true,
    editorType: 'select',
    selectOptions:leadsOption,
  },
  
},
              {
  header: 'Reference',
  accessorKey: 'referenceId', // Make sure your data has this field
  meta: {
    editable: true,
    editorType: 'select',
    selectOptions: referenceOptions,
  },
  cell: ({ getValue }) => {
    const value = getValue();
    const option = referenceOptions.find(opt => String(opt.value) === String(value));
    return option ? (
      <CustomTag name={option.label} />
    ) : (
      <span style={{ color: '#aaa' }}>No Reference</span>
    );
  },
},
{
  header: 'Shoot',
  accessorKey: 'shootId',
  meta: {
    editable: true,
    editorType: 'select',
    selectOptions: shootOptions,
  },
  cell: ({ getValue }) => {
    const value = getValue();
    const option = shootOptions.find(opt => String(opt.value) === String(value));
    return option ? (
      <CustomTag name={option.label} />
    ) : (
      <span style={{ color: '#aaa' }}>No Shoot</span>
    );
  },
},
{
  header:"Created On",
  accessorKey: "createdAt",
  cell:({row})=>{
    const value = row.original.createdAt;
    return (formatDisplayDate(value))
  }


}

    
              

        
], [assigneeOptions, referenceOptions, shootOptions, eventOptions]);

// const columnsWithWidth = columns.map((col: any) => ({
//   ...col,
//   size: columnWidthMap[col.accessorKey as string] || col.size || 200,
//   orderId: leadsTablePreference?.find((p: any) => p.accessorKey === col.accessorKey)?.orderId ?? col.orderId,

// }));


const columnsWithWidth = useMemo(() => 
  columns
    .map((col: any) => ({
      ...col,
      size: columnWidthMap[col.accessorKey as string] || col.size || 200,
      orderId: leadsTablePreference?.find((p: any) => p.accessorKey === col.accessorKey)?.orderId ?? col.orderId,
      isVisible: leadsTablePreference?.find((p: any) => p.accessorKey === col.accessorKey)?.isVisible ?? col.isVisible,
    }))
    .sort((a, b) => {
      if (typeof a.orderId === "number" && typeof b.orderId === "number") {
        return a.orderId - b.orderId;
      }
      return 0;
    }),
  [columns, columnWidthMap, leadsTablePreference]
);





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


    const newLeadsMutate = useCreateLead();
    const handleRowCreate = useCallback(async (newRow: Doc) => {
  const body = {
    name: newRow.name,
    createdBy: userid,
    assignedTo: newRow.assignedTo,
  };
  const response = await newLeadsMutate.mutateAsync([body, userid]);
  refetchLeadsData();
}, [userid, newLeadsMutate, refetchLeadsData]);



    const handleRowEdit = useCallback(async (updatedRow: Doc, rowIndex: number) => {
      const body = {
               name: updatedRow?.name,
               contact:updatedRow.contact,
               status: updatedRow.status,
               converted: updatedRow.converted,
               mentionedMembers:[],
              amount: (() => {
  if (typeof updatedRow.amount === 'number') {
    return updatedRow.amount.toLocaleString('en-IN');
  }
  if (typeof updatedRow.amount === 'string') {
    // Remove commas/spaces, parse as number, then format
    const num = Number((updatedRow.amount !== undefined && updatedRow.amount !== null ? updatedRow.amount : '').toString().replace(/[\s,]/g, ''));
    return !isNaN(num) ? num.toLocaleString('en-IN') : updatedRow.amount;
  }
  return updatedRow.amount;
})(),
               leads: updatedRow.leads,
               followup: updatedRow.followup,
               assignedTo: updatedRow.assignedTo,
               referenceId: updatedRow.referenceId || null, // Ensure this matches your API
               shootId: updatedRow.shootId || null, // <-- Add this line
      };



      const response = await updateLeadMutate.mutateAsync([body, updatedRow.id, userid]);

      console.log("Response from updateLeadMutate:", response);

setTableData(prev =>
    prev.map(row =>
      row.id === response.id ? { ...row, ...response } : row
    )
  );
      // refetchLeadsData();

    }, [userid, updateLeadMutate]);


    const handleRowDelete = useCallback(async (rowIndex: number) => {
  const leadId = tableData[rowIndex].id;
  if (!leadId) return;
  await updateLeadMutate.mutateAsync([{deletedAt: new Date(), mentionedMembers: []}, leadId, userid]);
  refetchLeadsData();
}, [tableData, updateLeadMutate, userid, refetchLeadsData]);



    const handleFollowupChange = async (date: any,time: any, leadID: any) => {
      const body = {
        followup: date ,
        followupTime: time,
        mentionedMembers: [],
      };
      try {
        await updateLeadMutate.mutateAsync([body, leadID, userid]);

        refetchLeadsData();
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

    const result = await updateBulkUsersTablePreferences.mutateAsync([orderPayload, "lead", userid]);
      refetchLeadsTablePreference();
      
      // setColumns(updatedColumns);
      // onColumnOrderChange?.(newOrder);
    };


    const handleColumnVisibility = async (columnKey: string, isVisible: boolean) => {



      };



    



const reminderMutate = useCreateReminder();

    const handleReminderChange = async (date: any, time: any, leadID: any, title: any) => {

      const body = {
        reminderDate: date,
        reminderTime: time,
        leadId: selectedLeadId,
        userId: userid,
        message: title,
      };
      try {
        await reminderMutate.mutateAsync([body, selectedLeadId]);
        refetchLeadsData();
        setSelectedLeadId(0);
        setIsReminderModalOpen(false);
      } catch (error) {
        console.error("Error creating reminder:", error);
      }
    };

    const savedFiltersValue = useMemo(() => {
  const filters = localStorage.getItem('leadsFilters');
  return filters ? JSON.parse(filters) : {};
}, []);

const savedActiveFiltersValue = useMemo(() => {
  const activeFilters = localStorage.getItem('leadsActiveFilters');
  return activeFilters ? JSON.parse(activeFilters) : [];
}, []);

const [filters, setFilters] = useState<Record<string, string | string[]>>(savedFiltersValue);
const [activeFilters, setActiveFilters] = useState<string[]>(savedActiveFiltersValue);

    


  

    const filterableKeys = [
  "status",
  "referenceId",
  "followup",
  "mentions",
  "converted",
  "eventData",
  "leads",
  "shootId",

];

// const availableFilterColumns = columns.filter(
//   (col: any) =>
//     col.meta?.editable &&
//     !activeFilters.includes(col.accessorKey as string)
// );

const availableFilterColumns = useMemo(() => 
  columns.filter((col: any) =>
    filterableKeys.includes(col.accessorKey as string) &&
    !activeFilters.includes(col.accessorKey as string)
  ),
  [columns, activeFilters]
);

const handleFilterChange = useCallback((key: string, value: any) => {
  setFilters((prev) => ({
    ...prev,
    [key]: value,
  }));
}, []);

const handleAddFilter = useCallback((columnKey: any) => {
  console.log("Adding filter for column:", columnKey);
  if (columnKey.value === 'referenceId') {
    setFilters(prev => ({ ...prev, referenceId: [] }));
  }
  setActiveFilters((prev) => [...prev, columnKey.value]);
}, []);

useEffect(() => {
  localStorage.setItem('leadsFilters', JSON.stringify(filters));
}, [filters]);

useEffect(() => {
  localStorage.setItem('leadsActiveFilters', JSON.stringify(activeFilters));
}, [activeFilters]);


const createVoiceRecordMutation  = useCreateVoiceRecord();
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
      leadId: selectedVoiceRow?.id, // assuming you have this
      createdBy: userid, // or get it from auth/user state
    }, {
      onSuccess: () => {
        refetchLeadsData();
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

  const [isColumnModalOpen, setIsColumnModalOpen] = useState(false);



const handleRemoveFilter = useCallback((key: string) => {
  setFilters((prev) => {
    const newFilters = { ...prev };
    delete newFilters[key];
    return newFilters;
  });

  setActiveFilters((prev: string[]) => prev.filter((k) => k !== key));
}, []);
// Filter tableData based on filters



const dateOption =[
  { label: 'Before', value: 'before' },
          { label: 'After', value: 'after' },
          { label: 'On Date', value: 'on' },
          { label: 'In Between', value: 'between' },
]




const filteredData = React.useMemo(() => {

    if (!filtersEnabled) return tableData;


   const hasActiveFilters = Object.values(filters).some(val => val !== undefined && val !== null && val !== '');
  if (!hasActiveFilters) return tableData;

console.log("Filters", hasActiveFilters, filters);

  return tableData?.filter((row) => {

  const eventDateFilter = filters['eventData'];

  const eventTypeOption = dateOption.find(opt => opt.value === filters.eventType);

  const eventTypeFilter = filters.eventType

    const followupType = filters.followupType;

  return Object.entries(filters).every(([key, val]) => {


    // Event Data filter



    if (key === 'eventData' || key ==="eventDataStart" || key === "eventDataEnd") {




            if (!eventTypeFilter || !val) return true;


      const eventDates = (row.eventData || []).map((e: any) => e.eventDate?.slice(0, 10));



      if (!eventDates.length || !filters.eventType) return false;


      if (eventTypeFilter === 'before') {
return eventDates.some((d: any) => {
    if (!d || !val) return false;
    const dateD = new Date(d);
    // const dateVal = new Date(val);
    const dateVal = Array.isArray(val) ? new Date(val[0]) : new Date(val);

    if (isNaN(dateD.getTime()) || isNaN(dateVal.getTime())) return false;
    return dateD < dateVal;
  });      }
      if (eventTypeFilter === 'after') {
return eventDates.some((d: any) => {
  if (!d || !val) return false;
  const dateD = new Date(d);
const dateVal = Array.isArray(val) ? new Date(val[0]) : new Date(val);  if (isNaN(dateD.getTime()) || isNaN(dateVal.getTime())) return false;
  return dateD > dateVal;
});        }
      if (eventTypeFilter === 'on') {
        return eventDates.some((d: any) => d && d === val);
      }
      if (eventTypeFilter === 'between') {
        const start = filters.eventDataStart;
        const end = filters.eventDataEnd;
        if (!start || !end) return true; // Don't filter if both not set
        return eventDates.some((d: any) => d && d >= start && d <= end);
      }
      // return true;
    }

    // Followup filter

  
    if (key === 'followup' || key === 'followupType' || key ==='followupStart' || key ==="followupEnd") {
            if (!followupType || !val) return true;

      const followupDate = row.followup?.slice(0, 10);




 

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

    


      if (followupType === 'before' && filters.followup) {


        return followupDate < filters.followup;
      }
      if (followupType === 'after' && filters.followup) {

        return followupDate > filters.followup;
      }
      if (followupType === 'on' && filters.followup) {
                console.log("followupDate", followupDate, "filters.followup", filters.followup, followupDate=== filters.followup);

        return followupDate === filters.followup;
      }
      return true;
    }

    // ...rest of your filters...
    if (key === 'eventType') return true;



    if (key === 'assignedTo') {
      if (Array.isArray(val)) {
        // If val is an array, check if any value matches
        return val.some(v => String(row[key as keyof Doc] || '').includes(String(v)));
      }
      return val ? String(row[key as keyof Doc] || '').includes(String(val)) : true;
    }
    if (key === 'mentions') {

      console.log("Row mentions", row, "val", val);
      return Array.isArray(row.mentions)
  ? row.mentions.some((m: any) =>
      m.userId && String(m.userId).includes(String(val))
    )
  : false;
    }

    if (key === 'referenceId') {
  if (Array.isArray(val) && val.length > 0) {
    return val.includes(row.referenceId);
  }
  return true;
}

if(key === 'shootId') {
  if (Array.isArray(val) && val.length > 0) {

    return val.includes(row.shootId);
  }
}

if(key === 'leads') {
  if (Array.isArray(val) && val.length > 0) {

    return val.includes(row.leads);
  }
}


    return val
      ? String(row[key as keyof Doc] || '').toLowerCase().includes(String(val).toLowerCase())
      : true;
  });
});
}, [tableData, filters, filtersEnabled]);


  const updateTablePreferences = useUpdateUsersTablePreference();

  const handleColumnResize = (columnId: string, newSize: number) => {
    const body={
      width: newSize,

    }
    
const response = updateTablePreferences.mutateAsync([body, columnId,"lead", userid]);

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
  const updatedResult = await updateTablePreferences.mutateAsync([body, columnKey, "lead", userid]);

  refetchLeadsTablePreference();

}










  return (
    <div>



<styled.FilterAndSwitchContainer>


      <CustomSwitch
    enabled={filtersEnabled} 
    onChange={(enabled) => setFiltersEnabled(enabled)} 
  />

<styled.FiltersDiv disabled={!filtersEnabled}>

  {activeFilters.map((key: any) => {
    const col = columns.find((c: any) => c.accessorKey === key);
    if (!col) return null;

    const meta: { editorType?: string; selectOptions?: Array<{ label: string; value: any }> } = col.meta || {};

  if (key === 'followup') {
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
  if (key === 'followup') {
    handleRemoveFilter('followup');
    handleRemoveFilter('followupType');
    handleRemoveFilter('followupStart');
    handleRemoveFilter('followupEnd');

    
  } else if (key === 'followupType') {
    handleRemoveFilter('followupType');
    handleRemoveFilter('followup');
     handleRemoveFilter('followupStart');
    handleRemoveFilter('followupEnd');

  } else if (key === 'eventData') {
    handleRemoveFilter('eventData');
    handleRemoveFilter('eventType');
    handleRemoveFilter('eventDataStart');
    handleRemoveFilter('eventDataEnd');
  } else if (key === 'eventType') {
    handleRemoveFilter('eventType');
    handleRemoveFilter('eventData');
    handleRemoveFilter('eventDataStart');
    handleRemoveFilter('eventDataEnd');
  } else {
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
    if (key === 'eventData') {
      const eventType = filters.eventType
      return (
        <styled.FilterTag key={key} active={!!filters[key]} style={{ background: 'rgb(25, 25, 25)',  }}>
           <span style={{ color: '#bbb', marginRight: 6, fontWeight: 500, minWidth: "fit-content" }}>
    {col.header?.toString()}:
  </span>
          <CustomSelect
            size="small"
            style={{ width: 100, marginRight: 8, background: 'rgb(25, 25, 25)' }}
            value={dateOption?.find(opt => opt.value === eventType) || null}

            onChange={val => setFilters(prev => ({ ...prev, eventType: val.value }))}
            options={[
              { label: 'Before', value: 'before' },
              { label: 'After', value: 'after' },
              { label: 'On Date', value: 'on' },
              { label: 'In Between', value: 'between' }
            ]}
          />
          {eventType === 'between' ? (
            <>


              <styled.singleDateDiv>
              
              <DateInput
  value={filters.eventDataStart || ''}
  onChange={date =>
    setFilters(prev => ({
      ...prev,
      eventDataStart: date && dayjs(date).isValid() ? date.format('YYYY-MM-DD') : ''
    }))
  }
  placeholder="Start date"
/>
              

              </styled.singleDateDiv>

              <styled.singleDateDiv>

              
            

              <DateInput
  value={filters.eventDataEnd || ''}
  onChange={date =>
    setFilters(prev => ({
      ...prev,
      eventDataEnd: date && dayjs(date).isValid() ? date.format('YYYY-MM-DD') : ''
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
  if (key === 'followup') {
    handleRemoveFilter('followup');
    handleRemoveFilter('followupType');

    
  } else if (key === 'followupType') {
    handleRemoveFilter('followupType');
    handleRemoveFilter('followup');

  } else if (key === 'eventData') {
    handleRemoveFilter('eventData');
    handleRemoveFilter('eventType');
    handleRemoveFilter('eventDataStart');
    handleRemoveFilter('eventDataEnd');
  } else if (key === 'eventType') {
    handleRemoveFilter('eventType');
    handleRemoveFilter('eventData');
     handleRemoveFilter('eventDataStart');
    handleRemoveFilter('eventDataEnd');
  } else {
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

{key === 'referenceId' || key ==="shootId" || key ==="leads" || key ==="mentions" ? (
  <CustomSelect
    placeholder={col.header?.toString()}
    isMulti={true}
    value={meta?.selectOptions?.filter((opt: any) =>
      Array.isArray(filters[key]) ? filters[key].includes(opt.value) : false
    )}
    onChange={(options: any[]) =>
      handleFilterChange(key, options ? options.map(opt => opt.value) : [])
    }
    options={meta?.selectOptions || []}
  />
) 

     : meta?.editorType === 'select' ? (
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
        onChange={(e) => handleFilterChange(key, e.target.value)}
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


</styled.FilterAndSwitchContainer>



        
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
    handleColumnResize(columnId, newSizing[columnId]);
    
  }}
  onRowDelete={handleRowDelete} // ✅ added
  onColumnOrderChange={handleColumnOrder} // ✅ added
  downloadData={downloadCSV}
  isDownloadable={true}
  handleColumnVisibilityChange={handleColumnVisibilityChange}
   onSelectionChange={handleDeleteLead}

        />




        {isEventModalOpen && (
          <EventModal
          open={isEventModalOpen}
        onClose={() => setIsEventModalOpen(false)}
        title="Add Events"
        leadId={selectedLeadId || 0}
        refetch={[]}
        onSave={handleAddEvent}
      />
        )}


           {isCommentModalOpen && (
          <SharedCommentModal
        open={isCommentModalOpen}
        onClose={() => setIsCommentModalOpen(false)}
        title="Add Comments"
        Id={selectedLeadId || 0}
        refetch={refetchLeadsData}
        assigneeOptions={assigneeOptions}
        onSave={handleComment}
    
          />
        )}

        {isMentionModalOpen && (
  <MentionModal
    open={isMentionModalOpen}
    onClose={() => setIsMentionModalOpen(false)}
    title="Tag Someone"
    leadId={selectedMentionLeadId || 0}
    refetch={refetchLeadsData}
        mentions={selectedMentions} // Pass the tagged users here

  />
)}


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
    leadID={selectedLeadId}
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

export default Leads