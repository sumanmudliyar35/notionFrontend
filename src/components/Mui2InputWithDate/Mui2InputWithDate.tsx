import React, { useRef, useState, useEffect } from "react";
import dayjs from "dayjs";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

interface MuiInputWithDateProps {
  label?: string;
  name: string;
  value: string; // ISO string: "YYYY-MM-DD"
  onChange: (e: { target: { name: string; value: string } }) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  error?: string;
  placeholder?: string;
  required?: boolean;
  open?: boolean;
  setOpen?: (open: boolean) => void;
}

const Mui2InputWithDate: React.FC<MuiInputWithDateProps> = ({
  label,
  name,
  value,
  onChange,
  onBlur,
  error,
  placeholder = "Select date",
  required = false,
  open: controlledOpen,
  setOpen: setControlledOpen,
}) => {
  const pickerRef = useRef<any>(null);
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);

  // Use controlled open if provided, otherwise use internal state
  const open = controlledOpen !== undefined ? controlledOpen : uncontrolledOpen;
  const setOpen = setControlledOpen || setUncontrolledOpen;

  useEffect(() => {
    if (controlledOpen !== undefined) {
      setUncontrolledOpen(controlledOpen);
    }
  }, [controlledOpen]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div>
        {label && (
          <label htmlFor={name} style={{ color: "#fff", display: "block" }}>
            {label} {required && <span style={{ color: "red" }}>*</span>}
          </label>
        )}
        <DatePicker
          format="DD-MM-YYYY"
          open={open}
          onOpen={() => setOpen(true)}
          onClose={() => setOpen(false)}
          name={name}
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
                  color: 'white !important',
                  fill: 'white !important',
                },
                '& .MuiInputAdornment-root .MuiSvgIcon-root': {
                  color: 'white',
                  fill: 'white',
                },
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
                width: "100%",
                  fontFamily: 'sans-serif', // <-- ensure this is present

                height: 35,
                borderRadius: '3px',
                backgroundColor: 'rgb(25, 25, 25)',
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
                '& .MuiPickersDay-root': {
                  color: 'white',
                },
                '& .MuiPickersCalendarHeader-root .MuiIconButton-root': {
                  color: 'white',
                },
              },
              InputProps: {
                sx: {
                  color: 'white',
                  height: 35,
                },
              },
              error: !!error,
              helperText: error,
              inputRef: pickerRef,
              onClick: () => setOpen(true),
            },
          }}
        />
      </div>
    </LocalizationProvider>
  );
};

export default Mui2InputWithDate;