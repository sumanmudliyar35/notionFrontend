import React from "react";
import Select from "react-select";

const customSelectStyles = {

  menuList: (base: any) => ({
      ...base,
    }),
  menu: (provided: any) => ({
    ...provided,
    backgroundColor: "#181818",
    color: "#fff",
    zIndex: 9999, // Ensure the menu appears above other elements
  }),
  option: (provided: any, state: any) => ({
    ...provided,
    backgroundColor: state.isFocused ? "#23272f" : "#181818",
    color: "#fff",
    cursor: "pointer",
  
  }),
  optionList: (provided: any) => ({
    ...provided,
    zIndex: 9999, // Ensure the option list appears above other elements
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
  options: { label: any; value: any }[];
  value: any;
  onChange: (val: any) => void;
  placeholder?: string;
  menuIsOpen?: boolean; // <-- add this
  label?: string; // <-- add label prop
  [key: string]: any; // for other props
  width?: string; // optional width prop
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  isMulti = false,
  options,
  value,
  onChange,
  placeholder = "Select...",
  menuIsOpen,
  label,
  width,// default width
  ...rest
}) => (
  <div style={{ width }}>
    {label && (
      <label style={{ color: "#fff", display: "block" }}>
        {label}
      </label>
    )}
    <Select
      isMulti={isMulti}
      options={options}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      styles={customSelectStyles}
      menuIsOpen={menuIsOpen}
      {...rest}
    />
  </div>
);

export default CustomSelect;