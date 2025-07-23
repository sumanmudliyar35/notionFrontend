import React, { useEffect, useState } from 'react'
import { useGetLeadsDetail } from '../../api/get/getLeadsDetail';
import CustomModal from '../customModal/CustomModal';
import styled from 'styled-components';
import DescriptionCell from '../../pages/leads/components/DescriptionCell/DescriptionCell';
import { useCreateComment } from '../../api/post/newComment';
import { useGetAllUsers } from '../../api/get/getAllMember';
import { useUpdateLead } from '../../api/put/updateLead';
import { Button, Select } from "antd";
import CustomSelect from '../customSelect/CustomSelect';
import TagSelector from '../customSelectModal/CustomSelectModal';
import CustomInput from '../customInput/CustomInput';
import { useUpdateEvent } from '../../api/put/updateEvent';
import DateTimeModal from '../../pages/leads/components/DateTimeModal/DateTimeModal';
import { formatDisplayDate } from '../../utils/commonFunction';
import CustomTextArea from '../customTextArea/CustomTextArea';
import { PlusOutlined } from '@ant-design/icons';
import EventModal from '../../pages/leads/components/EventModal/EventModal';
import { useCreateEvent } from '../../api/post/newEvent';

const Container = styled.div`
  padding: 32px 32px 0 32px;
  min-width: 420px;
  color: #fff;
`;

const Title = styled.h1`
  font-size: 16px;
  font-weight: 700;
  margin: 0 0 8px 0;
  color: #fff;
`;

const MetaRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 32px;
  margin: 16px 0 24px 0;
  font-size: 12px;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #bdbdbd;
`;

const SectionDivider = styled.hr`
  border: none;
  border-top: 1px solid #23272f;
  margin: 32px 0 16px 0;
`;

const SectionTitle = styled.div`
  font-weight: 600;
  color: #bdbdbd;
  margin-bottom: 8px;
  font-size: 16px;
`;

const SectionContent = styled.div`
  color: #fff;
  font-size: 12px;
`;

const CommentsSection = styled.div`
  margin-top: 24px;
`;

const CommentsTitle = styled.div`
  font-weight: 600;
  color: #bdbdbd;
  margin-bottom: 12px;
`;

const CommentsContent = styled.div`
  color: #bdbdbd;
  margin-bottom: 12px;
`;

const CommentList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const CommentItem = styled.li`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 18px;
`;

const CommentAvatar = styled.div`
  background: #8e6fff;
  color: #fff;
  font-weight: 700;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
`;

const CommentContent = styled.div`
  background: #23272f;
  border-radius: 8px;
  padding: 10px 16px;
  color: #fff;
  min-width: 120px;
`;

const CommentAuthor = styled.div`
  font-weight: 600;
  color: #fff;
  margin-bottom: 2px;
  font-size: 12px;
`;

const CommentTime = styled.span`
  color: #bdbdbd;
  font-size: 10px;
  margin-left: 8px;
`;

export const AddComment = styled.div`
  margin-top: 8px;
  color: #bdbdbd;
  font-size: 12px;
  padding-left: 44px;
`;

const CommentText = styled.div`
  color: #fff;
  font-size: 12px;
`;

const EventTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 8px;
  background: #23272f;
  border-radius: 8px;
  overflow: hidden;
`;

const EventHeader = styled.th`
  color: #bdbdbd;
  font-weight: 600;
  padding: 8px;
  background: #23272f;
  border-bottom: 1px solid #23272f;
`;

const EventCell = styled.td`
  color: #fff;
  padding: 8px;
  border-bottom: 1px solid #23272f;
`;

const statusOptions = [
  { id: 'open', label: 'Open', value: 'open' },
  { id: 'closed', label: 'Closed', value: 'closed' },
];

const leadsOption = [
  { id: 'excited', label: 'Excited', value: 'excited' },
  { id: 'warm', label: 'Warm', value: 'warm' },
  { id: 'cold', label: 'Cold', value: 'cold' },
];

