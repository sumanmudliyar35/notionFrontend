import React, { useState, useEffect } from 'react';
import { Button, Input } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { useMention } from '../../../../hooks/useMention';
import { createPortal } from 'react-dom';
import { formatDisplayDate } from '../../../../utils/commonFunction';

interface CommentCellProps {
  comments: any[];
  rowId: number;
  openCommentModal: (row: any) => void;
  handleEditComment: (rowId: number, commentId: number, value: string, mentionedUserIds1: string[]) => void;
  handleDeleteComment: (rowId: number, commentId: number) => void;
  editingComment: { rowId: number; commentId: number } | null;
  setEditingComment: (value: { rowId: number; commentId: number } | null) => void;
  assigneeOptions: any[];
}

const CommentCell: React.FC<CommentCellProps> = ({
  comments,
  rowId,
  openCommentModal,
  handleEditComment,
  handleDeleteComment,
  editingComment,
  setEditingComment,
  assigneeOptions,
}) => {
  // Find the comment being edited
  const editingIdx = comments.findIndex(
    (c, idx) =>
      editingComment &&
      editingComment.rowId === rowId &&
      editingComment.commentId === (c.id || idx)
  );
  const editingCommentObj = editingIdx !== -1 ? comments[editingIdx] : null;

  // Only call useMention for the editing comment
  const mentionProps = useMention(
    assigneeOptions,
    editingCommentObj ? editingCommentObj.comment : ""
  );

  useEffect(() => {
    if (editingComment && mentionProps.inputRef.current) {
      mentionProps.inputRef.current.focus();
      // Move cursor to the end of the text
      const length = mentionProps.inputRef.current.value.length;
      mentionProps.inputRef.current.setSelectionRange(length, length);
    }
  }, [editingComment]);

  const handleBlur = () => {
    if (mentionProps.ignoreBlurRef.current) return;
    setEditingComment(null);
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
          editingComment &&
          editingComment.rowId === rowId &&
          editingComment.commentId === (c.id || idx);

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
                    overflow: "hidden"
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
                onClick={() => {
                  setEditingComment({ rowId, commentId: c.id || idx });
                }}
              >
                <div>
                  {/* <span style={{ whiteSpace: "pre-line" }}>
                    <strong>{c.comment}</strong>
                  </span> */}
                  <span
  style={{ whiteSpace: "pre-line" }}
  dangerouslySetInnerHTML={{
    __html: String(c?.comment).replace(
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
                ></Button>
              </div>
            )}
          </div>
        );
      })}
      <div>
        <Button size="small" icon={<PlusOutlined />} onClick={() => openCommentModal({ id: rowId })} />
      </div>
    </div>
  );
};

export default CommentCell;