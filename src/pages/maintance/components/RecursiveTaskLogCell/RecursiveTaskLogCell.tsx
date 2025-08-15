import React from 'react';
import { Button, Input, Badge } from 'antd';
import { CalculatorOutlined, UploadOutlined, CommentOutlined, UserAddOutlined } from '@ant-design/icons';
import CommentCell from '../CommentCell/CommentCell';
import CustomChip from '../../../../components/customChip/CustomChip';
import CustomTag from '../../../../components/customTag/CustomTag';
import dayjs from 'dayjs';
import { addMinutesToTime, formatDisplayTime, parseDurationToMinutes } from '../../../../utils/commonFunction';
import * as styled from './style';

interface RecursiveTaskLogCellProps {
  log: any;
  date: string;
  row: any;
  isPastDate: boolean;
  checked: boolean;
  attachments: any[];
  comments: any[];
  temporaryUsers: any[];
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
  tasktime: string | null;
  onDeleteAttachment?: (attachmentId: string, logId: any, recursiveTaskLogId: any) => void;

  onAssignMaintance?:(maintanceId: any, assignedTo: any, time: string | null, endTime: string | null) => Promise<void>;
  onDeleteAssignedUser?: (userId: any, maintanceTaskLogId: any) => Promise<void>;
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
  temporaryUsers,
  handleEditComment,
  handleDeleteComment,
  editingComment,
  setEditingComment,
  assigneeOptions,
  commentsVisible,
  onDeleteAttachment,
  onAssignMaintance ,
  onDeleteAssignedUser,
  tasktime

}) => {


  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      gap: 4,
      opacity: isPastDate ? 0.7 : 1 
    }}>


       <styled.TagWrapper>
        {Array.isArray(log.assignedTo) && log.assignedTo.map((data: any) => (
  <CustomTag
    key={data.id}
    name={data.name}
   {...(!isPastDate && {
    onClose: () => {
      onDeleteAssignedUser && onDeleteAssignedUser(data.id, log.id);
    }
  })}
  />
))}
      
      </styled.TagWrapper>

       <styled.TimeWrappper>
        {log.startTime && (
<>

  
    <div style={{ color: '#d9d9d9', fontSize: 12, display: "flex", justifyContent: "flex-start" }}>
  {formatDisplayTime(log.startTime)} - {
    log.endTime
      ? formatDisplayTime(log.endTime)
      : (() => {
          const durationStr = tasktime || ''; // e.g., "2 hours 30 minutes" or "1:45"
          const assignedCount = Array.isArray(log.assignedTo) && log.assignedTo.length ? log.assignedTo.length : 1;
          const totalMinutes = parseDurationToMinutes(durationStr);
          const minutesPerUser = Math.floor(totalMinutes / assignedCount);
          return addMinutesToTime(log.startTime, minutesPerUser);
        })()
  }
</div>
     </>
     )}
         </styled.TimeWrappper>


<styled.cellActionAndTimeWrapper>
  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
       

        <Badge count={attachments.length} size="small" color="#1677ff">
          <Button
            onClick={()=> onAssignMaintance && onAssignMaintance(log.id, log.assignedTo, log.startTime, log.endTime)}
            disabled={isPastDate}
            style={{ 
              background: 'white', 
              border: 'none', 
              cursor: isPastDate ? 'not-allowed' : 'pointer',
              opacity: isPastDate ? 0.5 : 1,
              height: 24,
              width: 24,
            }}
  icon={<UserAddOutlined />}
          />
        </Badge>

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
   


  

   


</styled.cellActionAndTimeWrapper>
  


  
     
     

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

     

     
    </div>
  );
};

export default RecursiveTaskLogCell;