import React from 'react';
import { Input } from 'antd';

interface EditableTextAreaProps {
  value: string;
  autoFocus?: boolean;
  onChange: (val: string) => void;
  onEnter?: () => void;
}

const CustomTextArea: React.FC<EditableTextAreaProps> = ({
  value,
  autoFocus,
  onChange,
  onEnter,
}) => {
  return (
    <Input.TextArea
      value={value}
      autoFocus={autoFocus}
      onChange={e => onChange(e.target.value)}
      style={{
        width: '100%',
        opacity: 1,
        pointerEvents: 'auto',
        position: 'absolute',
        background: '#202020',
        color: 'white',
        top: 0,
        left: 0,
        transition: 'opacity 0.2s',
        zIndex: 2,
      }}
      onKeyDown={e => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          onEnter?.();
        }
      }}
    />
  );
};

export default CustomTextArea;