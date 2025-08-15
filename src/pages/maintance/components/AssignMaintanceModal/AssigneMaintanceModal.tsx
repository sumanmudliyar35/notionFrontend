import React, { useState } from 'react';
import CustomModal from '../../../../components/customModal/CustomModal';
import styled from 'styled-components';
import CustomInput from '../../../../components/customInput/CustomInput';
import { DeleteOutlined } from '@ant-design/icons';
import TimeInputWithInterval from '../../../../components/TimeInputWithInterval/TimeInputWithInterval';
import dayjs from 'dayjs';
import TagMultiSelector from '../../../../components/CustomMultiSelectModal/CustomMultiSelectModal';

interface AssigneMaintanceModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
    assignedUsers?: any; // Adjust type as needed
  onDelete?: (userId: number) => Promise<void>;
  onAssign?: (assignees: any[], time: any, endTime: any) => Promise<void>; // Function to handle assignment
  taskId?: number; // Optional task ID for context
  assigneeOptions: any[]; // Options for assigning users
  onSave?: (assignedUsers: any[]) => void; // <-- Add this prop to your interface
  time?: string | null; // Optional time for the assignment
  endTime?: string | null; // Optional end time for the assignment
}

const Label = styled.div`
  color: #d9d9d9;
  margin-bottom: 8px;
  font-weight: 500;
`;

const AssigneMaintanceModal: React.FC<AssigneMaintanceModalProps> = ({
  open,
  onClose,
  title,
  assignedUsers = [],
  onAssign,
  onDelete,
  taskId,
  assigneeOptions = [],
  time = null,
  endTime = null,

  onSave, // <-- Add this prop to your interface and here
}) => {


  console.log("AssigneMaintanceModal rendered", open, title, assignedUsers, taskId);
  const [name, setName] = useState('');
  const [error, setError] = useState('');
    const [selectedTime, setSelectedTime] = useState<string | null>(time || null);

    const [selectedEndTime, setSelectedEndTime] = useState<string | null>(endTime || null);

    const initialAssigneeIds = Array.isArray(assignedUsers)
  ? assignedUsers.map((u: any) => u.id)
  : [];

    const [selectedAssignees, setSelectedAssignees] = useState<any[]>(initialAssigneeIds);

  
  const [localAssignedUsers, setLocalAssignedUsers] = useState<any[]>(assignedUsers);

 

  const handleAssign = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!selectedAssignees.length) {
    setError('Please select at least one assignee');
    return;
  }
  setError('');
  onAssign?.(selectedAssignees, selectedTime, selectedEndTime);

 
};

  const handleDelete = async (userId: number) => {
    if (onDelete) {
      await onDelete(userId);
      const updated = localAssignedUsers.filter(user => user.value !== userId);
      setLocalAssignedUsers(updated);
      if (onSave) onSave(updated);
    }
  };


  console.log("Assignee Options:", assigneeOptions);

  

  return (
    <CustomModal title={title || 'Assign Maintenance'} open={open} onClose={onClose}>
      <form onSubmit={handleAssign}>


           <Label>Assignees</Label>
  <TagMultiSelector
    options={assigneeOptions}
    value={selectedAssignees}
  
    onChange={(val : any)=>{ setSelectedAssignees(Array.isArray(val) ? val : val ? [val] : []); console.log("Selected Assignees:", val);}}
    placeholder="Select assignees"
    allowCreate={false}
    horizontalOptions={false}
    isMulti={true}
  />

       

        <Label>Start Time</Label>

         <TimeInputWithInterval
            value={
              selectedTime
                ? (() => {
                    const time = dayjs(selectedTime, 'HH:mm');
                    return { hour: time.hour(), minute: time.minute() };
                  })()
                : undefined
            }
            onChange={val => {
              if (!val) {
                setSelectedTime(null);
              } else if (typeof (val as any).format === 'function') {
                setSelectedTime((val as any).format('HH:mm'));
              } else if (typeof val === 'object' && 'hour' in val && 'minute' in val) {
                const hour = String(val.hour).padStart(2, '0');
                const minute = String(val.minute).padStart(2, '0');
                setSelectedTime(`${hour}:${minute}`);
              } else {
                setSelectedTime(null);
              }
            }}
          />

          <Label>End Time</Label>

          <TimeInputWithInterval
            value={
              selectedEndTime
                ? (() => {
                    const time = dayjs(selectedEndTime, 'HH:mm');
                    return { hour: time.hour(), minute: time.minute() };
                  })()
                : undefined
            }
            onChange={val => {
              if (!val) {
                setSelectedEndTime(null);
              } else if (typeof (val as any).format === 'function') {
                setSelectedEndTime((val as any).format('HH:mm'));
              } else if (typeof val === 'object' && 'hour' in val && 'minute' in val) {
                const hour = String(val.hour).padStart(2, '0');
                const minute = String(val.minute).padStart(2, '0');
                setSelectedEndTime(`${hour}:${minute}`);
              } else {
                setSelectedEndTime(null);
              }
            }}
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
            Assign
          </button>
        </div>
      </form>
     
    </CustomModal>
  );
};

export default AssigneMaintanceModal;