const LeadsPreview: React.FC<{
  open: boolean;
  onClose: () => void;
  title?: string;
  leadId: number | string;
}> = ({ open, onClose, title, leadId }) => {


    const userId = Number(localStorage.getItem('userid'));

    const [newComment, setNewComment] = useState('');
  const [isAddingComment, setIsAddingComment] = useState(false);
  
  const { data: leadDetail, isLoading, refetch } = useGetLeadsDetail(leadId);

  const [isTimeDateModalOpen, setIsTimeDateModalOpen] = useState(false);
const [editingRow, setEditingRow] = useState<string | number | null>(null);
const [editingRowValue, setEditingRowValue] = useState<any>(null);

const [isEventModalOpen, setIsEventModalOpen] = useState(false);


// Handler for saving a new event

  const createEventMutate = useCreateEvent();

const handleAddEvent = async (eventData: any, leadId: number) => {
  // You may want to call your API to add the event here
  // Example:
  // await addEventMutate.mutateAsync([eventData, leadId, userId]);
    await createEventMutate.mutateAsync([eventData, leadId]);

  setIsEventModalOpen(false);
  refetch();
};


const handleOpenFollowupModal = () => {
  setEditingRow(leadDetail?.id);
  console.log('Opening follow-up modal for row:', leadDetail?.id, leadDetail?.followup, leadDetail?.followupTime );
  setEditingRowValue({
    date: leadDetail?.followup,
    time: leadDetail?.followupTime,
  });
  setIsTimeDateModalOpen(true);
};

const handleFollowupChange = async (date: any, time: any, id: any) => {
  setIsTimeDateModalOpen(false);

  console.log('Updating follow-up for row:', id, date, time);
  if (leadDetail) {
    await updateLeadMutate.mutateAsync([
      {
        followup: date,
        followupTime: time,
      },
      leadDetail.id,
      userId,
    ]);
    refetch();
  }
};


   const {data: allMembersData} = useGetAllUsers();
  
  
    const [assigneeOptions, setAssigneeOptions] = useState<{ id: string | number; label: string; value: any }[]>([]);
  
  
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
  

    const commentMutate = useCreateComment();


  const handleAddComment =  async(value: string, rowId: any, mentionedMembers: any[] ) => {
  console.log('Adding comment:', value, rowId, mentionedMembers);

  const body = {
    comment: value,
    mentionedMembers: mentionedMembers || [],
    leadId: leadId,
    givenBy: userId,
  }

 const response =  await commentMutate.mutateAsync([body, userId]);
  console.log('Comment added:', response);
  setNewComment('');
  setIsAddingComment(false);
  
 refetch();
 
 
};


  // Add these states at the top of your LeadsPreview component
  const [isEditingContact, setIsEditingContact] = useState(false);
  const [isEditingAmount, setIsEditingAmount] = useState(false);
  const [contactValue, setContactValue] = useState('');
  const [amountValue, setAmountValue] = useState<string | number>('');

  const updateLeadMutate = useUpdateLead();

  // When leadDetail changes, update local values
  useEffect(() => {
    if (leadDetail) {
      setContactValue(leadDetail.contact || '');
      setAmountValue(leadDetail.amount || '');
    }
  }, [leadDetail]);

  // Save handlers (replace with API call if needed)
  const handleSaveContact = async () => {
    setIsEditingContact(false);
    if (leadDetail && contactValue !== leadDetail.contact) {
      await updateLeadMutate.mutateAsync([
        { contact: contactValue },
        leadDetail.id,
        userId,
      ]);
      // Optionally refetch or update local state if needed
    }
  };
  const handleSaveAmount = async () => {
    setIsEditingAmount(false);
    if (leadDetail && amountValue !== leadDetail.amount) {
      await updateLeadMutate.mutateAsync([
        { amount: amountValue },
        leadDetail.id,
        userId,
      ]);
      // Optionally refetch or update local state if needed
    }
  };


  // Add these states at the top with your other states:
const [isEditingDescription, setIsEditingDescription] = useState(false);
const [descriptionValue, setDescriptionValue] = useState('');

// Update value when leadDetail changes
useEffect(() => {
  if (leadDetail) {
    setDescriptionValue(leadDetail.description || '');
  }
}, [leadDetail]);

// Save handler
const handleSaveDescription = async () => {
  setIsEditingDescription(false);
  if (leadDetail && descriptionValue !== leadDetail.description) {
    await updateLeadMutate.mutateAsync([
      { description: descriptionValue },
      leadDetail.id,
      userId,
    ]);
    // Optionally refetch or update local state if needed
  }
};

const [isEditingStatus, setIsEditingStatus] = useState(false);
const [statusValue, setStatusValue] = useState('');

useEffect(() => {
  if (leadDetail) {
    setStatusValue(leadDetail.status || '');
  }
}, [leadDetail]);

const handleSaveStatus = async (value: any) => {

  if (leadDetail) {
    await updateLeadMutate.mutateAsync([
      { status: value },
      leadDetail.id,
      userId,
    ]);

    console.log('aftersaving:', value);
    setStatusValue(value);
      setIsEditingStatus(false); // Always exit edit mode

    // Optionally refetch or update local state if needed
  }
};




const [isEditingLeadType, setIsEditingLeadType] = useState(false);
const [leadTypeValue, setLeadTypeValue] = useState('');

useEffect(() => {
  if (leadDetail) {
    setLeadTypeValue(leadDetail.leads || '');
  }
}, [leadDetail]);

const handleSaveLeadType = async (value: any) => {
  if (leadDetail && value !== leadDetail.leads) {
    await updateLeadMutate.mutateAsync([
      { leads: value },
      leadDetail.id,
      userId,
    ]);
    setLeadTypeValue(value);
      setIsEditingLeadType(false); // Always exit edit mode

    // Optionally refetch or update local state if needed
  }
};

// Add these states at the top of your component:
const [editingEventIdx, setEditingEventIdx] = useState<number | null>(null);
const [editingField, setEditingField] = useState<string | null>(null);
const [eventEditValue, setEventEditValue] = useState<string>('');

const handleEditEvent = (idx: number, field: string, value: string) => {
  setEditingEventIdx(idx);
  setEditingField(field);
  setEventEditValue(value);
};

const updateEventMutate = useUpdateEvent();


const handleSaveEventEdit = async (idx: number, field: string) => {

  console.log('Saving event edit:', { idx, field, value: eventEditValue });
  let valueToSave:any = eventEditValue;
  let customField = field;

  if (field === 'noOfGuests') {
    valueToSave = Number(eventEditValue);
    customField = 'numberOfGuests';


  }
  if (!leadDetail?.eventData) return;
  const updatedEvents = [...leadDetail.eventData];
  updatedEvents[idx] = { ...updatedEvents[idx], [field]: eventEditValue };

  // Save to backend (replace with your event update API if needed)
  await updateEventMutate.mutateAsync([
    {[customField]: valueToSave },
    idx,
    userId
   
  ]);

  setEditingEventIdx(null);
  setEditingField(null);
  setEventEditValue('');
  refetch(); // Optionally refetch to get latest data
};

const statusRef = React.useRef<HTMLDivElement>(null);

useEffect(() => {
  if (!isEditingStatus) return;
  const handleClickOutside = (event: MouseEvent) => {
    if (statusRef.current && !statusRef.current.contains(event.target as Node)) {
      setIsEditingStatus(false);
    }
  };
  document.addEventListener('mousedown', handleClickOutside);
  return () => document.removeEventListener('mousedown', handleClickOutside);
}, [isEditingStatus]);



  return (
    <CustomModal open={open} onClose={onClose} title="" width={800}>
      <Container>
        {isLoading ? (
          <div style={{ textAlign: 'center', color: '#888', fontSize: 18 }}>Loading...</div>
        ) : leadDetail ? (
          <>
            <Title>Lead: {leadDetail?.name}</Title>
            <MetaRow>
              <MetaItem>
                <span>📞 Contact:</span>
                <span
                  style={{ cursor: 'pointer', minWidth: 80 }}
                  onClick={() => setIsEditingContact(true)}
                >
                  {isEditingContact ? (
                    <CustomInput
                      type="text"
                      value={contactValue}
                      onChange={e => setContactValue(e.target.value)}
                      onBlur={handleSaveContact}
                      onKeyDown={e => {
                        if (e.key === 'Enter') handleSaveContact();
                      }}
                      // style={{
                      //   background: '#23272f',
                      //   color: '#fff',
                      //   border: '1px solid #444',
                      //   borderRadius: 4,
                      //   padding: '2px 8px',
                      //   fontSize: 12,
                      // }}
                    />
                  ) : (
                    contactValue || '-'
                  )}
                </span>
              </MetaItem>
              {/* <MetaItem>
                <span>💰 Amount:</span>
                <span
                  style={{ cursor: 'pointer', minWidth: 60 }}
                  onClick={() => setIsEditingAmount(true)}
                >
                  {isEditingAmount ? (
                    <CustomInput
                      value={amountValue}
                      onChange={e => setAmountValue(e.target.value)}
                      onBlur={handleSaveAmount}
                      onKeyDown={e => {
                        if (e.key === 'Enter') handleSaveAmount();
                      }}
                    
                    />
                  ) : (
                    amountValue || '-'
                  )}
                </span>
              </MetaItem> */}

              <MetaItem>
  <span>💰 Amount:</span>
  <span
    style={{ cursor: 'pointer', minWidth: 60 }}
    onClick={() => setIsEditingAmount(true)}
  >
    {isEditingAmount ? (
      <CustomInput
        value={
          typeof amountValue === 'string'
            ? amountValue.replace(/[\s,]/g, '')
              ? Number(amountValue.replace(/[\s,]/g, '')).toLocaleString('en-IN', { maximumFractionDigits: 0 })
              : ''
            : typeof amountValue === 'number'
            ? (amountValue as number).toLocaleString('en-IN', { maximumFractionDigits: 0 })
            : ''
        }
        onChange={e => {
          // Remove commas and spaces before saving to state
          const raw = e.target.value.replace(/[\s,]/g, '');
          setAmountValue(raw);
        }}
        onBlur={handleSaveAmount}
        onKeyDown={e => {
          if (e.key === 'Enter') handleSaveAmount();
        }}
      />
    ) : (
      (() => {
        let value: any = amountValue;
        if (typeof value === 'string') {
          value = Number(value.replace(/[\s,]/g, ''));
        }
        return typeof value === 'number' && !isNaN(value)
          ? (value as number).toLocaleString('en-IN', { maximumFractionDigits: 0 })
          : (amountValue || '-');
      })()
    )}
  </span>
</MetaItem>
              <MetaItem>
                <span>🔥 Status:</span>
                <span
                  ref={statusRef}

                  style={{ color: '#faad14', cursor: 'pointer', minWidth: 80 }}
                  onClick={() => setIsEditingStatus(true)}
                >
                  {isEditingStatus ? (
                    <TagSelector
                      value={statusValue}
                      onChange={handleSaveStatus}
                      options={statusOptions.map(opt => ({
                        id: opt.value,
                        label: opt.label,
                        value: opt.value,
                      }))}
                    />
                  ) : (
                    statusOptions.find(opt => opt.value === statusValue)?.label || '-'
                  )}
                </span>
              </MetaItem>
              <MetaItem>
                <span>🌡️ Lead Type:</span>
                <span
                  style={{ cursor: 'pointer', minWidth: 80 }}
                  onClick={() => setIsEditingLeadType(true)}
                >
                  {isEditingLeadType ? (
                    <TagSelector
                      value={leadTypeValue}
                      onChange={handleSaveLeadType}
                      options={leadsOption.map(opt => ({
                        id: opt.value,
                        label: opt.label,
                        value: opt.value,
                      }))}
                    />
                  ) : (
                    leadsOption.find(opt => opt.value === leadTypeValue)?.label || '-'
                  )}
                </span>
              </MetaItem>
             <MetaItem>
  <span>🗓️ Follow-up:</span>
  <span
    style={{ cursor: 'pointer' }}
    onClick={handleOpenFollowupModal}
  >
    {leadDetail?.followup && leadDetail?.followup !=='0000-00-00'
      ? leadDetail?.followupTime ? formatDisplayDate(`${leadDetail?.followup}T${leadDetail?.followupTime}`) : formatDisplayDate(`${leadDetail?.followup}`)
      : 'add follow-up'}
    {/* {leadDetail?.followupTime ? ` ${leadDetail.followupTime}` : ''} */}
  </span>
</MetaItem>
            </MetaRow>

            <SectionDivider />

             <CommentsSection>
                          <CommentsTitle>Description</CommentsTitle>
                          <CommentsContent>
                            {isEditingDescription ? (
                              <DescriptionCell
                                value={descriptionValue}
                                onChange={async (val: string, id: string, mention: any) => {
                                  setDescriptionValue(val);
                                  setIsEditingDescription(false);
                                  if (leadDetail && val !== leadDetail.description) {
                                    await updateLeadMutate.mutateAsync([
                                      { description: val,
                                      mentionedMembers: mention || []


                                       },

                                      leadId,
                                      userId,
                                    ]);
                                    // Optionally refetch or update local state if needed
                                  }
                                }}
                                leadid={leadId}
                                assigneeOptions={assigneeOptions}
                                customIsEdited={isEditingDescription}
                                onBlur={() => setIsEditingDescription(false)}
                              />
                            ) : (
                              <span
                                style={{ cursor: 'pointer', display: 'block', minHeight: 24 }}
                                onClick={() => setIsEditingDescription(true)}
                              >
                                {descriptionValue || 'No description provided.'}
                              </span>
                            )}
                          </CommentsContent>
            
                        </CommentsSection>

            <CommentsSection>
              <CommentsTitle>Comments</CommentsTitle>
              <CommentList>
                {leadDetail?.comments && leadDetail.comments.length > 0 ? (
                  leadDetail.comments.map((comment: any) => (
                    <CommentItem key={comment.id}>
                      <CommentAvatar>
                        {comment.givenBy?.[0]?.toUpperCase() || 'U'}
                      </CommentAvatar>
                      <CommentContent>
                        <CommentAuthor>
                          {comment.givenBy}
                          <CommentTime>
                            {comment.givenAt
                              ? formatDisplayDate(comment.givenAt)
                              : ''}
                          </CommentTime>
                        </CommentAuthor>
                        <CommentText>{comment.comment}</CommentText>
                      </CommentContent>
                    </CommentItem>
                  ))
                ) : (
                  <div style={{ color: '#888' }}>No comments yet.</div>
                )}

                 <AddComment>
      {isAddingComment ? (
        <DescriptionCell
          value={newComment}
          onChange={handleAddComment}
          onBlur={() => setIsAddingComment(false)}
          // onSave={handleAddComment}
          customIsEdited={isAddingComment}

          assigneeOptions={assigneeOptions} // Pass user options for mentions
        />
      ) : (
        <span
          style={{ color: '#bdbdbd', cursor: 'pointer' }}
          onClick={() => setIsAddingComment(true)}
        >
          Add a comment...
        </span>
      )}
    </AddComment> 
              </CommentList>
            </CommentsSection>

            <SectionDivider />

            <SectionTitle>Events</SectionTitle>
            <Button type='primary' icon={<PlusOutlined />} onClick={() => setIsEventModalOpen(true)}>
              Event
            </Button>
            <EventTable>
              <thead>
                <tr>
                  <EventHeader>Date</EventHeader>
                  <EventHeader>Name</EventHeader>
                  <EventHeader>Note</EventHeader>
                  <EventHeader>Guests</EventHeader>
                  <EventHeader>Crew</EventHeader>
                </tr>
              </thead>
              <tbody>
                {leadDetail.eventData && leadDetail.eventData.length > 0 ? (
                  leadDetail.eventData.map((event: any, idx: number) => (
                    <tr key={event.eventId || idx}>
                      {/* Date */}
                      <EventCell
                        onClick={() => handleEditEvent(event.eventId, 'eventDate', event.eventDate || '')}
                        style={{ cursor: 'pointer' }}
                      >
                        {editingEventIdx === idx && editingField === 'eventDate' ? (
                          <input
                            type="date"
                            value={eventEditValue ? new Date(eventEditValue).toISOString().slice(0, 10) : ''}
                            autoFocus
                            onChange={e => setEventEditValue(e.target.value)}
                            onBlur={() => handleSaveEventEdit(event.eventId, 'eventDate')}
                            onKeyDown={e => {
                              if (e.key === 'Enter') handleSaveEventEdit(event.eventId, 'eventDate');
                            }}
                          />
                        ) : (
                          event.eventDate ? formatDisplayDate(event.eventDate) : '-'
                        )}
                      </EventCell>
                      {/* Name */}
                      <EventCell
                        onClick={() => handleEditEvent(event.eventId, 'eventName', event.eventName || '')}
                        style={{ cursor: 'pointer' }}
                      >
                        {editingEventIdx === idx && editingField === 'eventName' ? (
                          <CustomInput
                            type="text"
                            value={eventEditValue}
                            onChange={e => setEventEditValue(e.target.value)}
                            onBlur={() => handleSaveEventEdit(event.eventId, 'eventName')}
                            onKeyDown={e => {
                              if (e.key === 'Enter') handleSaveEventEdit(event.eventId, 'eventName');
                            }}
                          />
                        ) : (
                          event.allEventData || '-'
                        )}
                      </EventCell>
                      {/* Note */}
                      <EventCell
                        onClick={() => handleEditEvent(idx, 'note', event.note || '')}
                        style={{ cursor: 'pointer' }}
                      >
                        {editingEventIdx === idx && editingField === 'note' ? (
                          <CustomTextArea
                            value={eventEditValue}
                            autoFocus
                            onChange={(e:any) => setEventEditValue(e)}
                            // onBlur={() => handleSaveEventEdit(event.eventId, 'note')}
                            onKeyDown={(e: any) => {
                              if (e.key === 'Enter') handleSaveEventEdit(event.eventId, 'note');
                            }}
                          />
                        ) : (
                          event.note || '-'
                        )}
                      </EventCell>
                      {/* Guests */}
                      <EventCell
                        onClick={() => handleEditEvent(idx, 'noOfGuests', event.noOfGuests || '')}
                        style={{ cursor: 'pointer' }}
                      >
                        {editingEventIdx === idx && editingField === 'noOfGuests' ? (
                          <CustomInput
                            type="number"
                            value={eventEditValue}
                            onChange={e => setEventEditValue(e.target.value)}
                            onBlur={() => handleSaveEventEdit(event.eventId, 'noOfGuests')}
                            onKeyDown={e => {
                              if (e.key === 'Enter') handleSaveEventEdit(event.eventId, 'noOfGuests');
                            }}
                          />
                        ) : (
                          event.noOfGuests || '-'
                        )}
                      </EventCell>
                      {/* Crew */}
                      <EventCell
                        onClick={() => handleEditEvent(idx, 'crew', event.crew || '')}
                        style={{ cursor: 'pointer' }}
                      >
                        {editingEventIdx === idx && editingField === 'crew' ? (
                          <CustomTextArea
                            value={eventEditValue}
                            onChange={e => setEventEditValue(e)}
                            onKeyDown={e => {
                              if (e.key === 'Enter') handleSaveEventEdit(event.eventId, 'crew');
                            }}
                          />
                        ) : (
                          event.crew || '-'
                        )}
                      </EventCell>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <EventCell colSpan={5} style={{ textAlign: 'center', color: '#888' }}>
                      No events found.
                    </EventCell>
                  </tr>
                )}
              </tbody>
            </EventTable>
          </>
        ) : (
          <div style={{ textAlign: 'center', color: '#888', fontSize: 18 }}>No lead details found.</div>
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



{isEventModalOpen && (
  <EventModal
    open={isEventModalOpen}
    onClose={() => setIsEventModalOpen(false)}
    title="Add Event"
    leadId={leadDetail.id}
    refetch={refetch}
    onSave={handleAddEvent}
  />
)}
      </Container>
    </CustomModal>
  );
};

export default LeadsPreview;