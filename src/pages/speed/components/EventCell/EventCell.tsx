import React, { useState } from 'react';
import { Button } from 'antd';
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";

import dayjs from 'dayjs';
import DateInput from '../../../../components/CustomDateInput/CustomDateInput';
import CustomSelectWithAllOption from '../../../../components/CustomSelectWithAllOption/CustomSelectWithAllOption';
import CustomInput from '../../../../components/customInput/CustomInput';
import CustomTextArea from '../../../../components/customTextArea/CustomTextArea';
import { formatDisplayDate } from '../../../../utils/commonFunction';

interface EventCellProps {
  events: any[];
  rowId: any;
  eventOptions: any[];
  openEventModal: (id: any) => void;
  handleUpdateEvent: (rowId: any, eventId: any, eventData: any) => Promise<void>;
  handleDeleteEvent: (rowId: any, eventId: any) => void;
}

const EventCell = React.memo(({ 
  events = [], 
  rowId, 
  eventOptions, 
  openEventModal, 
  handleUpdateEvent, 
  handleDeleteEvent 
}: EventCellProps) => {
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [localEditValue, setLocalEditValue] = useState<any>(null);

  const startEdit = (event: any, idx: number) => {
    setEditingIdx(idx);
    setLocalEditValue({
      eventDate: event?.eventDate,
      others: event?.eventName || '',
      allEvents: event?.allEvents || [],
      eventId: event?.eventId || null,
      noOfGuests: event?.noOfGuests,
      note: event?.note || '',
      crew: event?.crew || '',
      eventListId: event?.eventListId || null,
    });
  };

  const saveEdit = async (eventId: any) => {
    await handleUpdateEvent(rowId, eventId, localEditValue);
    setEditingIdx(null);
    setLocalEditValue(null);
  };

  const cancelEdit = () => {
    setEditingIdx(null);
    setLocalEditValue(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {events.length === 0 && (
        <span style={{ color: '#aaa' }}>No Events</span>
      )}
      {events.map((event: any, idx: number) => {
        const isEditing = editingIdx === idx;


        
        
        return (
          <div
            key={event.eventId || idx}
            style={{
              borderBottom: '1px solid #eee',
              paddingBottom: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            {isEditing ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%' }}>
                <DateInput
                  value={localEditValue.eventDate || ''}
                  onChange={date =>
                    setLocalEditValue((prev: any) => ({
                      ...prev,
                      eventDate: date && dayjs(date).isValid() ? date.format('YYYY-MM-DD') : ''
                    }))
                  }
                  placeholder="Select date"
                />
                
                <CustomSelectWithAllOption
                  name="eventId"
                  placeholder="Select an event"
                  options={eventOptions}
                  isMulti={true}
                  value={
                    Array.isArray(localEditValue.allEvents)
                      ? eventOptions.filter(option => localEditValue.allEvents.includes(String(option.value)))
                      : []
                  }
                  onChange={(inputValue: any) => {
                    setLocalEditValue((prev: any) => ({
                      ...prev,
                      allEvents: inputValue ? inputValue.map((opt: any) => String(opt.value)) : [],
                    }));
                  }}
                />
                
                {Array.isArray(localEditValue.allEvents) && localEditValue.allEvents.includes("4") && (
                  <CustomInput
                    placeholder="Event Name"
                    value={localEditValue.others}
                    onChange={e =>
                      setLocalEditValue((prev: any) => ({
                        ...prev,
                        others: e.target.value,
                      }))
                    }
                  />
                )}
                
                <CustomInput
                  type="number"
                  placeholder="No. of Guests"
                  value={localEditValue.noOfGuests}
                  onChange={e =>
                    setLocalEditValue((prev: any) => ({
                      ...prev,
                      noOfGuests: e.target.value,
                    }))
                  }
                />
                
                <CustomInput
                  type="text"
                  placeholder="No. of Crew"
                  value={localEditValue.crew}
                  onChange={e =>
                    setLocalEditValue((prev: any) => ({
                      ...prev,
                      crew: e.target.value,
                    }))
                  }
                />
                
                <CustomTextArea
                  value={localEditValue.note}
                  onChange={val =>
                    setLocalEditValue((prev: any) => ({
                      ...prev,
                      note: val,
                    }))
                  }
                />
                
                <div>
                  <Button
                    size="small"
                    type="primary"
                    onClick={() => saveEdit(event.eventId)}
                    style={{ marginRight: 8 }}
                  >
                    Save
                  </Button>
                  <Button size="small" onClick={cancelEdit}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div
                  style={{ cursor: 'pointer', flex: 1 }}
                  onClick={() => startEdit(event, idx)}
                >
                  <div>
                    <b>{event?.allEventData || event?.eventName} on</b>{' '}
                    {formatDisplayDate(event?.eventDate)}
                  </div>
                  
                  {event.noOfGuests !== undefined && event.noOfGuests !== null && event.noOfGuests !== 0 && (
                    <div>
                      <b>Guests:</b> {event.noOfGuests}
                    </div>
                  )}
                  
                  {event.crew && (
                    <div>
                      <b>Crew:</b> {event.crew || 0}
                    </div>
                  )}
                  
                  {event.note && (
                    <div>
                      <b>Note:</b> {event.note}
                    </div>
                  )}
                </div>
                
                <Button
                  size="small"
                  danger
                  icon={
                    <DeleteOutlined
                      style={{
                        filter: 'brightness(0.7) grayscale(0.7)',
                      }}
                    />
                  }
                  onClick={e => {
                    e.stopPropagation();
                    handleDeleteEvent(rowId, event.eventId);
                  }}
                  style={{
                    marginLeft: 8,
                    background: 'lightgray',
                    borderColor: 'lightgray',
                  }}
                />
              </>
            )}
          </div>
        );
      })}
      
      <Button
        size="small"
        icon={<PlusOutlined />}
        onClick={() => openEventModal(rowId)}
      />
    </div>
  );
});

export default EventCell;