import React from "react";
import { Tag } from "antd";

interface CustomTagProps {
  name:any;
  color?: string;
  style?: React.CSSProperties;
}

const CustomTag: React.FC<CustomTagProps> = ({ name, color = "#23272f", style }) => (
  <Tag
    color={color}
    style={{
      color: "#fff",
      background: color,
      borderRadius: 12,
      fontSize: 13,
      fontWeight: 500,
      border: "1px solid #333",
      padding: "2px 10px",
      marginRight: 4,
      marginBottom: 2,
      display: "inline-block",
      ...style,
    }}
  >
    {name}
  </Tag>
);

export default CustomTag;