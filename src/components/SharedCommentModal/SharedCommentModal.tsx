import React, { useEffect, useState } from 'react';
import { Button } from 'antd';
import { createPortal } from 'react-dom';
import { useMention } from '../../hooks/useMention';
import CustomModal from '../customModal/CustomModal';

interface CommentModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  footer?: React.ReactNode;
  width?: number | string;
  Id: number;
  assigneeOptions: any[];
  refetch: () => void;
  onSave: (data: any) => void;
}

const SharedCommentModal: React.FC<CommentModalProps> = ({
  open,
  onClose,
  title = 'Add Comment',
  footer = null,
  width = 600,
  Id,
  assigneeOptions,
  refetch,
  onSave,
}) => {
  const {
    inputValue,
    setInputValue,
    showDropdown,
    dropdownPos,
    filteredOptions,
    inputRef,
    handleInputChange,
    handleSelectMember,
    mentionedUserIds,
    ignoreBlurRef,
  } = useMention(assigneeOptions, '');

  const [highlightedIndex, setHighlightedIndex] = React.useState(0);

  useEffect(() => {
    if (showDropdown) setHighlightedIndex(0);
  }, [showDropdown, filteredOptions.length]);

  // Focus the comment input field when the modal opens
  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open, inputRef]);

  const [error, setError] = React.useState<string | null>(null);

  const handleBlur = () => {
    if (ignoreBlurRef.current) return;
    // No-op, but you can add validation here if needed
  };

  const handleSubmit = () => {
    if (!inputValue.trim()) {
      setError('Comment is required');
      return;
    }
    setError(null);
    onSave({
      comment: inputValue,
      mentionedUserIds,
      Id,
    });
    setInputValue('');
    onClose();
  };

  return (
    <CustomModal
      open={open}
      onClose={onClose}
      title={title}
      footer={footer}
      width={width}
    >
      <div style={{ marginBottom: 20 }}>
        <textarea
          ref={inputRef}
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleBlur}
          style={{
            width: '100%',
            minHeight: 80,
            border: '1px solid #ccc',
            borderRadius: 4,
            padding: 8,
            background: 'rgb(25, 25, 25)',
            color: 'white',
            fontFamily: 'sans-serif'
          }}
          onKeyDown={(e) => {
            if (showDropdown && filteredOptions.length > 0) {
              if (e.key === 'ArrowDown') {
                e.preventDefault();
                setHighlightedIndex(i => (i + 1) % filteredOptions.length);
              } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setHighlightedIndex(i => (i - 1 + filteredOptions.length) % filteredOptions.length);
              } else if (e.key === 'Enter') {
                e.preventDefault();
                if (filteredOptions[highlightedIndex]) {
                  handleSelectMember(filteredOptions[highlightedIndex]);
                }
              }
            } else if (e.key === 'Enter') {
              if (e.shiftKey) {
                // Insert a newline
                const cursorPos = inputRef.current?.selectionStart || 0;
                const before = inputValue.slice(0, cursorPos);
                const after = inputValue.slice(cursorPos);
                const newValue = `${before}\n${after}`;
                setInputValue(newValue);
                setTimeout(() => {
                  inputRef.current?.focus();
                  inputRef.current?.setSelectionRange(cursorPos + 1, cursorPos + 1);
                }, 0);
                e.preventDefault();
              } else {
                // Submit the form
                e.preventDefault();
                handleSubmit();
              }
            }
          }}
        />
        {error && (
          <div style={{ color: 'red', marginTop: 4 }}>{error}</div>
        )}
      </div>
      {showDropdown &&
        createPortal(
          <div
            style={{
              position: 'fixed',
              top: dropdownPos.top,
              left: dropdownPos.left,
              width: dropdownPos.width,
              background: '#222',
              zIndex: 2200,
              border: '1px solid #444',
              maxHeight: 150,
              overflowY: 'auto',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            }}
          >
            {filteredOptions.map((member: any, i: number) => (
              <div
                key={member.value}
                style={{
                  padding: 8,
                  cursor: 'pointer',
                  color: 'white',
                  background: i === highlightedIndex ? '#444' : undefined,
                }}
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleSelectMember(member);
                }}
                onMouseEnter={() => setHighlightedIndex(i)}
              >
                {member.label}
              </div>
            ))}
          </div>,
          document.body
        )}
      <div style={{ textAlign: 'right' }}>
        <Button onClick={() => { onClose(); }} style={{ marginRight: 10 }}>
          Cancel
        </Button>
        <Button type="primary" onClick={handleSubmit}>
          Add Comment
        </Button>
      </div>
    </CustomModal>
  );
};

export default SharedCommentModal;
