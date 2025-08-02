import React, { useState } from 'react';
import { DatePicker, Button } from 'antd';
import dayjs from 'dayjs';
import { DeleteOutlined } from '@ant-design/icons';
import CustomModal from '../customModal/CustomModal';
import { SharedInputWrapper } from '../../style/sharedStyle';
import TimeInput from '../../pages/leads/components/TimeInput/TimeInput';
import CustomInput from '../customInput/CustomInput';
import { useGetRemindersByLead } from '../../api/get/getAllReminderByLead';
import { useDeleteReminder } from '../../api/delete/deleteReminder'; // Make sure this hook exists

interface DateTimeModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  onSave?: (date: string | null, time: string | null, leadID: any, title: string) => void;
  leadID?: any;
  taskId?: number;

}

const ReminderModal = ({ open, onClose, title, onSave, leadID, taskId }: DateTimeModalProps) => {
  const { data: reminderData, refetch } = useGetRemindersByLead(leadID);
  
  const deleteReminderMutation = useDeleteReminder();

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [reminderTitle, setReminderTitle] = useState<string>('');

  const handleDateChange = (date: dayjs.Dayjs | null) => {
    setSelectedDate(date ? date.format('YYYY-MM-DD') : null);
  };

  const handleSave = () => {
  
    if (!selectedDate || !selectedTime) {
      alert('Please select both date and time before saving.');
      return;
    }

    if (onSave) {
      onSave(selectedDate, selectedTime, leadID, reminderTitle);
    }
    onClose(); // Close the modal after saving
  };

  const handleDelete = async(reminderId: string | number) => {
    const body={

      reminderId: reminderId,
     deletedAt: new Date()
   }
   const response = await deleteReminderMutation.mutateAsync([reminderId, body]);
   refetch();
    
  };

  return (
    <CustomModal
      title={title || 'Select Date and Time'}
      onClose={onClose}
      open={open}
    >
      <SharedInputWrapper>
        <CustomInput
          label="Reminder Title"
          name="reminderTitle"
          value={reminderTitle}
          onChange={(e) => setReminderTitle(e.target.value)}
          placeholder="Enter reminder title"
        />
        <div>
          <label style={{ color: '#fff', display: 'block' }}>
            Select Date
          </label>
          <DatePicker
            onChange={handleDateChange}
            value={selectedDate ? dayjs(selectedDate) : null}
            style={{
              width: '100%',
              borderRadius: 4,
              backgroundColor: 'rgb(25, 25, 25)',
              color: 'white',
            }}
            placeholder="Select Date"
          />
        </div>
        <div>
          <label style={{ color: '#fff', display: 'block' }}>
            Select Time
          </label>
          <TimeInput
            value={selectedTime}
            onChange={setSelectedTime}
            placeholder="Select Time"
          />
        </div>
        <div>
          <Button
            type="primary"
            onClick={handleSave}
          >
            Save
          </Button>
        </div>

        {/* Reminders List */}
        <div style={{ marginTop: 24 }}>
          <h4 style={{ color: '#fff' }}>Reminders</h4>
          {Array.isArray(reminderData) && reminderData.length > 0 ? (
            reminderData.map((reminder: any) => (
              <div
                key={reminder.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: '#222',
                  color: '#fff',
                  padding: '8px 12px',
                  borderRadius: 4,
                  marginBottom: 8,
                }}
              >
                <div>
                  <div>
                    <b>{reminder.message || 'No Title'}</b>
                  </div>
                  <div style={{ fontSize: 12, color: '#aaa' }}>
                    {dayjs(`${reminder.reminderDate}T${reminder.reminderTime}`).format('DD/MM/YYYY, hh:mm A')}
                  </div>
                </div>
                <DeleteOutlined
                  style={{ color: '#e74c3c', fontSize: 18, cursor: 'pointer' }}
                  onClick={() => handleDelete(reminder.id)}
                  title="Delete Reminder"
                />
              </div>
            ))
          ) : (
            <div style={{ color: '#aaa', marginTop: 8 }}>No reminders found.</div>
          )}
        </div>
      </SharedInputWrapper>
    </CustomModal>
  );
};

export default ReminderModal;