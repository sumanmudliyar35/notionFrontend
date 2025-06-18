import React, { useState } from 'react';
import { DatePicker, Button } from 'antd';
import dayjs from 'dayjs';
import CustomModal from '../customModal/CustomModal';
import { SharedInputWrapper } from '../../style/sharedStyle';
import TimeInput from '../../pages/leads/components/TimeInput/TimeInput';

interface DateTimeModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  onSave?: (date: string | null, time: string | null, leadID: any) => void;
  leadID?: any;

}

const ReminderModal = ({ open, onClose, title, onSave, leadID }: DateTimeModalProps) => {

  console.log('DateTimeModal data:',);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const handleDateChange = (date: dayjs.Dayjs | null) => {
    setSelectedDate(date ? date.format('YYYY-MM-DD') : null);
  };

  const handleSave = () => {
    console.log('Selected Date:', selectedDate);
    console.log('Selected Time:', selectedTime);
    if (onSave) {
      onSave(selectedDate, selectedTime, leadID);
    }
    onClose(); // Close the modal after saving
  };

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
            value={selectedDate ? dayjs(selectedDate) : null  }
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
      </SharedInputWrapper>
    </CustomModal>
  );
};

export default ReminderModal;