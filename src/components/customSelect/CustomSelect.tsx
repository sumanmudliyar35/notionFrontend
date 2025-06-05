import React from "react";
import Select from "react-select";

const customSelectStyles = {
  menu: (provided: any) => ({
    ...provided,
    backgroundColor: "#181818",
    color: "#fff",
  }),
  option: (provided: any, state: any) => ({
    ...provided,
    backgroundColor: state.isFocused ? "#23272f" : "#181818",
    color: "#fff",
    cursor: "pointer",
  }),
  multiValue: (provided: any) => ({
    ...provided,
    backgroundColor: "#23272f",
    color: "#fff",
  }),
  multiValueLabel: (provided: any) => ({
    ...provided,
    color: "#fff",
  }),
  multiValueRemove: (provided: any) => ({
    ...provided,
    color: "#fff",
    ':hover': {
      backgroundColor: '#333',
      color: '#fff',
    },
  }),
  control: (provided: any, state: any) => ({
    ...provided,
    backgroundColor: "#181818",
    color: "#fff",
    borderColor: "#23272f",
    boxShadow: "none", // Remove blue shadow on focus
    outline: "none",   // Remove blue outline on focus
    "&:hover": {
      borderColor: "#23272f",
    },
  }),
  singleValue: (provided: any) => ({
    ...provided,
    color: "#fff",
  }),
  input: (provided: any) => ({
    ...provided,
    color: "#fff",
  }),
  placeholder: (provided: any) => ({
    ...provided,
    color: "#aaa",
  }),
};

interface CustomSelectProps {
  isMulti?: boolean;
  options: { label: string; value: string }[];
  value: any;
  onChange: (val: any) => void;
  placeholder?: string;
  [key: string]: any; // for other props
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  isMulti = false,
  options,
  value,
  onChange,
  placeholder = "Select...",
  ...rest
}) => (
  <Select
    isMulti={isMulti}
    options={options}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    styles={customSelectStyles}
    {...rest}
  />
);

export default CustomSelect;