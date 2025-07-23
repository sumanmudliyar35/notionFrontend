import type { ColumnDef } from "@tanstack/react-table";
import  { CustomTable } from "../../components/customTable/CustomTable"
import React, { useEffect, useState, useMemo, useRef, useCallback } from "react";
import { useGetLeadsByUser } from "../../api/get/getLeadsByUser";
import { useCreateLead } from "../../api/post/newLead";
import { useUpdateLead } from "../../api/put/updateLead";
import * as styled from './style';
import { Button, Input, message, Modal, Select } from "antd";
import EventModal from "./components/EventModal/EventModal";
import { DeleteOutlined, EyeInvisibleOutlined, EyeOutlined, PlusOutlined } from "@ant-design/icons";
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
import TagSelector from "../../components/customSelectModal/CustomSelectModal";
import TagMultiSelector from "../../components/CustomMultiSelectModal/CustomMultiSelectModal";
import { useLocation } from "react-router-dom";
import { TaskCustomTable } from "../tasks/components/TaskCustomTable/TaskCustomTable";
import { useCreateMention } from "../../api/post/newMention";
import TagCell from "./components/TagCell/TagCell";
import CustomEditableCell from "../../components/CustomEditableCell/CustomEditableCell";
import LogsModal from "../../components/LogsModal/LogsModal";
import { usePostGetVoiceRecordByLead } from "../../api/get/postVoiceRecordByLead";
import { useGetLeadByFollowup } from "../../api/get/getLeadByFollowup";
import FollowupModal from "./components/FollowupModal/FollowupModal";
import UsersTableLogs from "../../components/UsersTableLogs/UsersTableLogs";




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

        const [offset, setOffset] = useState(0);

        const [limit, setLimit] = useState(100); 
            const [newAddedRow, setNewAddedRow] = useState<any>();
        
  
         const [currentPage, setCurrentPage] = useState(0);

                 const [totalLeads, setTotalLeads] = useState(0);

                 const [openLogsModal, setOpenLogsModal] = useState(false);

                 const [openFollowupModal, setOpenFollowupModal] = useState(false);

                 const [openTablesModal, setOpenTablesModal] = useState(false);



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


    const [filtersEnabled, setFiltersEnabled] = useState<boolean>(true);

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


 const savedEnabledFiltersValue = useMemo(() => {
  const enabledFilters = localStorage.getItem('leadsEnabledFilters');
  return enabledFilters ? JSON.parse(enabledFilters) : {};
}, []);

const [enabledFilters, setEnabledFilters] = useState<Record<string, boolean>>(savedEnabledFiltersValue);

