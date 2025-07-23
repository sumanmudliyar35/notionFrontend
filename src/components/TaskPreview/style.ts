import styled from 'styled-components';

export const Container = styled.div`
  padding: 32px 32px 0 32px;
  // background: #18191c;
  min-width: 420px;
  color: #fff;
`;

export const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 8px;
`;

export const Icon = styled.div`
  font-size: 20px;
`;

export const TaskTitle = styled.h1`
  font-size: 16px;
  font-weight: 700;
  margin: 0;
  color: #fff;
`;

export const MetaRow = styled.div`
  display: flex;
  align-items: center;
  gap: 32px;
  margin: 16px 0 24px 0;
  font-size: 14px;
`;

export const MetaItem = styled.div`
  display: flex;
  align-items: center;
  
  gap: 8px;
  color: #bdbdbd;
`;

export const Status = styled.span<{ status?: string }>`
  background: #23272f;
  color: #fff;
  border-radius: 8px;
  padding: 2px 12px;
  font-size: 16px;
  font-weight: 500;
  ${({ status }) =>
    status === 'notStarted' && 'background: #23272f; color: #fff;'}
`;

export const CommentsSection = styled.div`
  margin-top: 24px;
`;

export const CommentsTitle = styled.div`
  font-weight: 600;
  color: #bdbdbd;
  margin-bottom: 12px;
`;

export const CommentsContent = styled.div`
  color: #bdbdbd;
  margin-bottom: 12px;
`;

export const CommentList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

export const CommentItem = styled.li`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 18px;
`;

export const CommentAvatar = styled.div`
  background: #8e6fff;
  color: #fff;
  font-weight: 700;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
`;

export const CommentContent = styled.div`
  background: #23272f;
  border-radius: 8px;
  padding: 10px 16px;
  color: #fff;
  min-width: 120px;
`;

export const CommentAuthor = styled.div`
  font-weight: 600;
  color: #fff;
  margin-bottom: 2px;
  font-size: 14px;
`;

export const CommentTime = styled.span`
  color: #bdbdbd;
  font-size: 10px;
  margin-left: 8px;
`;

export const CommentText = styled.div`
  color: #fff;
  font-size: 14px;
`;

export const AddComment = styled.div`
  margin-top: 8px;
  color: #bdbdbd;
  font-size: 14px;
  padding-left: 44px;
`;

export const SectionDivider = styled.hr`
  border: none;
  border-top: 1px solid #23272f;
  margin: 32px 0 16px 0;
`;

export const SectionTitle = styled.div`
  font-weight: 600;
  color: #bdbdbd;
  margin-bottom: 8px;
  font-size: 14px;
`;

export const SectionContent = styled.div`
  color: #fff;
  font-size: 14px;
`;