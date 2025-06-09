import type { ColumnDef } from "@tanstack/react-table";
import  { CustomTable } from "../../components/customTable/CustomTable"
import { useEffect, useState, useMemo } from "react";
import { useGetLeadsByUser } from "../../api/get/getLeadsByUser";
import { useCreateLead } from "../../api/post/newLead";
import { useUpdateLead } from "../../api/put/updateLead";
import * as styled from './style';
import { Button, Input, Select } from "antd";
import EventModal from "./components/EventModal/EventModal";
import { PlusOutlined } from "@ant-design/icons";
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
  
  
}




const Leads = () => {

  const userid = Number(localStorage.getItem('userid'));
  const roleid = localStorage.getItem('roleid');

    const {data: LeadsData, refetch: refetchLeadsData} = useGetLeadsByUser(Number(userid));

    const {data: allMembersData} = useGetAllUsers();
    const { data: allReferencesData } = useGetAllReferences();
    const { data: allShootsData } = useGetAllShoots();

  // Store userId and name in state
  const [assigneeOptions, setAssigneeOptions] = useState<{ label: string; value: any }[]>([]);
  const [referenceOptions, setReferenceOptions] = useState<{ label: string; value: string }[]>([]);
  const [shootOptions, setShootOptions] = useState<{ label: string; value: string }[]>([]);

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

        const [selectedMentionLeadId, setSelectedMentionLeadId] = useState<number>();

        const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
        const [selectedVoiceRow, setSelectedVoiceRow] = useState<any>(null);

        useEffect(()=>{
          setTableData(LeadsData?.data)

        },[LeadsData])

         const openEventModal = (rowData: Doc) => {
          setSelectedLeadId(rowData?.id)

    setIsEventModalOpen(true);
  };

    const openCommentModal = (rowData: Doc) => {
          setSelectedLeadId(rowData?.id)
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



const columns: ColumnDef<Doc>[] = [
  {
    header: 'Name',
    accessorKey: 'name',
    size: 500,

    meta: { editable: true },
      enableSorting: true,


  },
  {
    header: 'Event',
    accessorKey: 'event',
     meta: {
    editable: true,
    editorType: 'eventData', // custom type for your filter UI
        visible: true, // <-- add this

  },

    cell: ({ row }) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span>{row.original.eventCount + " Events" || 'No Event'}</span>
        <Button
          size="small"
          icon={<PlusOutlined />}
          onClick={() => openEventModal(row.original)} // pass row data if needed
        />
      </div>
    ),
  },
  {
    header: 'Amount',
    accessorKey: 'amount',

    meta: { editable: true },
      enableSorting: true,

  },

            {
      header: 'Assignee',
      accessorKey: 'assignedTo', // or 'assignedTo' if that's your field
      meta: {
        editable: true,
        editorType: 'select',
        selectOptions: assigneeOptions,
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
 },
  { header: 'Description', 
    accessorKey: 'description', 
    meta: { editable: true },
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
    console.log("Voice Records:", voiceRecords);
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
          
          <span style={{ color: "#aaa" }}>Record</span>
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
    { header: 'Follow up', accessorKey: 'followup',     meta: { editable: true,  editorType: 'date', // <-- add this
 },
 },
      { header: 'Reminder', accessorKey: 'reminder' },
        { header: 'Comments', accessorKey: 'comment',  cell: ({ row }) => {
    const comments = row.original.comments || [];
    if (!comments.length) {
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span>No comment</span>
          <Button
            size="small"
            icon={<PlusOutlined />}
            onClick={() => openCommentModal(row.original)}
          />
        </div>
      );
    }
    // Show all comments in the cell
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {comments.map((c: any, idx: number) => {
          const givenBy = c.givenBy || "Unknown";
          const givenAtIST = c.givenAt
            ? new Date(c.givenAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })
            : "";
          return (
            <div key={c.id || idx} style={{ borderBottom: "1px solid #333", paddingBottom: 4 }}>
              <strong>{c.comment}</strong>
              <div style={{ fontSize: 12, color: "#aaa" }}>
                By: {givenBy} | At: {givenAtIST}
              </div>
            </div>
          );
        })}
        <div>
          <Button
            size="small"
            icon={<PlusOutlined />}
            onClick={() => openCommentModal(row.original)}
          />
        </div>
      </div>
    );
  },
},
          {
  header: 'Mention',
  accessorKey: 'mentions',
  cell: ({ row }) => {
    const mentions = row.original.mentions;
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
            <CustomTag key={m.userId} name={m.userName} />
             
          ))
        ) : (
          <span style={{ color: '#aaa' }}>Mention</span>
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
              { header: 'Leads', accessorKey: 'leads',  
                meta: {
      editable: true,
      editorType: 'select',
      selectOptions: [
        { label: 'Warm', value: 'warm' },
        { label: 'Cold', value: 'cold' },
      ],
    }, },
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
    
              

        
];

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
    const handleRowCreate=async(newRow: Doc)=>{
      const body={
        name: newRow.name,
        createdBy:userid,
        assignedTo: newRow.assignedTo,

      };
      const response = await newLeadsMutate.mutateAsync([body, 1]);
      refetchLeadsData();

    };


    const updateLeadMutate = useUpdateLead()

    const handleRowEdit=async(updatedRow: Doc, rowIndex: number)=>{
      const body={
               name: updatedRow?.name,
               contact:updatedRow.contact,
               description: updatedRow.description,
               status: updatedRow.status,
               converted: updatedRow.converted,
               amount: updatedRow.amount,
               leads: updatedRow.leads,
               followup: updatedRow.followup,
               assignedTo: updatedRow.assignedTo,
               referenceId: updatedRow.referenceId || null, // Ensure this matches your API
               shootId: updatedRow.shootId || null, // <-- Add this line
      };

      const response = await updateLeadMutate.mutateAsync([body, updatedRow.id])

    };


    const [filters, setFilters] = useState<Record<string, string>>({});

    const [activeFilters, setActiveFilters] = useState<string[]>([]);

