import React, { useState, useEffect } from 'react';
import { Button, Row, Col, Form } from 'antd';
import CustomModal from '../../../../components/customModal/CustomModal';
import dayjs from 'dayjs';
import styled from 'styled-components';
import DateInput from '../../../../components/CustomDateInput/CustomDateInput';

interface ChangeDateModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  initialDate?: string | Date | null;
  onSave: (originalDate: string, newDate: string, taskId: string) => void;
  taskId: string; // Added taskId prop
}

const Label = styled.div`
  color: #d9d9d9;
  margin-bottom: 8px;
  font-weight: 500;
`;

const ChangeDateModal: React.FC<ChangeDateModalProps> = ({
  open,
  onClose,
  title,
  initialDate,
  onSave,
  taskId
}) => {
  // Convert initialDate to dayjs if it exists
  const initialDayjs = initialDate ? dayjs(initialDate) : null;
  
  // State to track original and new date
  const [originalDate, setOriginalDate] = useState<string | null>(initialDayjs?.format('YYYY-MM-DD') || null);
  const [newDate, setNewDate] = useState<dayjs.Dayjs | null>(initialDayjs);
  
  // Update state when initialDate changes
  useEffect(() => {
    if (initialDate) {
      const date = dayjs(initialDate);
      setOriginalDate(date.format('YYYY-MM-DD'));
      setNewDate(date);
    }
  }, [initialDate]);

  const handleSave = () => {
    if (originalDate && newDate) {
      onSave(originalDate, newDate.format('YYYY-MM-DD'), taskId);
      onClose();
    }
  };

  return (
    <CustomModal
      title={title || 'Change Date'}
      onClose={onClose}
      open={open}
    >
      <Form layout="vertical">
        <Row gutter={16}>
          <Col span={24}>
            <Label>Original Date</Label>
            <div style={{ 
              padding: '8px 12px', 
              backgroundColor: '#2c2c2c', 
              borderRadius: '4px',
              marginBottom: '16px',
              color: '#bbb'
            }}>
              {originalDate ? dayjs(originalDate).format('MMMM D, YYYY') : 'Not set'}
            </div>
          </Col>
          
          <Col span={24}>
           
              <DateInput
                label="New Date"
                value={newDate ? newDate.format('YYYY-MM-DD') : ''}
                onChange={(dateStr) => {
                  if (dateStr) {
                    setNewDate(dayjs(dateStr));
                  } else {
                    setNewDate(null);
                  }
                }}
                onBlur={() => {
                  // Handle blur event if needed
                }}
                placeholder="Select new date"
              />
          </Col>
        </Row>

        <Row justify="end" gutter={16} style={{ marginTop: '24px' }}>
          <Col>
            <Button onClick={onClose}>
              Cancel
            </Button>
          </Col>
          <Col>
            <Button 
              type="primary" 
              onClick={handleSave} 
              disabled={!newDate}
              style={{ backgroundColor: '#1890ff', borderColor: '#1890ff' }}
            >
              Save Changes
            </Button>
          </Col>
        </Row>
      </Form>
    </CustomModal>
  );
};

export default ChangeDateModal;