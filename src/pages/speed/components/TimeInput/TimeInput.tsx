import React, { useState } from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import dayjs from 'dayjs';

interface TimeInputProps {
  value: string | null; // ISO time string: "HH:mm:ss"
  onChange: (time: string | null) => void;
  placeholder?: string;
}

const TimeInput: React.FC<TimeInputProps> = ({
  value,
  onChange,
  placeholder = 'Select Time',
}) => {
  const [open, setOpen] = useState(false);

  const handleTimeChange = (newValue: any) => {
    if (newValue) {
      // Convert Dayjs object to ISO time string
      const timeString = newValue.format('HH:mm:ss');
      onChange(timeString);
    } else {
      onChange(null); // Clear the value if no time is selected
    }
    // setOpen(false); // Close after selection
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <TimePicker
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        onChange={handleTimeChange}
        value={value ? dayjs(value, 'HH:mm:ss') : null}
        slotProps={{
          textField: {
            placeholder: placeholder,
            sx: {
              width: '100%',
              
              fontFamily: 'sans-serif',
              height: '30px',
              borderRadius: '4px',
              backgroundColor: 'rgb(25, 25, 25)',
              color: 'white',
              border: '1px solid #ccc',
              '& .MuiInputBase-root': {
                backgroundColor: 'rgb(25, 25, 25)',
                borderRadius: '4px',
                color: 'white'
              },
              '& .MuiInputBase-input': {
                padding: '0 14px',
                boxSizing: 'border-box',
                color: 'white',
              },
              '& .MuiOutlinedInput-root': {
                color: 'white',
              },
              '& .MuiInputLabel-root': {
                color: 'white',
              },
              // Hide the clock icon
              '& .MuiInputAdornment-root': {
                display: 'none',
              },
            },
            InputProps: {
              sx: {
                color: 'white',
                height: '30px',
                fontFamily: 'sans-serif',
                fontSize: '14px',
                minHeight: '30px',
              },
              onFocus: () => setOpen(true), // Open popup on focus
              onClick: () => setOpen(true), // Open popup on click
            },
          },
        }}
      />
    </LocalizationProvider>
  );
};

export default TimeInput;