import React, { useState } from 'react';
import * as Yup from 'yup';
import dayjs from 'dayjs';
import CustomInput from '../../../../components/customInput/CustomInput';
import DateInput from '../../../../components/CustomDateInput/CustomDateInput';
import CustomModal from '../../../../components/customModal/CustomModal';
import TagSelector from '../../../../components/customSelectModal/CustomSelectModal'; // adjust path as needed
import { formatDurationShort } from '../../../../utils/commonFunction';

interface YourModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  onSave: (data: { name: string; startDate: string; endDate: string; time: any, interval: any }) => void;
}

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  startDate: Yup.date().required('Start date is required'),
  endDate: Yup.date().required('End date is required'),
});

// Generate time options from 0:00 to 9:00 with 15 min interval
// const timeOptions = Array.from({ length: 10 * 4 }, (_, i) => {
//   const totalMinutes = (i + 1) * 15; // start from 15 minutes, not 0
//   const hour = Math.floor(totalMinutes / 60);
//   const minute = totalMinutes % 60;
//   let label = '';
//   if (hour > 0) {
//     label += `${hour} hour${hour > 1 ? 's' : ''}`;
//   }
//   if (minute > 0) {
//     if (label) label += ' ';
//     label += `${minute} minute${minute > 1 ? 's' : ''}`;
//   }
//   return { id: label, label : formatDurationShort(label), value: label };
// });

const timeOptions = Array.from({ length: 12 * 4 }, (_, i) => {
  const totalMinutes = (i + 1) * 15; // start from 15 minutes, not 0
  const hour = Math.floor(totalMinutes / 60);
  const minute = totalMinutes % 60;
  // Format as "H:MM hr"
  const label = `${hour}:${minute.toString().padStart(2, '0')} min`;
  return { id: label, label, value: label };
});

console.log(timeOptions);

const intervalOptions = [
  { id: 1, label: "Shoot", value: 1 },
  { id: "s1", label: "Shift 1", value: "s1" },
  { id: "s2", label: "Shift 2", value: "s2" },
  { id: 3, label: "3 Days", value: 3 },
  { id: 7, label: "7 Days", value: 7 },
  { id: 15, label: "15 Days", value: 15 },
  { id: 30, label: "1 Month", value: 30 },
  { id: 60, label: "2 Months", value: 60 },
  { id: 90, label: "3 Months", value: 90 },
  { id: 180, label: "6 Months", value: 180 },
  { id: 365, label: "1 Year", value: 365 },
];
const RecursiveTaskModal: React.FC<YourModalProps> = ({ open, onClose, title, onSave }) => {
  const [name, setName] = useState('');
  const [time, setTime] = useState('');
    const [interval, setInterval] = useState(intervalOptions[0].value);
  
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ name?: string; startDate?: string; endDate?: string }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const values = { name, startDate, endDate };
    const validation = validationSchema.validate(values, { abortEarly: false });
    validation
      .then(() => {
        onSave({
          name,
          startDate: startDate ? dayjs(startDate).format('YYYY-MM-DD') : '',
          endDate: endDate ? dayjs(endDate).format('YYYY-MM-DD') : '',
          time,
          interval,
        });
        onClose();
      })
      .catch((err: any) => {
        const newErrors: any = {};
        err.inner.forEach((validationError: any) => {
          newErrors[validationError.path] = validationError.message;
        });
        setErrors(newErrors);
      });
  };

  return (
    <CustomModal
      title={title || 'Select Date and Time'}
      onClose={onClose}
      open={open}
    >
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <CustomInput
            label="Name"
            name="name"
            value={name}
            onChange={e => setName(e.target.value)}
            onBlur={() => {}}
            placeholder="Enter name"
            error={errors.name || ''}
          />

            <TagSelector
                      options={intervalOptions}
                      value={interval}
                      onChange={(val: any) => setInterval(val)}
                      placeholder="Select interval"
                      allowCreate={false}
                      horizontalOptions={false}
                      isWithDot={false}
                    />

          <TagSelector
          placeholder="Select time"
          options={timeOptions}
          value={time || null}
          onChange={val => setTime(val ? String(val) : '')}
          allowCreate={false}
          horizontalOptions={false}
          isWithDot={false}
        />
          
          <DateInput
            label="Start Date"
            value={startDate}
            onChange={date => setStartDate(date ? dayjs(date).format('YYYY-MM-DD') : null)}
            placeholder="Select start date"
          />
          {errors.startDate && (
            <div style={{ color: 'red', fontSize: 12 }}>{errors.startDate}</div>
          )}
          <DateInput
            label="End Date"
            value={endDate}
            onChange={date => setEndDate(date ? dayjs(date).format('YYYY-MM-DD') : null)}
            placeholder="Select end date"
          />
          {errors.endDate && (
            <div style={{ color: 'red', fontSize: 12 }}>{errors.endDate}</div>
          )}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 16 }}>
            <button type="button" onClick={onClose}>Cancel</button>
            <button type="submit" style={{ background: '#1677ff', color: '#fff', border: 'none', padding: '6px 16px', borderRadius: 4 }}>
              Save
            </button>
          </div>
        </div>
      </form>
    </CustomModal>
  );
};

export default RecursiveTaskModal;