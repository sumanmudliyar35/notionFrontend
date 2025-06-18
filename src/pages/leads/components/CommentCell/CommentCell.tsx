import React, { useState, useEffect } from 'react';
import { Button, Input } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { useMention } from '../../../../hooks/useMention';
import { createPortal } from 'react-dom';

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
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {comments.map((c: any, idx: number) => {
        const isEditing = editingComment && editingComment.rowId === rowId && editingComment.commentId === (c.id || idx);


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
  } = useMention(assigneeOptions, c.comment);

        useEffect(() => {
          if (editingComment && inputRef.current) {
            inputRef.current.focus();
          }
        }, [editingComment]);

        const handleBlur = () => {
          if (ignoreBlurRef.current) return;
          setEditingComment(null);
        };

        return (
          <div key={c.id || idx} style={{ borderBottom: '1px solid #333', paddingBottom: 4 }}>
            {isEditing ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <textarea
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) =>{handleInputChange(e)}}
                  style={{ marginBottom: 4 , background: '#202020', color: 'white'}}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleEditComment(rowId, c.id || idx, inputValue, mentionedUserIds);
                    }
                  }}
                  onBlur={handleBlur}
                />

             

                {/* <div>
                  <Button
                    size="small"
                    type="primary"
                    onClick={() => {
                      console.log('Saving comment:', inputValue, mentionedUserIds);
                      handleEditComment(rowId, c.id || idx, inputValue, mentionedUserIds);
                    }}
                    style={{ marginRight: 8 }}
                  >
                    Save
                  </Button>
                  <Button
                    size="small"
                    onClick={() => {
                      console.log('Cancelling edit');
                      setEditingComment(null);
                    }}
                    style={{ marginRight: 8 }}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="small"
                    icon={
                      <DeleteOutlined
                        style={{
                          filter: 'brightness(0.7) grayscale(0.7)',
                        }}
                      />
                    }
                    onClick={() => handleDeleteComment(rowId, c.id || idx)}
                    style={{
                      background: 'lightgray',
                      borderColor: 'lightgray',
                    }}
                  />
                </div> */}

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
                      {filteredOptions.map((member: any) => (
                        <div
                          key={member.value}
                          style={{ padding: 8, cursor: 'pointer', color: 'white' }}
                          onMouseDown={(e) => {
                            e.preventDefault();
                            handleSelectMember(member);
                          }}
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
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
                onClick={() => {
                  setEditingComment({ rowId, commentId: c.id || idx });
                }}
              >
                <div>
                  <span style={{ whiteSpace: 'pre-line' }}>
                    <strong>{c.comment}</strong>
                  </span>
                  <div style={{ fontSize: 12, color: '#aaa' }}>
                    By: {c.givenBy || 'Unknown'} | At:{' '}
                    {c.givenAt
                      ? new Date(c.givenAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
                      : ''}
                  </div>
                </div>
                <Button
                  size="small"
                  danger
                  icon={
                    <DeleteOutlined
                      style={{
                        filter: 'brightness(0.7) grayscale(0.7)',
                      }}
                    />
                  }
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteComment(rowId, c.id || idx);
                  }}
                  style={{
                    background: 'lightgray',
                    borderColor: 'lightgray',
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