import React, { useEffect, useState } from 'react';
import CustomModal from '../../../../components/customModal/CustomModal';
import { Button } from 'antd';
import InputWithLabel from '../../../../components/customInput/CustomInput';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useCreateEvent } from '../../../../api/post/newEvent';
import { useGetEventsByLead } from '../../../../api/get/getEventByLead';
import EventList from '../EventsList/EventsList';
import { useGetAllEventList } from '../../../../api/get/getAllEventList';
import CustomSelect from '../../../../components/customSelect/CustomSelect';
import { SharedInputWrapper } from '../../../../style/sharedStyle';
import InputWithDate from '../../../../components/InputWithDate/InputWithDate';

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
  const {data: events, refetch: refetchEvent}= useGetEventsByLead(leadId);

  const {data: eventList, refetch: refetchEventList} = useGetAllEventList();
const [eventOptions, setEventOptions] = useState<{ label: string; value: string }[]>([]);

useEffect(() => {
  if (eventList && Array.isArray(eventList)) {
    setEventOptions(
      eventList.map((event: any) => ({
        label: event.eventName,
        value: event.id,
      }))
    );
  }
}, [eventList]);


  const initialValues = {
    eventListId:'',
    eventName: '',
    date: '',
    numberOfGuests: '',
    note:'',
    crew: ''
  };
  
  const validationSchema = Yup.object({

    eventListId: Yup.string().required('Event is required'),
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
    // validationSchema,
    onSubmit: async (values : any, {resetForm}) => {
      const body={
        others: formik.values.eventName,
        eventListId: values.eventListId.value,
        date: formik.values.date,
        numberOfGuests: formik.values.numberOfGuests,
        note: formik.values.note,
        createdBy: userid,
        leadId: leadId,
        crew: formik.values.crew,
      };

      const response = await createEventMutate.mutateAsync([body, userid]);
      refetchEvent();
      refetch();
      resetForm();

      
    },
  });

  console.log("sdsd", );

  return (
    <CustomModal
      open={open}
      onClose={onClose}
      title={title}
      footer={footer}
      width={width}
    >
      <form onSubmit={formik.handleSubmit}>
        <SharedInputWrapper>

         {/* <InputWithLabel
  label="Date"
  name="date"
  placeholder="Enter event date"
  type="date"
  value={formik.values.date}
  onChange={formik.handleChange}
  onBlur={formik.handleBlur}
  error={
    formik.touched.date && formik.errors.date
      ? typeof formik.errors.date === 'string'
        ? formik.errors.date
        : Array.isArray(formik.errors.date)
          ? formik.errors.date.join(', ')
          : JSON.stringify(formik.errors.date)
      : ''
  }
  inputProps={{
    onFocus: e => {
      // Open native date picker on focus (supported in Chrome, Edge, etc.)
      e.target.showPicker && e.target.showPicker();
    }
  }}
/> */}

<InputWithDate
  label="Date"
  name="date"
  value={formik.values.date}
  onChange={formik.handleChange}
  onBlur={formik.handleBlur}
  error={
    formik.touched.date && formik.errors.date
      ? typeof formik.errors.date === 'string'
        ? formik.errors.date
        : Array.isArray(formik.errors.date)
          ? formik.errors.date.join(', ')
          : JSON.stringify(formik.errors.date)
      : ''
  }
/>

<CustomSelect
  label="Event"
  name="eventId"
  placeholder='Select an event'
  options={eventOptions}
  value={formik.values.eventListId}
  onChange={(inputValue: any) => {
    formik.setFieldValue('eventListId', inputValue);
  }}
  onBlur={formik.handleBlur}
  error={formik.touched.eventListId && formik.errors.eventListId ? formik.errors.eventListId : ''}
/>


{formik.values.eventListId && formik.values.eventListId.label === "Others" && (

         <InputWithLabel
          label="Event Name"
          name="eventName"
          placeholder="Enter event name"
          value={formik.values.eventName}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />

         )}

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
          label="Crew Member (optional)"
          name="crew"
          placeholder="Enter number of member"
          type="number"
          value={formik.values.crew}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          
        />
         <InputWithLabel
          label="Note (optional)"
          name="note"
          type="text"
          value={formik.values.note}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />

        <div style={{  textAlign: 'right' }}>
          <Button onClick={onClose} style={{ marginRight: 10 }}>
            Cancel
          </Button>
          <Button type="primary" onClick={()=>formik.handleSubmit()}>
            Submit
          </Button>
        </div>

                </SharedInputWrapper>

      </form>

      <EventList events={events} />

    </CustomModal>
  );
};

export default EventModal;
