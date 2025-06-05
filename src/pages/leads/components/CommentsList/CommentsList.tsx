import React from 'react';

interface Comment {
  id: number;
  comment: string;
  createdAt: string;
  givenBy: number;
  leadId: number;
}

interface CommentsListProps {
  comments?: Comment[];
}

const CommentsList: React.FC<CommentsListProps> = ({ comments }) => {
  if (!comments || comments.length === 0) {
    return <p style={{ color: '#ccc' }}>No comments yet.</p>;
  }

  return (
    <div style={{ marginTop: 30 }}>
      <h3 style={{ color: '#fff' }}>Comments</h3>
      <ul style={{ paddingLeft: 20 }}>
        {comments.map((comment) => (
          <li key={comment.id} style={{ color: '#ddd', marginBottom: 10 }}>
            <strong>Comment:</strong> {comment.comment} <br />
            <small style={{ color: '#aaa' }}>
              On {new Date(comment.createdAt).toLocaleString()}
            </small>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CommentsList;
