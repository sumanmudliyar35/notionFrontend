import React from 'react';
import CustomModal from '../customModal/CustomModal';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import DateInput from '../CustomDateInput/CustomDateInput';

interface BulkUpdateTaskModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  selectedIds: number[];
  onSave?: (selectedIds: number[], data: any) => void;
}

const BulkUpdateTaskModal: React.FC<BulkUpdateTaskModalProps> = ({ open, onClose, title, selectedIds, onSave }) => {
  const validationSchema = Yup.object().shape({
    endDate: Yup.date().required('End date is required'),
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      endDate: '',
    },
    validationSchema,
    onSubmit: values => {
      if (onSave) {
        onSave(selectedIds, { endDate: values.endDate });
      }
      onClose();
    },
  });

  return (
    <CustomModal
      title={title || 'Select Date and Time'}
      onClose={onClose}
      open={open}
    >
      <form onSubmit={formik.handleSubmit}>
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>Bulk update tasks</div>
          <DateInput
            label="End Date"
            value={formik.values.endDate}
            onChange={date => formik.setFieldValue('endDate', date)}
            placeholder="Select end date"
          />
          {formik.touched.endDate && formik.errors.endDate && (
            <div style={{ color: 'red', fontSize: 12 }}>{formik.errors.endDate as string}</div>
          )}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 16 }}>
            <button type="button" onClick={onClose}>Cancel</button>
            <button type="submit" style={{ background: '#1677ff', color: '#fff', border: 'none', padding: '6px 16px', borderRadius: 4 }}>
              Save
            </button>
          </div>
        </div>
      </form>
    </CustomModal>
  );
};

export default BulkUpdateTaskModal;