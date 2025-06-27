import React, { useState } from "react";
import { Tag } from "antd";
import { CloseOutlined } from "@ant-design/icons";

interface CustomTagProps {
  name: any;
  color?: string;
  style?: React.CSSProperties;
  onClose?: () => void;
}

const CustomTag: React.FC<CustomTagProps> = ({
  name,
  color = "#23272f",
  style,
  onClose,
}) => {
  const [hovered, setHovered] = useState(false);

  return (
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
        display: "inline-flex",
        alignItems: "center",
        ...style,
      }}
    >
      <span style={{ marginRight: 8 }}>{name}</span>
      {onClose && (
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            cursor: "pointer",
            marginLeft: 4,
          }}
          onClick={(e) => {
            e.stopPropagation();
            if (onClose) onClose();
          }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <CloseOutlined
            style={{ color: hovered ? "red" : "#fff", fontSize: 13 }}
          />
        </span>
      )}
    </Tag>
  );
};

export default CustomTag;