const availableFilterColumns = columns.filter(
  (col: any) =>
    col.meta?.editable &&
    !activeFilters.includes(col.accessorKey as string)
);

const handleFilterChange = (key: string, value: string) => {
  setFilters((prev) => ({
    ...prev,
    [key]: value,
  }));
};

const handleAddFilter = (columnKey: string) => {
  setActiveFilters((prev) => [...prev, columnKey]);
};


const createVoiceRecordMutation  = useCreateVoiceRecord();
const handleSaveVoice = async(audioBlob: Blob) => {
  if (selectedVoiceRow) {
    const url = URL.createObjectURL(audioBlob);


    setTableData(prev =>
      prev.map(row =>
        row.id === selectedVoiceRow.id ? { ...row, voice: url } : row
      )
    );
    console.log("Saving voice record for lead:", selectedVoiceRow.id);

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


const handleRemoveFilter = (key: string) => {
  setFilters((prev) => {
    const newFilters = { ...prev };
    delete newFilters[key];
    return newFilters;
  });

  setActiveFilters((prev: string[]) => prev.filter((k) => k !== key));
};
// Filter tableData based on filters
const filteredData = tableData?.filter((row) => {
  // Get event filter values outside the loop
  const eventDateFilter = filters['event'];
  const eventTypeFilter = filters['eventType'] || 'before';

  return Object.entries(filters).every(([key, val]) => {
    if (key === 'event' && eventDateFilter) {
      const filterDate = eventDateFilter;
      const eventDates = (row.eventData || []).map((e: any) => e.eventDate?.slice(0, 10));
      if (!eventDates.length) return false;

      if (eventTypeFilter === 'before') {
        return eventDates.some((d: any) => d && d < filterDate);
      }
      if (eventTypeFilter === 'after') {
        return eventDates.some((d: any) => d && d > filterDate);
      }
      if (eventTypeFilter === 'on') {
        return eventDates.some((d: any) => d && d === filterDate);
      }
      return true;
    }
    // Don't filter on eventType key itself
    if (key === 'eventType') return true;
    // Default filter for other columns
    return val ? String(row[key as keyof Doc] || '').toLowerCase().includes(val.toLowerCase()) : true;
  });
});


  return (
    <div>

    <styled.FiltersDiv>
  {activeFilters.map((key: any) => {
    const col = columns.find((c: any) => c.accessorKey === key);
    if (!col) return null;

    const meta: { editorType?: string; selectOptions?: Array<{ label: string; value: any }> } = col.meta || {};

    if (key === 'event') {
      return (
        <styled.FilterTag key={key} active={!!filters[key]} style={{ background: 'rgb(25, 25, 25)' }}>
          <Select
            size="small"
            style={{ width: 100, marginRight: 8 }}
            value={filters.eventType || 'before'}
            onChange={val => setFilters(prev => ({ ...prev, eventType: val }))}
            options={[
              { label: 'Before', value: 'before' },
              { label: 'After', value: 'after' },
              { label: 'On Date', value: 'on' },
            ]}
          />
          <Input
            type="date"
            size="small"
            value={filters[key] || ''}
            onChange={e => handleFilterChange(key, e.target.value)}
            style={{
              width: 120,
              background: 'rgb(25, 25, 25)',
              color: 'white',
              border: 'transparent',
            }}
          />
          <span
            onClick={() => handleRemoveFilter(key)}
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
    onClick={() => handleRemoveFilter(key)}
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

  <Select
    placeholder="+ Filter"
    size="small"
    style={{ width: 150 }}
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
          columns={columns}
          createEmptyRow={createEmptyDoc}
          onRowCreate={handleRowCreate} // ✅ hook for API
          onRowEdit={handleRowEdit} // ✅ added
          isWithNewRow={true}

        />


        {isEventModalOpen && (
          <EventModal
          open={isEventModalOpen}
        onClose={() => setIsEventModalOpen(false)}
        title="Add Events"
        leadId={selectedLeadId || 0}
        refetch={refetchLeadsData}
    
          />
        )}


           {isCommentModalOpen && (
          <CommentModal
          open={isCommentModalOpen}
        onClose={() => setIsCommentModalOpen(false)}
        title="Add Comments"
        leadId={selectedLeadId || 0}
        refetch={refetchLeadsData}
    
          />
        )}

        {isMentionModalOpen && (
  <MentionModal
    open={isMentionModalOpen}
    onClose={() => setIsMentionModalOpen(false)}
    title="Mention Someone"
    leadId={selectedMentionLeadId || 0}
    refetch={refetchLeadsData}
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