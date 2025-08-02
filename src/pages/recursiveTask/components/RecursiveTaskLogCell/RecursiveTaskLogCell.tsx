import React from 'react';
import { Button, Input, Badge } from 'antd';
import { CalculatorOutlined, UploadOutlined, CommentOutlined } from '@ant-design/icons';
import CommentCell from '../CommentCell/CommentCell';
import CustomChip from '../../../../components/customChip/CustomChip';
import CustomTag from '../../../../components/customTag/CustomTag';
import dayjs from 'dayjs';

interface RecursiveTaskLogCellProps {
  log: any;
  date: string;
  row: any;
  isPastDate: boolean;
  checked: boolean;
  attachments: any[];
  comments: any[];
  handleCheck: (checked: boolean, log: any, date: string, taskId: any) => void;
  handleMultipleUpload: (files: FileList, log: any, date: any, taskId: any) => void;
  openDateChangeModal: (e: React.MouseEvent, log: any, date: string) => void;
  triggerMultipleFileUpload: (e: React.MouseEvent, log: any, date: string) => void;
  openCommentModal: (log: any) => void;
  handleEditComment: any;
  handleDeleteComment: any;
  editingComment: any;
  setEditingComment: any;
  assigneeOptions: any;
  commentsVisible: boolean;
  onDeleteAttachment?: (attachmentId: string, logId: any, recursiveTaskLogId: any) => void;
}

const RecursiveTaskLogCell: React.FC<RecursiveTaskLogCellProps> = ({
  log,
  date,
  row,
  isPastDate,
  checked,
  attachments,
  comments,
  handleCheck,
  handleMultipleUpload,
  openDateChangeModal,
  triggerMultipleFileUpload,
  openCommentModal,
  handleEditComment,
  handleDeleteComment,
  editingComment,
  setEditingComment,
  assigneeOptions,
  commentsVisible,
  onDeleteAttachment,
}) => {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      gap: 4,
      opacity: isPastDate ? 0.7 : 1 
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Input
          type="checkbox"
          checked={checked}
          onChange={(e: any) => !isPastDate && handleCheck(e.target.checked, log, date, row.original.id)}
          disabled={isPastDate}
          style={{
            accentColor: checked ? '#52c41a' : '#aaa',
            transform: 'scale(1.2)',
            cursor: isPastDate ? 'not-allowed' : 'pointer',
            height: 20,
            width: 20,
            transition: 'accent-color 0.2s'
          }}
        />

        <Button
          onClick={(e) => openDateChangeModal(e, log, date)}
          disabled={isPastDate}
          style={{ 
            background: 'white', 
            border: 'none', 
            cursor: isPastDate ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            opacity: isPastDate ? 0.5 : 1,
            height: 24,
            width: 24,
          }}
          icon={<CalculatorOutlined />}
        />

        <Badge count={attachments.length} size="small" color="#1677ff">
          <Button
            onClick={(e) => triggerMultipleFileUpload(e, log, date)}
            disabled={isPastDate}
            style={{ 
              background: 'white', 
              border: 'none', 
              cursor: isPastDate ? 'not-allowed' : 'pointer',
              opacity: isPastDate ? 0.5 : 1,
              height: 24,
              width: 24,
            }}
            icon={<UploadOutlined />}
          />
        </Badge>

        <Badge count={comments.length} size="small" color="#1677ff">
          <Button
            onClick={() => openCommentModal(log)}
            disabled={isPastDate}
            style={{ 
              background: 'white', 
              border: 'none', 
              cursor: isPastDate ? 'not-allowed' : 'pointer',
              opacity: isPastDate ? 0.5 : 1,
              height: 24,
              width: 24,
            }}
            icon={<CommentOutlined />}
          />
        </Badge>
      </div>

      <CommentCell
        comments={comments}
        rowId={log.id}
        openCommentModal={isPastDate ? () => {} : openCommentModal}
        handleEditComment={handleEditComment}
        handleDeleteComment={handleDeleteComment}
        editingComment={editingComment}
        setEditingComment={setEditingComment}
        assigneeOptions={assigneeOptions}
        disabled={isPastDate}
        visible={commentsVisible}
        isCommentText={true}
      />

      {/* {commentsVisible && attachments && attachments.length > 0 && (
        <div style={{ marginTop: 4, fontSize: '0.8em' }}>
          {attachments.map((attachment: any, idx: number) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <a 
                href={attachment?.downloadUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ color: '#1677ff', textDecoration: 'underline' }}
              >
                {attachment?.fileName || `File ${idx + 1}`}
              </a>
            </div>
          ))}
        </div>
      )} */}

      {commentsVisible && attachments && attachments.length > 0 && (
  <div style={{ marginTop: 4, fontSize: '0.8em', display: 'flex', flexWrap: 'wrap', gap: 4 }}>
    {attachments.map((attachment: any, idx: number) => (
      <CustomTag
        key={attachment.id || idx}
        name={
          <a
            href={attachment.downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#1677ff', textDecoration: 'underline' }}
          >
            {`File ${idx + 1}`}
          </a>
        }
onClose={
  !log.date || dayjs(log.date).isSameOrAfter(dayjs(), 'day')
    ? () => onDeleteAttachment && onDeleteAttachment(attachment.id, log.id, row.original.id)
    : undefined
}
  
  />
    ))}
  </div>
)}
    </div>
  );
};

export default RecursiveTaskLogCell;