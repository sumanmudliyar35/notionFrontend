import React, { useRef, useState } from "react";
import dayjs from "dayjs";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

interface MuiInputWithDateProps {
  label?: string;
  name: string;
  value: string; // ISO string: "YYYY-MM-DD"
  onChange: (e: { target: { name: string; value: string } } ) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  error?: string;
  placeholder?: string;
  required?: boolean;
}

const MuiInputWithDate: React.FC<MuiInputWithDateProps> = ({
  label,
  name,
  value,
  onChange,
  onBlur,
  error,
  placeholder = "Select date",
  required = false,
}) => {


    const pickerRef = useRef<any>(null);
  const [open, setOpen] = useState(false);


  return (
  <LocalizationProvider dateAdapter={AdapterDayjs}>
    <div>
      {label && (
        <label htmlFor={name} style={{ color: "#fff", display: "block" }}>
          {label} {required && <span style={{ color: "red" }}>*</span>}
        </label>
      )}
      <DatePicker
        open={open}
          onOpen={() => setOpen(true)}
            format="DD/MM/YYYY" // <-- Add this line

          onClose={() => setOpen(false)}
        value={value ? dayjs(value) : null}
        onChange={date => {
          onChange({
            target: {
              name,
              value: date ? date.format("YYYY-MM-DD") : "",
            },
          });
       setOpen(false);

        }}
        slotProps={{
          layout: {
            sx: {
              color: 'white',
              borderRadius: '3px',
              borderWidth: '1px',
              borderColor: '#202020',
              border: '1px solid #202020',
              backgroundColor: 'black',
               '& .MuiSvgIcon-root': {
      color: 'white !important',      // Make calendar icon white
      fill: 'white !important',
    },
    '& .MuiInputAdornment-root .MuiSvgIcon-root': {
      color: 'white',      // Make input adornment icon white
      fill: 'white',
    },
    // Remove the circle background from the icon if present
    '& .MuiSvgIcon-root circle': {
      display: 'none',
    },
              '& .MuiPickersDay-root': {
      color: 'white',
    },
              '& .MuiPickersDay-root:hover': {
                backgroundColor: '#333',
              },
              '& .MuiPickersCalendarHeader-root .MuiIconButton-root': {
  color: 'white',
},
'& .MuiPickersCalendarHeader-root .MuiIconButton-root svg': {
  color: 'white',
  fill: 'white',
},
              '& .MuiPickersDay-root.Mui-selected': {
                backgroundColor: '#e91e63',
                color: 'white',
              },
            },
          },
          day: {
            sx: {
              color: 'white',
              '&:hover': {
                backgroundColor: '#333',
              },  

    // Optionally, make selected day stand out
    '& .Mui-selected': {
      backgroundColor: '#e91e63',
      color: 'white',
    },
            }
          },
          textField: {
            id: name,
            name,
            onBlur,
            placeholder,
            required,
            sx: {
              display: 'flex',
              flexWrap: 'wrap',
        height: 35, // or your desired height
        borderRadius: '3px',
        backgroundColor: 'rgb(25, 25, 25)',
        '& .MuiInputBase-input': {
          padding: '0 14px',
          boxSizing: 'border-box',
          color: 'white',

        },
         '& .MuiOutlinedInput-root': {
        color: 'white', // <-- this for outlined variant
      },
      '& .MuiInputLabel-root': {
        color: 'white', // <-- label color
      },
       '& .MuiPickersDay-root': {
        color: 'white',
      },

       '& .MuiPickersCalendarHeader-root .MuiIconButton-root': {
        color: 'white', // <-- make month arrows white
      },
      },
      InputProps: {
        sx: {
          width:'200px',
          color: 'white', // <-- ensure input root is white

          height: 35, // also ensure the input root is tall enough
        },
      },
            error: !!error,
            helperText: error,
            inputRef: pickerRef,
                         onClick: () => setOpen(true), // Open calendar on input click


          },
        }}
      />
    </div>
  </LocalizationProvider>
  );
};

export default MuiInputWithDate;