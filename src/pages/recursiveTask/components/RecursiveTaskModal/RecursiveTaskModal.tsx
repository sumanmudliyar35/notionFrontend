import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import dayjs from 'dayjs';
import CustomInput from '../../../../components/customInput/CustomInput';
import DateInput from '../../../../components/CustomDateInput/CustomDateInput';
import CustomModal from '../../../../components/customModal/CustomModal';
import CustomSelect from '../../../../components/customSelect/CustomSelect';

interface YourModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  onSave: (data: { name: string; startDate: string; endDate: string; interval: number }) => void;
}

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  // interval: Yup.number().min(1, 'Interval must be at least 1').required('Interval is required'),
  startDate: Yup.date().required('Start date is required'),
  endDate: Yup.date().required('End date is required'),
});

const RecursiveTaskModal: React.FC<YourModalProps> = ({ open, onClose, title, onSave }) => {


  const intervalOptions = [
    { label: "1 day", value: 1 },
    { label: "3 days", value: 3 },
    { label: "7 days", value: 7 },
    { label: "15 days", value: 15 },
    { label: "30 days", value: 30 },
  ]
  const formik = useFormik({
    initialValues: {
      name: '',
      interval: 1,
      startDate: null,
      endDate: null,
    },
    validationSchema,
    onSubmit: values => {
      onSave({
        name: values.name,
        startDate: values.startDate ? dayjs(values.startDate).format('YYYY-MM-DD') : '',
        endDate: values.endDate ? dayjs(values.endDate).format('YYYY-MM-DD') : '',
        interval: values.interval,
      });
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <CustomInput
            label="Name"
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Enter name"
            error={formik.touched.name && formik.errors.name ? formik.errors.name : ''}
          />
          {/* <CustomInput
            label="Interval (days)"
            name="interval"
            type="number"
            value={formik.values.interval}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Enter interval in days"
            error={formik.touched.interval && formik.errors.interval ? formik.errors.interval : ''}
          /> */}

          <CustomSelect
  label="Interval"
  options={intervalOptions}
  value={intervalOptions.find(opt => opt.value === formik.values.interval) || intervalOptions[0]}
  onChange={value => formik.setFieldValue('interval', value.value)}
  placeholder="Select interval"
  width="180px"
/>
          <DateInput
            label="Start Date"
            value={formik.values.startDate}
            onChange={date => formik.setFieldValue('startDate', date)}
            onBlur={formik.handleBlur}
            placeholder="Select start date"
          />
          {formik.touched.startDate && formik.errors.startDate && (
            <div style={{ color: 'red', fontSize: 12 }}>{formik.errors.startDate as string}</div>
          )}
          <DateInput
            label="End Date"
            value={formik.values.endDate}
            onChange={date => formik.setFieldValue('endDate', date)}
            onBlur={formik.handleBlur}
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

export default RecursiveTaskModal;