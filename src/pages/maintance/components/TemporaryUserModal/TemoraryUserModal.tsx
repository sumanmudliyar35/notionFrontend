import React, { useState } from 'react';
import CustomModal from '../../../../components/customModal/CustomModal';
import styled from 'styled-components';
import { useCreateTemporaryUser } from '../../../../api/post/newTemporaryUser';
import { useUpdateTemporaryUser } from '../../../../api/put/updateTemporaryUser';
import CustomInput from '../../../../components/customInput/CustomInput';
import { DeleteOutlined } from '@ant-design/icons';

interface TemoraryUserModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  tempporaryUsers?: any[]; // Adjust type as needed
  refetchUsers?:any; // Optional refetch function
}

const Label = styled.div`
  color: #d9d9d9;
  margin-bottom: 8px;
  font-weight: 500;
`;

const TemoraryUserModal: React.FC<TemoraryUserModalProps> = ({
  open,
  onClose,
  title,
  tempporaryUsers = [],
  refetchUsers
}) => {
  const [name, setName] = useState('');
  const userId = Number(localStorage.getItem('userid'));
  const [error, setError] = useState('');
  const createTemporaryUserMutate = useCreateTemporaryUser();
  const updateTemporaryUserMutate = useUpdateTemporaryUser();
  const [customTempporaryUsers, setCustomTemporaryUsers] = useState<any[]>(tempporaryUsers);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Name is required');
      return;
    }
    setError('');
    try {
      await createTemporaryUserMutate.mutateAsync([{ name }, userId]);
      setName('');
      refetchUsers?.();
      onClose();
    } catch (err) {
      setError('Failed to create temporary user');
    }
  };

  const handleDelete = async (user: { value: number; label: string }) => {
    try {
      await updateTemporaryUserMutate.mutateAsync([
        { deletedAt: new Date().toISOString() },
        user.value,
      ]);
      setCustomTemporaryUsers(prev => prev.filter(u => u.value !== user.value));
      refetchUsers?.(); // Call refetch function if provided
      
      // Optionally, you can filter out the deleted user from the UI here or refetch the list
    } catch (err) {
      // Handle error if needed
    }
  };


  console.log("tempporaryUsers",tempporaryUsers)
  return (
    <CustomModal title={title || 'Add Temporary User'} open={open} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <Label>Name</Label>
        <CustomInput
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Enter name"
          error={error}
        />
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              marginRight: 8,
              background: '#444',
              color: '#fff',
              border: 'none',
              padding: '6px 16px',
              borderRadius: 4,
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            style={{
              background: '#1677ff',
              color: '#fff',
              border: 'none',
              padding: '6px 16px',
              borderRadius: 4,
            }}
          >
            Save
          </button>
        </div>
      </form>
      {/* List of temporary users */}
      <div style={{ marginTop: 24 }}>
        {customTempporaryUsers.length > 0 && (
          <Label>Temporary Users</Label>
        )}
        {customTempporaryUsers.map(user => (
          <div
            key={user.value}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: '#222',
              color: '#fff',
              padding: '6px 12px',
              borderRadius: 4,
              marginBottom: 8,
            }}
          >
            <span>{user.label}</span>
            <DeleteOutlined
              style={{ color: '#f5222d', cursor: 'pointer', fontSize: 18 }}
              onClick={() => handleDelete(user)}
            />
          </div>
        ))}
      </div>
    </CustomModal>
  );
};

export default TemoraryUserModal;