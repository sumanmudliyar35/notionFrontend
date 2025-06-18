import React, { useRef, useState } from "react";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

interface MuiInputWithDateTimeProps {
  label?: string;
  name: string;
  value: string; // ISO string: "YYYY-MM-DDTHH:mm:ss"
  onChange: (e: { target: { name: string; value: string } }) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  error?: string;
  placeholder?: string;
  required?: boolean;
 
}

const MuiInputWithDateTime: React.FC<MuiInputWithDateTimeProps> = ({
  label,
  name,
  value,
  onChange,
  onBlur,
  error,
  placeholder = "Select date and time",
  required = false,
}) => {
  const pickerRef = useRef<any>(null);
  const [open, setOpen] = useState(false);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div>
        {label && (
          <label
            htmlFor={name}
            style={{
              color: "#fff",
              display: "block",
              marginBottom: 8,
            }}
          >
            {label}{" "}
            {required && <span style={{ color: "red" }}>*</span>}
          </label>
        )}
        <DateTimePicker
          open={open}
          onOpen={() => setOpen(true)}
          onClose={() => setOpen(false)}
          value={value ? dayjs(value) : null}
          onChange={(date) => {
            onChange({
              target: {
                name,
                value: date ? date.format("YYYY-MM-DDTHH:mm:ss") : "", // Include time in ISO format
              },
            });
            setOpen(false);
          }}
          format="DD/MM/YYYY HH:mm" // Include both date and time
          slotProps={{
            layout: {
              sx: {
                color: "white",
                borderRadius: "3px",
                borderWidth: "1px",
                borderColor: "#202020",
                border: "1px solid #202020",
                backgroundColor: "black",
                "& .MuiSvgIcon-root": {
                  color: "white !important", // Make calendar icon white
                  fill: "white !important",
                },
                "& .MuiInputAdornment-root .MuiSvgIcon-root": {
                  color: "white", // Make input adornment icon white
                  fill: "white",
                },
                "& .MuiSvgIcon-root circle": {
                  display: "none", // Remove the circle background from the icon
                },
                "& .MuiPickersDay-root": {
                  color: "white",
                },
                "& .MuiPickersDay-root:hover": {
                  backgroundColor: "#333",
                },
                "& .MuiPickersCalendarHeader-root .MuiIconButton-root": {
                  color: "white",
                },
                "& .MuiPickersCalendarHeader-root .MuiIconButton-root svg": {
                  color: "white",
                  fill: "white",
                },
                
                "& .MuiPickersDay-root.Mui-selected": {
                  backgroundColor: "#e91e63",
                  color: "white",
                },
              },
            },
            day: {
              sx: {
                color: "white",
                "&:hover": {
                  backgroundColor: "#333",
                },
                "& .Mui-selected": {
                  backgroundColor: "#e91e63",
                  color: "white",
                },
              },
            },
            textField: {
              id: name,
              name,
              onBlur,
              placeholder,
              required,
              sx: {
                display: "flex",
                flexWrap: "wrap",
                height: 35, // Desired height
                backgroundColor: "rgb(25, 25, 25)",
                width: "200px",
                "& .MuiInputBase-input": {
                  padding: "0 14px",
                  boxSizing: "border-box",
                  color: "white",
                },
                "& .MuiOutlinedInput-root": {
                  color: "white", // Outlined variant color
                },
                "& .MuiInputLabel-root": {
                  color: "white", // Label color
                },
               
                "& .MuiPickersDay-root": {
                  color: "white",
                },
                "& .MuiPickersCalendarHeader-root .MuiIconButton-root": {
                  color: "white", // Month arrows color
                },
              },
              InputProps: {
                sx: {
                  width: "-webkit-fill-available", // Full width
                  color: "white", // Ensure input root is white
                  height: 35, // Ensure the input root is tall enough
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

export default MuiInputWithDateTime;