const {data: followupData} = useGetLeadByFollowup();

  const {data: LeadsData, refetch: refetchLeadsData, isFetching: isLeadsDataFetching, isFetched: isLeadsDataFetched} = useGetLeadsByUser(Number(userid), offset, filters, limit);


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
  const [assigneeOptions, setAssigneeOptions] = useState<{ id: string | number; label: string; value: any }[]>([]);
  const [referenceOptions, setReferenceOptions] = useState<{ id: string | number; label: string; value: string }[]>([]);

  const [hiddenCommentRows, setHiddenCommentRows] = useState<Record<string, boolean>>({});


  const [isOffsetLoading, setIsOffsetLoading] = useState(false);
  
          const isOffsetLoadingRef = useRef(false);
  
  useEffect(() => {
    isOffsetLoadingRef.current = isOffsetLoading;
  }, [isOffsetLoading]);

 
  const leadsOption =[
    {id: 'excited', label: 'Excited', value: 'excited'},
     { id: 'warm', label: 'Warm', value: 'warm' },
      { id: 'cold', label: 'Cold', value: 'cold' },
  ]
  const [shootOptions, setShootOptions] = useState<{ id: string | number; label: string; value: string }[]>([]);

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
            id: u.userId,
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
            id: ref.id,
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
            id: shoot.id,
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
        id: userid,
        label: localStorage.getItem('name') || 'You',
        value: userid,
      },
    ]);
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

        const [tableData, setTableData] = useState<any[]>([]);

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
  setOffset(0);
}, []);

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

       useEffect(() => {
  if (LeadsData?.data) {

    setTableData((prevData = []) => {
      // If offset is 0, replace all data
      if (offset === 0){ 
        setTotalLeads(LeadsData?.totalCount || 0);
        
        return LeadsData.data;


      }
      // Otherwise, merge new data with previous, avoiding duplicates
      const existingIds = new Set(prevData.map((i: any) => i?.id));
      const merged = [
        ...prevData,
        ...LeadsData.data.filter((item: any) => !existingIds.has(item.id)),
      ];
      return merged;
    });
    setIsOffsetLoading(false);
    isOffsetLoadingRef.current = false;
  }
}, [LeadsData]);


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

  const openMentionModal =useCallback((rowData: Doc) => {
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
  },[]);

  const openVoiceModal = (rowData: Doc) => {
          setSelectedVoiceRow(rowData);
          setIsVoiceModalOpen(true);
  };

  const toggleCommentsVisibility = useCallback((e: React.MouseEvent, rowId: string) => {
  e.stopPropagation();
  setHiddenCommentRows(prev => ({
    ...prev,
    [rowId]: !prev[rowId]
  }));
}, []);

  const newLeadsMutate = useCreateLead();
    const handleRowCreate = useCallback(async (newRow: Doc) => {
  const body = {
    name: newRow.name,
    createdBy: userid,
    assignedTo: newRow.assignedTo,
  };
  const response = await newLeadsMutate.mutateAsync([body, userid]);
  setTableData(prev => [ { ...newRow, id: response.id }, ...prev]);
  console.log("New row added after:", response.id);
  setNewAddedRow(response.id); // Store the new row ID for potential future use

}, [userid]);






  const handleOpenReminderModal = (rowId: any, reminder: any) => {
    setSelectedLeadId(rowId);
    setIsReminderModalOpen(true);
  };

  const useUpdateCommentMutate = useUpdateComment();

  const usePostGetComment = usePostGetCommentByLead();

  const handleEditComment = async(rowId: any, commentId: any, commentText: string, mentionedMember: any) => {

    // setEditingComment({ rowId, commentId });
    const body={
      comment: commentText,
      mentionedMember: mentionedMember,
    }
    const response = await useUpdateCommentMutate.mutateAsync([body, commentId, userid]);
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
  const reponse = await useDeleteCommentMutate.mutateAsync([body,commentId, userid]);
 const commentsResponse = await usePostGetComment.mutateAsync([rowId]);
      setTableData(prev =>
        prev.map(row =>
          row.id === rowId ? { ...row, comments: commentsResponse } : row
        )
      );



}





const handleAddTags = async (selectedTags: any, rowId: any) => {

  console.log("Selected tags:", selectedTags);    



}


