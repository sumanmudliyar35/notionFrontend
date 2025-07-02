import React from 'react';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';

interface DateInputProps {
  label?: string;
  value: any | null;
  onChange: (date: dayjs.Dayjs | null) => void;
  onBlur?: React.FocusEventHandler<HTMLElement>;
  placeholder?: string;
}

const DateInput: React.FC<DateInputProps> = ({
  label,
  value,
  onChange,
  onBlur, // <-- Add this line
  placeholder = "Select Date",
}) => {
  // Only use dayjs if value is a valid date string
  const dateValue = value && dayjs(value).isValid() ? dayjs(value) : null;

  return (
    <div>
      <label style={{ color: '#fff', display: 'block' }}>
        {label}
      </label>
      <DatePicker
        onChange={onChange}
        value={dateValue}
        format="DD-MM-YYYY"
        style={{
          width: '100%',
          borderRadius: 4,
          backgroundColor: 'rgb(25, 25, 25)',
          color: 'white',
        }}
        placeholder={placeholder}
        onBlur={onBlur} // <-- Add this line
      />
    </div>
  );
};

export default DateInput;