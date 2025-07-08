import React, { useState, useEffect, useRef } from 'react';
import { Button, Input } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { useMention } from '../../../../hooks/useMention';
import { createPortal } from 'react-dom';
import { formatDisplayDate } from '../../../../utils/commonFunction';

interface CommentCellProps {
  comments: any[];
  rowId: number;
  openCommentModal: (rowId: any) => void;
  handleEditComment: (rowId: number, commentId: number, value: string, mentionedUserIds1: string[]) => void;
  handleDeleteComment: (rowId: number, commentId: number) => void;
  // Remove these props since we'll manage them internally
  // editingComment: { rowId: number; commentId: number } | null;
  // setEditingComment: (value: { rowId: number; commentId: number } | null) => void;
  assigneeOptions: any[];
    visible?: boolean; // Add this prop
    isCommentText?: boolean; // Add this prop for type checking


}

const CommentCell: React.FC<CommentCellProps> = ({
  comments,
  rowId,
  openCommentModal,
  handleEditComment,
  handleDeleteComment,
  // Remove these from the destructuring
  // editingComment,
  // setEditingComment,
  assigneeOptions,
  visible = true, // Default to true if not provided
  isCommentText = true, // Default to true for type checking
}) => {



   if (!visible) {
    return (
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: '#aaa' }}>{comments.length > 0 ? `${comments.length} comments hidden` : 'No comments'}</span>
        <Button 
          size="small" 
          icon={<PlusOutlined />} 
          onClick={() => openCommentModal({ id: rowId })}
        />
      </div>
    );
  }

  // Create local state to manage editing
  const [localEditingComment, setLocalEditingComment] = useState<{ rowId: number; commentId: number } | null>(null);

  // Track whether a comment has been initialized to prevent input value issues
  const hasInitializedRef = useRef(false);

  // Find the comment being edited
  const editingIdx = comments.findIndex(
    (c, idx) => {
      if (!localEditingComment) return false;
      if (localEditingComment.rowId !== rowId) return false;
      
      // Compare as strings to avoid type issues
      return String(c.id || idx) === String(localEditingComment.commentId);
    }
  );


  const editingCommentObj = editingIdx !== -1 ? comments[editingIdx] : null;

  // Only call useMention for the editing comment
  const mentionProps = useMention(
    assigneeOptions,
    ""  // Start with empty string and initialize in useEffect
  );

  // Initialize the input value when editing starts
  useEffect(() => {
    if (editingCommentObj && !hasInitializedRef.current) {
      console.log("Setting initial value:", editingCommentObj.comment);
      mentionProps.setInputValue(editingCommentObj.comment || "");
      hasInitializedRef.current = true;
    }
  }, [editingCommentObj]);

  // Reset the initialization flag when editing stops
  useEffect(() => {
    if (!localEditingComment) {
      hasInitializedRef.current = false;
    }
  }, [localEditingComment]);

  // Focus and position cursor when editing
  useEffect(() => {
    if (localEditingComment && mentionProps.inputRef.current) {
      // Use a timeout to ensure DOM is updated
      setTimeout(() => {
        if (mentionProps.inputRef.current) {
          mentionProps.inputRef.current.focus();
          // Move cursor to the end of the text
          const length = mentionProps.inputRef.current.value.length;
          mentionProps.inputRef.current.setSelectionRange(length, length);
        }
      }, 50);
    }
  }, [localEditingComment]);

  const handleBlur = () => {
    if (mentionProps.ignoreBlurRef.current) return;

    console.log("Blur event triggered, resetting editing comment");
    setLocalEditingComment(null);
  };

  // Add highlighted index state
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  useEffect(() => {
    if (mentionProps.showDropdown) setHighlightedIndex(0);
  }, [mentionProps.showDropdown, mentionProps.filteredOptions.length]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {comments.map((c: any, idx: number) => {
        const isEditing =
          localEditingComment &&
          localEditingComment.rowId === rowId &&
          localEditingComment.commentId === (c.id || idx);

        return (
          <div key={c.id || idx} style={{ borderBottom: "1px solid #333", paddingBottom: 4 }}>
            {isEditing ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <textarea
                  ref={el => {
                    mentionProps.inputRef.current = el;
                    // Auto-resize on mount
                    if (el) {
                      el.style.height = "auto";
                      el.style.height = el.scrollHeight + "px";
                    }
                  }}
                  value={mentionProps.inputValue}
                  onChange={e => {
                    mentionProps.handleInputChange(e);
                    // Auto-resize on change
                    const el = e.target;
                    el.style.height = "auto";
                    el.style.height = el.scrollHeight + "px";
                  }}
                  style={{
                    marginBottom: 4,
                    background: "#202020",
                    color: "white",
                    fontFamily: "sans-serif",
                    resize: "none", // Prevent manual resize
                    overflow: "hidden",
                    padding: "8px",
                    borderRadius: "4px",
                    border: "1px solid #444"
                  }}
                  onKeyDown={e => {
                    if (mentionProps.showDropdown && mentionProps.filteredOptions.length > 0) {
                      if (e.key === "ArrowDown") {
                        e.preventDefault();
                        setHighlightedIndex(i => (i + 1) % mentionProps.filteredOptions.length);
                      } else if (e.key === "ArrowUp") {
                        e.preventDefault();
                        setHighlightedIndex(i => (i - 1 + mentionProps.filteredOptions.length) % mentionProps.filteredOptions.length);
                      } else if (e.key === "Enter") {
                        e.preventDefault();
                        if (mentionProps.filteredOptions[highlightedIndex]) {
                          mentionProps.handleSelectMember(mentionProps.filteredOptions[highlightedIndex]);
                        }
                      }
                    } else if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleEditComment(rowId, c.id || idx, mentionProps.inputValue, mentionProps.mentionedUserIds);
                      setLocalEditingComment(null);
                    } else if (e.key === "Escape") {
                      e.preventDefault();
                      setLocalEditingComment(null);
                    }
                  }}
                  onBlur={handleBlur}
                  rows={1}
                />
                {mentionProps.showDropdown &&
                  createPortal(
                    <div
                      style={{
                        position: "fixed",
                        top: mentionProps.dropdownPos.top,
                        left: mentionProps.dropdownPos.left,
                        width: mentionProps.dropdownPos.width,
                        background: "#222",
                        zIndex: 2200,
                        border: "1px solid #444",
                        maxHeight: 150,
                        overflowY: "auto",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                      }}
                    >
                      {mentionProps.filteredOptions.map((member: any, i: number) => (
                        <div
                          key={member.value}
                          style={{
                            padding: 8,
                            cursor: "pointer",
                            color: "white",
                            background: i === highlightedIndex ? "#444" : undefined,
                          }}
                          onMouseDown={e => {
                            e.preventDefault();
                            mentionProps.handleSelectMember(member);
                          }}
                          onMouseEnter={() => setHighlightedIndex(i)}
                        >
                          {member.label}
                        </div>
                      ))}
                    </div>,
                    document.body
                  )}
              </div>
            ) : (
              <div
                style={{
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log("Starting edit for comment:", c.id || idx);
                  
                  // First reset input value
                  mentionProps.setInputValue(c.comment || "");
                  
                  // Then set editing state
                  setLocalEditingComment({ rowId, commentId: c.id || idx });
                }}
              >
                <div>
                  <span
                    style={{ whiteSpace: "pre-line" }}
                    dangerouslySetInnerHTML={{
                      __html: String(c?.comment || "").replace(
                        /((https?:\/\/|www\.)[^\s]+)/g,
                        url => {
                          const href = url.startsWith('http') ? url : `https://${url}`;
                          return `<a href="${href}" target="_blank" rel="noopener noreferrer" style="color:#4fa3ff;text-decoration:underline;">${url}</a>`;
                        }
                      )
                    }}
                  />
                  <div style={{ fontSize: 12, color: "#aaa" }}>
                   By: {c.givenBy || "Unknown"} | At: {formatDisplayDate(c.givenAt)}
                  </div>
                </div>
                <Button
                  size="small"
                  danger
                  icon={
                    <DeleteOutlined
                      style={{
                        filter: "brightness(0.7) grayscale(0.7)",
                      }}
                    />
                  }
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteComment(rowId, c.id || idx);
                  }}
                  style={{
                    background: "lightgray",
                    borderColor: "lightgray",
                  }}
                />
              </div>
            )}
          </div>
        );
      })}
      <div>
              {isCommentText ? (
                <span
          style={{
            color: "#4fa3ff",
            cursor: "pointer",
            fontSize: 14,
            textDecoration: "none",
            padding: "2px 6px",
            borderRadius: 4,
            background: "#23272f",
            display: "inline-block",
          }}
          onClick={() => openCommentModal({ id: rowId })}
        >
          Add comment
        </span>
      
              ): (
              <Button size="small" icon={<PlusOutlined />} onClick={() => openCommentModal({ id: rowId })} />
              )}
            </div>
    </div>
  );
};

export default CommentCell;