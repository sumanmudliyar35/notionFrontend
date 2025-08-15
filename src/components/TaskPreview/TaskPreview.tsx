import React, { useEffect, useState } from 'react';
import CustomModal from '../customModal/CustomModal';
import { useGetTaskDetail } from '../../api/get/getTaskDetail';
import * as S from './style';
import { formatDisplayDate } from '../../utils/commonFunction';
import DescriptionCell from '../../pages/leads/components/DescriptionCell/DescriptionCell';
import { useGetAllUsers } from '../../api/get/getAllMember';
import { useCreateComment } from '../../api/post/newComment';
import { useUpdateTask } from '../../api/put/updateTask';
import TagSelector from '../customSelectModal/CustomSelectModal';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';

interface TaskPreviewProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  taskId: number | string;
}

const TaskPreview: React.FC<TaskPreviewProps> = ({ open, onClose, title = 'Task Preview', taskId }) => {
  const { data: taskDetail, isLoading, refetch } = useGetTaskDetail(taskId);
  const userId = Number(localStorage.getItem('userid'));

      const updateTaskMutate = useUpdateTask()
  

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


  const [isEditingStatus, setIsEditingStatus] = useState(false);
  const [statusValue, setStatusValue] = useState(taskDetail?.status || 'notStarted');

  useEffect(() => {
    if (taskDetail?.status) {
      setStatusValue(taskDetail.status);
    }
  }, [taskDetail?.status]);

  const handleSaveStatus = async (newStatus: string) => {
    setStatusValue(newStatus);
    setIsEditingStatus(false);
    await updateTaskMutate.mutateAsync([{ status: newStatus }, taskId, userId]);
    refetch();
  };

  const [isEditingProject, setIsEditingProject] = useState(false);

  const [projectValue, setProjectValue] = useState<string | number>(
    taskDetail?.project || taskDetail?.projectName || ''
  );

  // TODO: Replace this with your actual project options source
  const projectOptions = [
    { id: 'toStart', label: 'To Start', value: 'toStart' },
        { id: 'ongoing', label: 'Current Working', value: 'ongoing' },
    
  ];

  useEffect(() => {
    if (taskDetail?.project || taskDetail?.projectName) {
      setProjectValue(taskDetail.project || taskDetail.projectName);
    }
  }, [taskDetail?.project, taskDetail?.projectName]);

  const [isEditingDueDate, setIsEditingDueDate] = useState(false);

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
              <span style={{ fontSize: 16 }}>Status</span>
              <span
                style={{ color: '#faad14', cursor: 'pointer', minWidth: 80, marginLeft: 8 }}
                onClick={() => setIsEditingStatus(true)}
              >
                {false ? (
                  <TagSelector
                    value={statusValue}
                    onChange={async (id) => {
                      if (typeof id === 'string') {
                        await handleSaveStatus(id);
                        setIsEditingStatus(false);
                      }
                    }}
                    options={[
                      { id: 'notStarted', label: 'Not started' },
                      { id: 'inProgress', label: 'In Progress' },
                      { id: 'completed', label: 'Completed' },
                      // Add more status options if needed
                    ]}
                  />
                ) : (
                  // Show label for current status
                  [
                    { id: 'notStarted', label: 'Not started' },
                    { id: 'inProgress', label: 'In Progress' },
                    { id: 'completed', label: 'Completed' },
                  ].find(opt => opt.id === statusValue)?.label || '-'
                )}
              </span>
            </S.MetaItem>

          <S.MetaItem>
  <span style={{ fontSize: 16 }}>Project</span>
  <span style={{ minWidth: 120, marginLeft: 8, cursor: 'pointer' }} onClick={() => setIsEditingProject(true)}>
    {false ? (
      <TagSelector
        value={projectValue}
        onChange={async (id) => {
          if (id) {
            setProjectValue(id);
            await updateTaskMutate.mutateAsync([{ project: id }, taskId, userId]);
                        setIsEditingProject(false);


            refetch();
          }
        }}
        options={
          // You can use your project options here, for example:
          (projectOptions || []).map(opt => ({
            id: opt.value,
            label: opt.label,
            value: opt.value,
          }))
        }
      />
    ) : (
      // Show label for current project
      (projectOptions || [])
        .find(opt => opt.value === (taskDetail.projectName || taskDetail.project))
        ?.label ||
      taskDetail.projectName ||
      taskDetail.project ||
      '-'
    )}
  </span>
</S.MetaItem>
            
                
           
             <S.MetaItem>
  <div style={{ fontSize: 16 }}>📅 End date</div>
  <div style={{ minWidth: 120, marginLeft: 8, cursor: 'pointer' }} onClick={() => setIsEditingDueDate(true)}>
    {false ? (
      <DatePicker
        onChange={async (date) => {
          if (date) {
            const formatted = date.format('YYYY-MM-DD');
            await updateTaskMutate.mutateAsync([{ dueDate: formatted }, taskId, userId]);
            refetch();
            setIsEditingDueDate(false); // <-- Move here!
          }
        }}
        value={
          !taskDetail.dueDate || taskDetail.dueDate === "0000-00-00"
            ? null
            : dayjs(taskDetail.dueDate)
        }
        format="DD-MM-YYYY"
        style={{
          width: '100%',
          borderRadius: 4,
          backgroundColor: 'rgb(25, 25, 25)',
          color: 'white',
        }}
        placeholder="DD-MM-YYYY"
        autoFocus
      />
    ) : (
      taskDetail.dueDate
        ? formatDisplayDate(taskDetail.dueDate)
        : '-'
    )}
  </div>
</S.MetaItem>


            </S.MetaRow>

            {/* <S.CommentsSection>
              <S.CommentsTitle>Description</S.CommentsTitle>
              <S.CommentsContent>
    <DescriptionCell
      value={taskDetail.description || ''}
      onSave={async (newValue: string) => {
        await updateTaskMutate.mutateAsync([{ description: newValue }, taskId, userId]);
        refetch();
      }}
      placeholder="No description provided."
      isCellActive={false}
    />
  </S.CommentsContent>

            </S.CommentsSection> */}

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