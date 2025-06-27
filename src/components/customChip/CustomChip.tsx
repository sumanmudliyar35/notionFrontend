import React from 'react';
import Chip from '@mui/material/Chip';
import CrossIcon from '../../assets/icons/CrossIcon';


interface CustomChipProps {
  label: string;
  onDelete?: () => void;
}

const CustomChip: React.FC<CustomChipProps> = ({ label, onDelete }) => {
  return (
    <Chip
      label={label}
      onDelete={onDelete}
      deleteIcon={<CrossIcon />}
      style={{
        color: "#fff",
        borderRadius: 12,
      fontSize: 13,
      fontWeight: 500,
      border: "1px solid #333",
      padding: "2px 10px",
      marginRight: 4,
      marginBottom: 2,
      display: "inline-flex",
      alignItems: "center",
    }}    />
  );
};

export default CustomChip;