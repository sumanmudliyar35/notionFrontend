import React from 'react';
import { Input } from 'antd';

interface EditableTextAreaProps {
  value: string;
  autoFocus?: boolean;
  onChange: (val: string) => void;
  onEnter?: () => void;
    onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void; // <-- Add this line

}

const CustomTextArea: React.FC<EditableTextAreaProps> = ({
  value,
  autoFocus,
  onChange,
  onEnter,
  onKeyDown, // <-- Add this line
}) => {
  return (
    <Input.TextArea
      value={value}
      autoFocus={autoFocus}
      onChange={e => onChange(e.target.value)}
       onKeyDown={e => {
        if (onKeyDown) onKeyDown(e); // <-- Call custom onKeyDown if provided
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          onEnter?.();
        }
      }}
      style={{
        width: '100%',
        opacity: 1,
        pointerEvents: 'auto',
        // position: 'absolute',
        background: '#202020',
        color: 'white',
        borderColor: "#1890ff",
        outline: "1px solid #1890ff",
        transition: 'opacity 0.2s',
        zIndex: 2,
      }}
      
    />
  );
};

export default CustomTextArea;