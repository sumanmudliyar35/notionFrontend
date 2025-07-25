import React, { useEffect, useState } from 'react';
import CustomModal from '../../../../components/customModal/CustomModal';
import { SharedInputWrapper } from '../../../../style/sharedStyle';
import { DatePicker, Button, Switch } from 'antd';
import dayjs from 'dayjs';
import TimeInput from '../TimeInput/TimeInput';
import TagSelector from '../../../../components/customSelectModal/CustomSelectModal';
import CustomInput from '../../../../components/customInput/CustomInput';
import { useGetReminderByLeadAndUser } from '../../../../api/get/getReminderByLeadAndUser';
import { DeleteOutlined } from '@ant-design/icons';
import { formatDisplayDate, formatDisplayTime } from '../../../../utils/commonFunction';
import { useUpdateReminder } from '../../../../api/put/updateReminder';

interface DateTimeModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  onSave?: (date: string | null, time: string | null, leadID: any, reminder?: { enabled: boolean, before: number | null, reminderTime: string | null }) => void;
  leadID?: any;
  data?: any;
  userId: any;
}

const REMINDER_UNIT_OPTIONS = [
  { id: 'minutes', label: 'Minutes' },
  { id: 'hours', label: 'Hours' },
  { id: 'days', label: 'Days' },
];

const REMINDER_VALUE_OPTIONS: Record<string, { id: number, label: string }[]> = {
  minutes: [
    { id: 10, label: '10' },
    { id: 30, label: '30' },
    { id: 60, label: '60' },
  ],
  hours: Array.from({ length: 24 }, (_, i) => ({ id: i + 1, label: String(i + 1) })),
  days: Array.from({ length: 7 }, (_, i) => ({ id: i + 1, label: String(i + 1) })),
};

const DateTimeModal = ({ open, onClose, title, onSave, leadID, data, userId }: DateTimeModalProps) => {
  const [selectedDate, setSelectedDate] = useState<string | null>(data?.date || null);
  const [selectedTime, setSelectedTime] = useState<string | null>(data?.time || null);
  console.log("leadID", leadID, "userId", userId);
  const {data: reminderData, refetch: refetchReminder} = useGetReminderByLeadAndUser(leadID, userId);

  useEffect(() => { 
refetchReminder

  },[leadID, userId]);

  // const [reminderTime, setReminderTime] = useState<string | null>( null);

  // Reminder state
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [reminderBefore, setReminderBefore] = useState<number | null>(null);
  const [reminderDate, setReminderDate] = useState<string | null>(null);
  const [reminderUnit, setReminderUnit] = useState<string>('minutes');
  const [reminderValue, setReminderValue] = useState<number | null>(null);

  const handleDateChange = (date: dayjs.Dayjs | null) => {
    setSelectedDate(date ? date.format('YYYY-MM-DD') : null);
  };

  const handleSave = () => {

     let beforeValue = reminderBefore;
  if (reminderEnabled) {
    if (reminderUnit === "hours" && beforeValue) {
      beforeValue = beforeValue * 60;
    }
    if (reminderUnit === "days" && beforeValue) {
      beforeValue = beforeValue * 24 * 60;
    }
  }
    if (onSave) {
      onSave(selectedDate, selectedTime, leadID, reminderEnabled ? { enabled: true, before: beforeValue, reminderTime: selectedTime } : { enabled: false, before: null, reminderTime: null });
    }
    onClose(); // Close the modal after saving
  };


  const useUpdateReminderMutate = useUpdateReminder();


  const handleDeleteReminder= async(reminderId: number) => {
    try {
      await useUpdateReminderMutate.mutateAsync([{deletedAt: new Date()}, reminderId]);
      refetchReminder(); // Refetch reminders after deletion
    } catch (error) {
      console.error("Error deleting reminder:", error);
    }


  }

  return (
    <CustomModal
      title={title || 'Select Date and Time'}
      onClose={onClose}
      open={open}
    >
      <SharedInputWrapper>
        <div>
          <label style={{ color: '#fff', display: 'block' }}>
            Select Date
          </label>
          <DatePicker
            onChange={handleDateChange}
            value={
              !selectedDate || selectedDate === "0000-00-00"
                ? null
                : dayjs(selectedDate)
            }
            format="DD-MM-YYYY"
            style={{
              width: '100%',
              borderRadius: 4,
              backgroundColor: 'rgb(25, 25, 25)',
              color: 'white',
            }}
            placeholder="DD-MM-YYYY"
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
        <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
          <label style={{ color: '#fff' }}>
            Reminder
          </label>
          <Switch
            checked={reminderEnabled}
            onChange={setReminderEnabled}
            style={{ marginRight: 8, width: 'fit-content',  }}
          />
          {/* <span style={{ color: '#fff', marginRight: 8, width:'fit-content' }}>
            Enable Reminder
          </span> */}
          {reminderEnabled && (

            <>
              <div>
                <TagSelector
                  options={REMINDER_UNIT_OPTIONS}
                  value={reminderUnit}
                  onChange={val => setReminderUnit(val as string)}
                  placeholder="Select unit"
                  allowCreate={false}
                  isWithDot={false}
                />
              </div>
              <div style={{ marginTop: 8 }}>
                <CustomInput
                  type="number"
                  value={reminderBefore || ''}
                  onChange={e => setReminderBefore(Number(e.target.value))}
                  placeholder={`Enter reminder value in ${reminderUnit}`}


/>
                {/* <TagSelector
                  options={REMINDER_VALUE_OPTIONS[reminderUnit]}
                  value={reminderValue}
                  onChange={val => setReminderValue(val as number)}
                  placeholder={`Select ${reminderUnit}`}
                  allowCreate={false}
                  isWithDot={false}
                  horizontalOptions={false}
                /> */}
              </div>
            </>
          )}
        </div>

        {/* Display reminders below the form */}
        {Array.isArray(reminderData) && reminderData.length > 0 && (
          <div style={{ margin: '16px 0 8px 0' }}>
            <label style={{ color: '#fff', fontWeight: 600 }}>Existing Reminders:</label>
            {reminderData.map((reminder: any) => (
              <div
                key={reminder.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: '#23272e',
                  color: '#fff',
                  padding: '8px 12px',
                  borderRadius: 6,
                  marginTop: 8,
                }}
              >
                <span>
                  <b>Reminder on</b>
                  &nbsp;|&nbsp;
                  <span style={{ color: '#81c784' }}>{formatDisplayDate(reminder.reminderDate)} at {formatDisplayTime(reminder.reminderTime)}</span>
                </span>
                <DeleteOutlined
                  style={{ color: "#e57373", cursor: "pointer", fontSize: 18 }}
                  onClick={() => handleDeleteReminder(reminder.id)}
                  
                
                />
              </div>
            ))}
          </div>
        )}

        <div>
          <Button
            type="primary"
            onClick={handleSave}
            style={{ marginTop: 16 }}
          >
            Save
          </Button>
        </div>
      </SharedInputWrapper>
    </CustomModal>
  );
};

export default DateTimeModal;