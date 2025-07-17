import React, { useEffect, useState } from 'react';
import CustomModal from '../customModal/CustomModal';
import { useGetTaskDetail } from '../../api/get/getTaskDetail';
import * as S from './style';
import { formatDisplayDate } from '../../utils/commonFunction';
import DescriptionCell from '../../pages/leads/components/DescriptionCell/DescriptionCell';
import { useGetAllUsers } from '../../api/get/getAllMember';
import { useCreateComment } from '../../api/post/newComment';

interface TaskPreviewProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  taskId: number | string;
}

const TaskPreview: React.FC<TaskPreviewProps> = ({ open, onClose, title = 'Task Preview', taskId }) => {
  const { data: taskDetail, isLoading, refetch } = useGetTaskDetail(taskId);
  const userId = Number(localStorage.getItem('userid'));

  const [newComment, setNewComment] = useState('');
const [isAddingComment, setIsAddingComment] = useState(false);


    const {data: allMembersData} = useGetAllUsers();


  const [assigneeOptions, setAssigneeOptions] = useState<{ id: string | number; label: string; value: any }[]>([]);


   useEffect(() => {
      if (allMembersData) {
        setAssigneeOptions(
          allMembersData
            .filter((u: any) => u.name && u.userId)
            .map((u: any) => ({
              id: u.userId,
              label: u.name,
              value: u.userId,
            }))
        );
      }
    }, [allMembersData]);

    const commentMutate = useCreateComment();
    

const handleAddComment =  async(value: string, rowId: any, mentionedMembers: any[] ) => {
  console.log('Adding comment:', value, rowId, mentionedMembers);

  const body = {
    comment: value,
    mentionedMembers: mentionedMembers || [],
    taskId: taskId,
    givenBy: userId,
  }

 const response =  await commentMutate.mutateAsync([body, userId]);
  console.log('Comment added:', response);
  setNewComment('');
  setIsAddingComment(false);
  
 refetch();
 
 
};


  return (
    <CustomModal open={open} onClose={onClose} title="" width={800}>
      <S.Container>
        {isLoading ? (
          <div style={{ textAlign: 'center', color: '#888', fontSize: 18 }}>Loading...</div>
        ) : taskDetail ? (
          <>
            <S.TitleRow>
              <S.Icon>📘</S.Icon>
              <S.TaskTitle>Task: {taskDetail.name}</S.TaskTitle>
            </S.TitleRow>
            <S.MetaRow>
              <S.MetaItem>
                <span style={{ fontSize: 16 }}> Status</span>
                <S.Status status={taskDetail.status}>
                  {taskDetail.status === 'notStarted' ? 'Not started' : taskDetail.status}
                </S.Status>
              </S.MetaItem>
              {/* <S.MetaItem>
                <span style={{ fontSize: 18 }}>👤 Assignee</span>
                <span>Empty</span>
              </S.MetaItem> */}
              <S.MetaItem>
                <span style={{ fontSize: 16 }}>📅 End date</span>
                <span>
                  {taskDetail.dueDate
                    ? formatDisplayDate(taskDetail.dueDate)
                    : '-'}
                </span>
              </S.MetaItem>
            </S.MetaRow>

            <S.CommentsSection>
              <S.CommentsTitle>Description</S.CommentsTitle>
              <S.CommentsContent>
                {taskDetail.description || 'No description provided.'}
              </S.CommentsContent>

            </S.CommentsSection>

            <S.CommentsSection>
              <S.CommentsTitle>Comments</S.CommentsTitle>
              <S.CommentList>
                {taskDetail.comments && taskDetail.comments.length > 0 ? (
                  taskDetail.comments.map((comment: any) => (
                    <S.CommentItem key={comment.id}>
                      <S.CommentAvatar>
                        {comment.givenBy?.[0]?.toUpperCase() || 'U'}
                      </S.CommentAvatar>
                      <S.CommentContent>
                        <S.CommentAuthor>
                          {comment.givenBy}
                          <S.CommentTime>
                            {comment.givenAt
                              ? formatDisplayDate(comment.givenAt)
                              : ''}
                          </S.CommentTime>
                        </S.CommentAuthor>
                        <S.CommentText>{comment.comment}</S.CommentText>
                      </S.CommentContent>
                    </S.CommentItem>
                  ))
                ) : (
                  
                  <S.AddComment>No comments yet.</S.AddComment>
                )}
 <S.AddComment>
      {isAddingComment ? (
        <DescriptionCell
          value={newComment}
          onChange={handleAddComment}
          onBlur={() => setIsAddingComment(false)}
          // onSave={handleAddComment}
          customIsEdited={isAddingComment}

          assigneeOptions={assigneeOptions} // Pass user options for mentions
        />
      ) : (
        <span
          style={{ color: '#bdbdbd', cursor: 'pointer' }}
          onClick={() => setIsAddingComment(true)}
        >
          Add a comment...
        </span>
      )}
    </S.AddComment> 
    
                 </S.CommentList>
            </S.CommentsSection>

            <S.SectionDivider />

         
          </>
        ) : (
          <div style={{ textAlign: 'center', color: '#888', fontSize: 18 }}>No task details found.</div>
        )}
      </S.Container>
    </CustomModal>
  );
};

export default TaskPreview;