const updateMentionMutate = useUpdateMention();
const handleRemoveTags=async ( userid: any, leadId: any) => {
  const body = {
    deletedAt: new Date(),
   
  };
  await updateMentionMutate.mutateAsync([body, userid, leadId, "tag"]);
  setTableData(prev =>
    prev.map(row =>
      row.id === leadId ? { ...row, mentions: row.mentions.filter((m: any) => m.userId !== userid) } : row
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

const handleDescriptionChange = async (value: string, rowId: any, mentionedMembers: any[] ) => {
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
  await updateEventMutate.mutateAsync([body, eventId, userid]);

   const eventsResponse = await getEventByLeadId.mutateAsync([rowId]);
  setTableData(prev =>
    prev.map(row =>
      row.id === rowId ? { ...row, eventData: eventsResponse } : row
    )
  );
};

const deleteEventMutate = useDeleteEvent();

const handleDeleteEvent = async (rowId: any, eventId: any) => {
  try {
    const body = {
      deletedAt: new Date(),
    };
    await deleteEventMutate.mutateAsync([body, eventId, userid]);
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
        mentionedMembers: data.mentionedUserIds,
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

  // Update the leads with deletedAt
  await updateBulkLeadMutate.mutateAsync([leadsWithDeletedAt, userid]);
  setTableData(prev => prev.filter(item => !allLeads.some((lead: any) => lead.original.id === item.id)));


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

const [commentsVisible, setCommentsVisible] = useState<boolean>(true);

// Add this function to toggle visibility of all comments
const toggleAllCommentsVisibility = useCallback(() => {
  setCommentsVisible(prev => !prev);
}, []);



const columns :ColumnDef<Doc>[]= [
  {
    header: 'Name',
    accessorKey: 'name',

    size: 500,

    meta: { 
      // editable: true 

    },
      enableSorting: true,
      cell: ({ row }) => (
        // <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        //   <span  style={{ whiteSpace: 'pre-line' }}>{row.original.name}</span>

        
         
           
        // </div>



        <CustomEditableCell

      value={row.original.name}
      onSave={async (newValue: string) => {
        // Update the backend and local table data
        const body = { name: newValue };
                setNewAddedRow(null); // Set the newAddedRow to the current row id

        await updateLeadMutate.mutateAsync([body, row.original.id, userid]);
        setTableData(prev =>
          prev.map(item =>
            item.id === row.original.id ? { ...item, name: newValue } : item
          )
        );
      }}
      placeholder="Click to edit"
      isCellActive={newAddedRow === row.original.id} // or true if you want it editable by default
    />
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
      // editable: true,
      // editorType: 'select',
      selectOptions: [
        {id: 'open', label: 'Open', value: 'open' },
        {id: 'closed', label: 'Closed', value: 'closed' },
      ],
    },



    cell: ({ row }) => {

      
      const statusOptions =  [
        {id: 'open', label: 'Open', value: 'open' },
        {id: 'closed', label: 'Closed', value: 'closed' },
      ];
      
    const handleChange = async (value: any) => {
      const body = {  
        status: value,
      };


                const response = await updateLeadMutate.mutateAsync([body,row.original.id, userid]);
      setTableData(prev =>
        prev.map(item => (item.id === row.original.id ? { ...item, status: value } : item))
      );
    };  

       return (
      <TagSelector
        options={statusOptions}
        value={row.original.status || ''}
        onChange={handleChange}
        allowCreate={false}
        horizontalOptions={false}
        isWithDot={false}

      />
    );
      
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
      isCommentText={true}
              visible={commentsVisible} // Pass visibility state to CommentCell

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
        mentions.map((m: any, index: number) => (
          <CustomTag key={index} name={m.userName} onClose={() => handleRemoveTags(m.userId, row.original.id)} />
        ))
      ) : (
        <span style={{ color: '#aaa' }}>Tag</span>
      )}
    </div>
  );


    
    // <TagCell
    //   mentions={row.original.mentions}
    //   assigneeOptions={assigneeOptions}
    //   rowId={row.original.id}
    //   userid={userid}
    //   createMention={createMention}
    //   handleAddTags={handleAddTags}
    //   setTableData={[]}
    //   handleRemoveTags={handleRemoveTags}
    // />
  },



          },
            { header: 'Converted', accessorKey: 'converted',
               meta: {
      // editable: true,
      // editorType: 'select',
      selectOptions: [
        { id: "yes", label: 'Yes', value: 'yes' },
        { id: "no", label: 'No', value: 'no' },
      ],
      
             },
              cell: ({ row }) => {
    const value = row.original.converted;


    const convertedOptions =  [
        { id: "yes", label: 'Yes', value: 'yes' },
        { id: "no", label: 'No', value: 'no' },
      ]



    const option = referenceOptions.find(opt => String(opt.value) === String(value));

      const [selected, setSelected] = React.useState<string | number | null>(value as string | number | null);
    




        const handleChange = async(newValue: string | number | null) => {
          setSelected(newValue);
          const body ={
            converted: newValue || null, // Ensure this matches your API
          }
                const response = await updateLeadMutate.mutateAsync([body,row.original.id, userid]);
                setTableData(prev => prev.map(item => item.id === row.original.id ? { ...item, converted: newValue } : item));

         
        };
  
     return (
      <TagSelector
        options={convertedOptions}
        value={row.original.converted}
        onChange={handleChange}
        allowCreate={false}
        horizontalOptions={false}
        isWithDot={false}

      />
    );
  },

            },
             {
  header: 'Leads',
  accessorKey: 'leads',
  meta: {
    // editable: true,
    // editorType: 'select',
    selectOptions:leadsOption,
  },
    cell: ({ row }) => {
    const value = row.original.leads;

    const option = leadsOption.find(opt => String(opt.value) === String(value));

      const [selected, setSelected] = React.useState<string | number | null>(value as string | number | null);
    




        const handleChange = async(newValue: string | number | null) => {
          setSelected(newValue);
          const body ={
            leads: newValue || null, // Ensure this matches your API
          }
                const response = await updateLeadMutate.mutateAsync([body,row.original.id, userid]);
                setTableData(prev => prev.map(item => item.id === row.original.id ? { ...item, leads: newValue } : item));

         
        };
  
     return (
      <TagSelector
        options={leadsOption}
        value={row.original.leads}
        onChange={handleChange}
        allowCreate={false}
        horizontalOptions={false}
        isWithDot={false}

      />
    );
  },

  
},
              {
  header: 'Reference',
  accessorKey: 'referenceId', // Make sure your data has this field
  meta: {
    // editable: true,
    // editorType: 'select',
    selectOptions: referenceOptions,
  },
  cell: ({ row }) => {
    const value = row.original.referenceId;



    const option = referenceOptions.find(opt => String(opt.value) === String(value));

      const [selected, setSelected] = React.useState<string | number | null>(value as string | number | null);
    




        const handleChange = async(newValue: string | number | null) => {
          setSelected(newValue);
          const body ={
            referenceId: newValue || null, // Ensure this matches your API
          }
                const response = await updateLeadMutate.mutateAsync([body,row.original.id, userid]);
                setTableData(prev => prev.map(item => item.id === row.original.id ? { ...item, referenceId: newValue } : item));

         
        };
  
     return (
      <TagSelector
        options={referenceOptions}
        value={row.original.referenceId}
        onChange={handleChange}
        allowCreate={false}
        horizontalOptions={false}
        isWithDot={false}

      />
    );
  },
},
{
  header: 'Shoot',
  accessorKey: 'shootId',
  meta: {
    // editable: true,
    // editorType: 'select',
    selectOptions: shootOptions,
  },
  cell: ({ row }) => {
    // const value = getValue();
    // const option = shootOptions.find(opt => String(opt.value) === String(value));
    // return option ? (
    //   <CustomTag name={option.label} />
    // ) : (
    //   <span style={{ color: '#aaa' }}>No Shoot</span>
    // );

      const handleChange = async(newValue: string | number | null) => {
          const body ={
            shootId: newValue || null, // Ensure this matches your API
          }
                const response = await updateLeadMutate.mutateAsync([body,row.original.id, userid]);
                setTableData(prev => prev.map(item => item.id === row.original.id ? { ...item, shootId: newValue } : item));

         
        };
  
     return (
      <TagSelector
        options={shootOptions}
        value={row.original.shootId}
        onChange={handleChange}
        allowCreate={false}
        horizontalOptions={false}
        isWithDot={false}

      />
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

    
              

        
];

// [assigneeOptions, referenceOptions, shootOptions, eventOptions, hiddenCommentRows,handleRowCreate toggleCommentsVisibility,commentsVisible]);

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


setTableData(prev =>
    prev.map(row =>
      row.id === response.id ? { ...row, ...response } : row
    )
  );

    }, [userid, updateLeadMutate]);


    const handleRowDelete = useCallback(async (rowIndex: number) => {
  const leadId = tableData[rowIndex].id;
  if (!leadId) return;
  await updateLeadMutate.mutateAsync([{deletedAt: new Date(), mentionedMembers: []}, leadId, userid]);
  setTableData(prev => prev.filter((_, index) => index !== rowIndex));
}, [tableData, updateLeadMutate, userid]);



const reminderMutate = useCreateReminder();


    const handleFollowupChange = async (date: any,time: any, leadID: any, reminderData: any) => {



      console.log("Followup date:", date, "Time:", time, "Lead ID:", leadID, "Reminder Data:", reminderData);
      const body = {
        followup: date ,
        followupTime: time,
        mentionedMembers: [],
      };

  let reminderBeforeBody = null;

  let reminderBody=null;

      const followupDateTime = dayjs(`${date}T${time || "00:00"}`);


  if (reminderData?.enabled && reminderData.before) {
    // Combine date and time into a single dayjs object
    // Subtract the reminder offset (in minutes)
    

    const customReminderTime = reminderData.reminderTime || "00:00";
      const reminderTimeObj = dayjs(`${date}T${customReminderTime}`);
  const reminderDateTime = reminderTimeObj.subtract(reminderData.before, "minute");

    reminderBeforeBody = {
      reminderDate: followupDateTime.format("YYYY-MM-DD"),
    reminderTime: reminderDateTime.format("HH:mm"),
      leadId: leadID,
      userId: userid,
    };
   await reminderMutate.mutateAsync([reminderBeforeBody, selectedLeadId]);
  }

   if (reminderData?.enabled && reminderData.reminderTime) {
    // Combine date and time into a single dayjs object
    const followupDateTime = dayjs(`${date}T${time || "00:00"}`);
    // Subtract the reminder offset (in minutes)
        const customReminderTime = reminderData.reminderTime || "00:00";

    reminderBody = {
      reminderDate: followupDateTime.format("YYYY-MM-DD"),
    reminderTime: dayjs(`${date}T${customReminderTime}`).format("HH:mm"),
      leadId: leadID,
      userId: userid,
    };
   await reminderMutate.mutateAsync([reminderBody, selectedLeadId]);
  }
     

      try {
        await updateLeadMutate.mutateAsync([body, leadID, userid]);



        setTableData(prev =>
          prev.map(row =>
            row.id === leadID ? { ...row, followup: date, followupTime: time } : row
          )
        );

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
        setSelectedLeadId(0);
        setIsReminderModalOpen(false);
      } catch (error) {
        console.error("Error creating reminder:", error);
      }
    };

  

    


  

    const filterableKeys = [
  "status",
  "referenceId",
  "followup",
  "mentions",
  "converted",
  "eventData",
  "leads",
  "shootId",
  "createdAt",

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

  console.log("Filter changed:", key, value);
  setFilters((prev) => ({
    ...prev,
    [key]: value,
  }));
}, []);

const handleAddFilter = useCallback((columnKey: any) => {
  console.log("Adding filter for column:", columnKey, columnKey.value);
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

const postGetVoiceRecordMutate = usePostGetVoiceRecordByLead();
const handleSaveVoice = async(audioBlob: Blob) => {
  if (selectedVoiceRow) {
    const url = URL.createObjectURL(audioBlob);


    setTableData(prev =>
      prev.map(row =>
        row.id === selectedVoiceRow.id ? { ...row, voice: url } : row
      )
    );

    const result =await createVoiceRecordMutation.mutateAsync({
      blob: audioBlob,
      leadId: selectedVoiceRow?.id, // assuming you have this
      createdBy: userid, // or get it from auth/user state
    });
    const voiceRecords = await postGetVoiceRecordMutate.mutateAsync([selectedVoiceRow.id]);
    setTableData(prev =>
      prev.map(row =>
        row.id === selectedVoiceRow.id ? { ...row, voiceRecords } : row
      )
    );
    setIsVoiceModalOpen(false);
    setSelectedVoiceRow(null);
  }
};

  const [isColumnModalOpen, setIsColumnModalOpen] = useState(false);



// const handleRemoveFilter = useCallback((key: string) => {
//   setFilters((prev) => {
//     const newFilters = { ...prev };
//     delete newFilters[key];
//     return newFilters;
//   });

//   setActiveFilters((prev: string[]) => prev.filter((k) => k !== key));
//   setEnabledFilters((prev) => {
//     const newEnabledFilters = { ...prev };
//     delete newEnabledFilters[key];
//     // Update localStorage immediately
//     localStorage.setItem('leadsEnabledFilters', JSON.stringify(newEnabledFilters));
//     return newEnabledFilters;
//   });
// }, []);
// Filter tableData based on filters



  const createMention = useCreateMention();

const handleMentionSave = useCallback(async(leadId: string, mentions: any[], selectedMentions: any[]) => {

  const formattedMentions = [...mentions, ...selectedMentions].map((assignee: any) => {
    // If already in correct format, return as is
    if (assignee.userId && assignee.userName) return assignee;
    // If coming from TagSelector, map from value/label
    return {
      userId: assignee.value ?? assignee.userId,
      userName: assignee.label ?? assignee.userName,
    };
  });

   await Promise.all(
        mentions.map((assignee) =>
          createMention.mutateAsync([
            {
              leadId,
              userId: assignee.value,
              type: "tag",
              createdBy: userid, // Assuming 1 is the ID of the user creating the mention
              // Add other fields as needed, e.g. message, mentionedBy, etc.
            },
            userid// userId or any other param if needed
          ])
        )
      );

      setTableData(prev =>
        prev.map(row => row.id === leadId ? { ...row, mentions: formattedMentions } : row)
      );


}, [ updateLeadMutate, userid]);

const handleRemoveFilter = useCallback((key: string) => {
  // Define related filter keys that should be removed together
  const relatedKeys = {
    'followup': ['followup', 'followupType', 'followupStart', 'followupEnd'],
    'followupType': ['followup', 'followupType', 'followupStart', 'followupEnd'],
    'followupStart': ['followupStart', 'followupEnd'],
    'followupEnd': ['followupStart', 'followupEnd'],
    'eventData': ['eventData', 'eventType', 'eventDataStart', 'eventDataEnd'],
    'eventType': ['eventData', 'eventType', 'eventDataStart', 'eventDataEnd'],
    'eventDataStart': ['eventDataStart', 'eventDataEnd'],
    'eventDataEnd': ['eventDataStart', 'eventDataEnd'],
      'createdAt': ['createdAt', 'createdAtType', 'createdAtStart', 'createdAtEnd'],

  };

  // Get all keys that need to be removed
  const keysToRemove = relatedKeys[key as keyof typeof relatedKeys] || [key];

  // Remove all related keys from filters
  setFilters((prev) => {
    const newFilters = { ...prev };
    keysToRemove.forEach(k => delete newFilters[k]);
    return newFilters;
  });

  // Remove all related keys from activeFilters
  setActiveFilters((prev: string[]) => 
    prev.filter((k) => !keysToRemove.includes(k))
  );

  // Remove all related keys from enabledFilters and update localStorage
  setEnabledFilters((prev) => {
    const newEnabledFilters = { ...prev };
    keysToRemove.forEach(k => delete newEnabledFilters[k]);
    
    // Update localStorage immediately
    localStorage.setItem('leadsEnabledFilters', JSON.stringify(newEnabledFilters));
    return newEnabledFilters;
  });

setEditingRow(null);
  setEditingComment(null);
  setEditingEvent(null);

}, []);


const dateOption =[
  { label: 'Before', value: 'before' },
          { label: 'After', value: 'after' },
          { label: 'On Date', value: 'on' },
          { label: 'In Between', value: 'between' },
]





const filteredData = React.useMemo(() => {

    if (!filtersEnabled) return tableData;

  // Check if any active filters have values AND are enabled
  const hasActiveFilters = Object.entries(filters).some(([key, val]) => {
    const isEnabled = enabledFilters[key] !== false; // Default to true if not set
    return isEnabled && val !== undefined && val !== null && val !== '';
  });


  const result = tableData?.filter((row) => {

  const eventDateFilter = filters['eventData'];

  const eventTypeOption = dateOption.find(opt => opt.value === filters.eventType);

  const eventTypeFilter = filters.eventType

    const followupType = filters.followupType;

  return Object.entries(filters).every(([key, val]) => {


    // Event Data filter


      const isEnabled = enabledFilters[key] !== false; // Default to true if not set
      if (!isEnabled) return true;

console.log("Filtering key:", key, "Value:", val, "Enabled:", isEnabled);



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
    return dateD <= dateVal;
  });      }
      if (eventTypeFilter === 'after') {
return eventDates.some((d: any) => {
  if (!d || !val) return false;
  const dateD = new Date(d);
const dateVal = Array.isArray(val) ? new Date(val[0]) : new Date(val);  if (isNaN(dateD.getTime()) || isNaN(dateVal.getTime())) return false;
  return dateD >= dateVal;
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

      console.log("Followup key:", key, "Value:", val, "Type:", followupType, filters.followup);  
            if (!followupType || !val) return true;

      const followupDate = row.followup?.slice(0, 10);


      console.log("Followup date:", followupDate, filters.followup, "Type:", filters.followup==followupDate, "Value:", val);




 

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


        return followupDate <= filters.followup;
      }
      if (followupType === 'after' && filters.followup) {

        return followupDate >= filters.followup;
      }
      if (followupType === 'on' && filters.followup) {

        return followupDate === filters.followup;
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
    return createdAtDate === filters.createdAt;
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



return result;
}, [tableData, filters, activeFilters, filtersEnabled, enabledFilters, handleRemoveTags, handleRowCreate, handleRowEdit]);





// const filteredData = React.useMemo(() => {
//   if (!filtersEnabled) return tableData;

//   // Get only enabled filters with a value
//   const activeEnabledFilters = Object.entries(filters).filter(([key, val]) => {
//     const isEnabled = enabledFilters[key] !== false;
//     return isEnabled && val !== undefined && val !== null && val !== '';
//   });

//   // If no enabled filters, return all data
//   if (activeEnabledFilters.length === 0) return tableData;

//   return tableData?.filter(row =>
//     activeEnabledFilters.every(([key, val]) => {
//       // Special handling for followupType + followup
//       if (key === "followupType" && filters.followup) {
//         const followupDate = row.followup?.slice(0, 10);
//         if (!followupDate) return false;
//         if (val === "before") return followupDate <= filters.followup;
//         if (val === "after") return followupDate >= filters.followup;
//         if (val === "on") return followupDate === filters.followup;
//         // Add more cases if needed
//         return true;
//       }
//       // Default: string includes
//       return String(row[key])?.toLowerCase().includes(String(val).toLowerCase());
//     })
//   );
// }, [tableData, filters, filtersEnabled, enabledFilters]);



  const updateTablePreferences = useUpdateUsersTablePreference();

  const handleColumnResize = (columnId: string, newSize: number) => {
    const body={
      width: newSize,
    };
    
    
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
  const body = {
    isVisible: isVisible,
  };
  const updatedResult = await updateTablePreferences.mutateAsync([body, columnKey, "lead", userid]);

  refetchLeadsTablePreference();

}


// When a new filter is added, initialize it as enabled
useEffect(() => {
  activeFilters.forEach(filter => {
    if (enabledFilters[filter] === undefined) {
      setEnabledFilters(prev => ({
        ...prev,
        [filter]: true
      }));
    }
  });
}, [activeFilters]);

useEffect(() => {
  localStorage.setItem('leadsEnabledFilters', JSON.stringify(enabledFilters));
}, [enabledFilters]);









  return (
    <div >



<styled.FilterAndSwitchContainer>


      <CustomSwitch
    enabled={filtersEnabled} 
    onChange={(enabled) => setFiltersEnabled(enabled)} 
  />

<styled.FiltersDiv disabled={!filtersEnabled}>

  {activeFilters.map((key: any) => {
    const col = columns.find((c: any) => c.accessorKey === key);
    if (!col) return null;

    const meta: { editorType?: string; selectOptions?: Array<{id: string | number; label: string; value: any }> } = col.meta || {};

        const isFilterEnabled = enabledFilters[key] !== false; // Default to true if not set

    //      const filterSwitch = (
    //   <CustomSwitch 
    //     enabled={isFilterEnabled}
    //     onChange={() => {
    //       setEnabledFilters(prev => ({
    //         ...prev, 
    //         [key]: !isFilterEnabled
    //       }));
    //     }}
    //   />
    // );

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

  if (key === 'followup') {
  const followupType = filters.followupType;
  return (
    <styled.FilterTag key={key} active={!!filters[key]} style={{ background: 'rgb(25, 25, 25)' }}>
                <styled.FilterHeader>

       <span style={{ color: '#bbb', marginRight: 6, fontWeight: 500, minWidth: "fit-content" }}>
    {col.header?.toString()}:
  </span>
  {filterSwitch}
          </styled.FilterHeader>
      <CustomSelect
        size="small"
        style={{ width: 100}}
       
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
  value={filters.followupEnd || filters.followupStart || ''}
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
           <styled.FilterHeader>
            <span style={{ color: '#bbb', marginRight: 6, fontWeight: 500, minWidth: "fit-content" }}>
              {col.header?.toString()}:
            </span>
            {filterSwitch}
          </styled.FilterHeader>
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
  value={filters.eventDataEnd || filters.eventDataStart || ''}
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

    if (key === 'createdAt') {
  const createdAtType = filters.createdAtType;
  return (
    <styled.FilterTag key={key} active={!!filters[key]} style={{ background: 'rgb(25, 25, 25)' }}>
      <styled.FilterHeader>
        <span style={{ color: '#bbb', marginRight: 6, fontWeight: 500, minWidth: "fit-content" }}>
          {col.header?.toString()}:
        </span>
        {filterSwitch}
      </styled.FilterHeader>
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
              value={filters.createdAtEnd || filters.createdAtStart || ''}
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

{key === 'referenceId' || key ==="shootId" || key ==="leads" || key ==="mentions" ? (
 

  <TagMultiSelector
  options={meta?.selectOptions || []}
  value={filters[key] || []}
  onChange={(newVals) => handleFilterChange(key, newVals)}
  placeholder={col.header?.toString()}
  allowCreate={false}
  horizontalOptions={false} // or true if you want horizontal display
  isMulti={true}
/>
) 

     : meta?.editorType === 'select' || key === 'status' || key === 'converted' ? (
    

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
            horizontalOptions={false} // or true if you want horizontal display
            isWithDot={false} // or false if you don't want color dots
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

  <CustomSelectWithAllOption
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


</styled.FilterAndSwitchContainer>



        
        <TaskCustomTable
         data={filteredData || []}
        
          columns={columnsWithWidth}
          openLogsModal={openLogsModal}
          setOpenLogsModal={setOpenLogsModal}
          handleLogClick={(rowId: any) => {
            setSelectedLeadId(rowId);
            setOpenLogsModal(true);
          }}
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
   highlightRowId={highlightRowId}
   totalDataCount={totalLeads || 0}
   currentOffset={offset}

  
  pageSize={Object.keys(filters).length > 0 ? LeadsData?.filteredCount :  limit}
  withPagination={false}
   onIncrementNearEnd={() => {
    console.log("Incrementing offset near end");
  if (isOffsetLoadingRef.current) return; // Use ref for immediate check



if (offset + 40 >= totalLeads) return;
    console.log("Incrementing offset end", offset, "totalLeads", totalLeads);


    setIsOffsetLoading(true);
    isOffsetLoadingRef.current = true; // Set ref immediately

if(offset + 40 <= totalLeads){
    setOffset((prevOffset) => prevOffset + 40);

};
    // Increment your value or fetch more data here
  }}

  openFollowupModal={openFollowupModal}
  setOpenFollowupModal={setOpenFollowupModal}
  isFollowup={true}
  openTablesModal={openTablesModal}
  setOpenTablesModal={setOpenTablesModal}
  isTablesLogs={true}
  showRowLogs={true}

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
        // refetch={refetchLeadsData}
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
    onSave={handleMentionSave}
    // refetch={refetchLeadsData}
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


{openLogsModal && (
  <LogsModal
    open={openLogsModal}
    onClose={() => setOpenLogsModal(false)}
    title="Lead Logs"
    rowId={selectedLeadId || 0}
    tableName="leads"
  />

)}

{openFollowupModal && (
<FollowupModal
  open={openFollowupModal}
  onClose={() => setOpenFollowupModal(false)}
  width={900}

  />

)}

{openTablesModal && (
  <UsersTableLogs
    open={openTablesModal}
    onClose={() => setOpenTablesModal(false)}
    title="Leads Update history"
    tableName="leads"
    userId={userid}
  />
)}







    </div>
  )
}

export default Leads