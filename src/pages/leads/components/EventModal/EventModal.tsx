import React from 'react';
import CustomModal from '../../../../components/customModal/CustomModal';
import { Button } from 'antd';
import InputWithLabel from '../../../../components/customInput/CustomInput';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useCreateEvent } from '../../../../api/post/newEvent';
import { useGetEventsByLead } from '../../../../api/get/getEventByLead';
import EventList from '../EventsList/EventsList';

interface EventModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  footer?: React.ReactNode;
  width?: number | string;
  leadId: number;
  refetch: any;
  
}

const EventModal: React.FC<EventModalProps> = ({
  open,
  onClose,
  title = 'Event Details',
  footer = null,
  width = 600,
  leadId,
  refetch
}) => {


  const userid=localStorage.getItem('userid');
  const {data: events, refetch: refetchEvent}= useGetEventsByLead(leadId)
  const initialValues = {
    eventName: '',
    date: '',
    numberOfGuests: '',
    note:'',
  };

  const validationSchema = Yup.object({
    eventName: Yup.string().required('Event name is required'),
    date: Yup.string().required('Date is required'),
    numberOfGuests: Yup.number()
      .transform((value) => (isNaN(value) ? undefined : value))
      .nullable()
      .min(0, 'Must be non-negative'),
  });


  const createEventMutate = useCreateEvent();


  const formik = useFormik({
    enableReinitialize: true,
    initialValues,
    validationSchema,
    onSubmit: async (values, {resetForm}) => {
      const body={
        eventName: formik.values.eventName,
        date: formik.values.date,
        numberOfGuests: formik.values.numberOfGuests,
        note: formik.values.note,
        createdBy: userid,
        leadId: leadId
      };

      const response = await createEventMutate.mutateAsync([body, userid]);
      refetchEvent();
      refetch();
      resetForm();

      
    },
  });

  return (
    <CustomModal
      open={open}
      onClose={onClose}
      title={title}
      footer={footer}
      width={width}
    >
      <form onSubmit={formik.handleSubmit}>
         <InputWithLabel
  label="Date"
  name="date"
  placeholder="Enter event date"
  type="date"
  value={formik.values.date}
  onChange={formik.handleChange}
  onBlur={formik.handleBlur}
  error={formik.touched.date && formik.errors.date ? formik.errors.date : ''}
  inputProps={{
    onFocus: e => {
      // Open native date picker on focus (supported in Chrome, Edge, etc.)
      e.target.showPicker && e.target.showPicker();
    }
  }}
/>
        <InputWithLabel
          label="Event Name"
          name="eventName"
          placeholder="Enter event name"
          value={formik.values.eventName}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.eventName && formik.errors.eventName ? formik.errors.eventName : ''}
        />

        {/* <InputWithLabel
          label="Date"
          name="date"
          placeholder="Enter event date"
          type="date"
          value={formik.values.date}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.date && formik.errors.date ? formik.errors.date : ''}
        /> */}

        <InputWithLabel
          label="Number of Guests (optional)"
          name="numberOfGuests"
          placeholder="Enter number of guests"
          type="number"
          value={formik.values.numberOfGuests}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={
            formik.touched.numberOfGuests && formik.errors.numberOfGuests
              ? formik.errors.numberOfGuests.toString()
              : ''
          }
        />
         <InputWithLabel
          label="Note (optional)"
          name="note"
          type="text"
          value={formik.values.note}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />

        <div style={{ marginTop: 20, textAlign: 'right' }}>
          <Button onClick={onClose} style={{ marginRight: 10 }}>
            Cancel
          </Button>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </div>
      </form>

      <EventList events={events} />

    </CustomModal>
  );
};

export default EventModal;
