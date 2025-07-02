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
import MuiInputWithDate from '../../../../components/MuiDatePicker/MuiInputWithDate';
import CustomSelectWithAllOption from '../../../../components/CustomSelectWithAllOption/CustomSelectWithAllOption';
import DateInput from '../../../../components/CustomDateInput/CustomDateInput';

interface EventModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  footer?: React.ReactNode;
  width?: number | string;
  leadId: number;
  refetch: any;
  onSave?: (eventData: any, leadId: number) => void;

}

const EventModal: React.FC<EventModalProps> = ({
  open,
  onClose,
  title = 'Event Details',
  footer = null,
  width = 600,
  leadId,
  refetch,
  onSave = () => {}, // Default no-op function
}) => {


  const userid=localStorage.getItem('userid');
  const {data: events, refetch: refetchEvent}= useGetEventsByLead(leadId);

  const {data: eventList, refetch: refetchEventList} = useGetAllEventList();
const [eventOptions, setEventOptions] = useState<{ label: string; value: string }[]>([]);

useEffect(() => {
  if (eventList && Array.isArray(eventList)) {
    setEventOptions(
      eventList?.map((event: any) => ({
        label: event?.eventName,
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
    crew: '',
    eventIds: '',
  };
  
  const validationSchema = Yup.object({

    // date: Yup.string().required('Date is required'),
 
  });


  const createEventMutate = useCreateEvent();


  const formik = useFormik({
    enableReinitialize: true,
    initialValues,
    validationSchema,
    onSubmit: async (values : any, {resetForm}) => {
      const body={
        others: formik.values.eventName,
        // eventListId: values.eventListId.value,
        eventIds: formik.values.eventIds.map((event: any) => event.value).join(','),
        date: formik.values.date,
        numberOfGuests: formik.values.numberOfGuests,
        note: formik.values.note,
        createdBy: userid,
        leadId: leadId,
        crew: formik.values.crew,
      };


      onSave(body, leadId); // Call the onSave function with the body and leadId
      resetForm();

      // const response = await createEventMutate.mutateAsync([body, userid]);
      //       resetForm();

      // refetchEvent();
      // refetch();

      
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
        <SharedInputWrapper>

      

<DateInput
  label="Date"
  value={formik.values.date}
  onChange={date => formik.setFieldValue('date', date && date.isValid() ? date.format('YYYY-MM-DD') : '')}
  placeholder="Enter event date"
/>
{formik.touched.date && formik.errors.date ? (
  <div style={{ color: 'red', fontSize: 12, marginTop: 2 }}>
    {typeof formik.errors.date === 'string'
      ? formik.errors.date
      : Array.isArray(formik.errors.date)
        ? formik.errors.date.join(', ')
        : JSON.stringify(formik.errors.date)}
  </div>
) : null}




<CustomSelectWithAllOption
  label="Event"
  name="eventId"
  placeholder='Select an event'
  options={eventOptions}
  value={formik.values.eventIds}
  isMulti={true}
  onChange={(inputValue: any) => {
    formik.setFieldValue('eventIds', inputValue);

  }}
  onBlur={formik.handleBlur}
  error={formik.touched.eventIds && formik.errors.eventIds ? formik.errors.eventIds : ''}
 
/>


{Array.isArray(formik.values.eventIds) &&
  formik.values.eventIds.some((ev: any) => String(ev.value) === "4") && (
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
          type="text"
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

      {/* <EventList events={events} /> */}

    </CustomModal>
  );
};

export default EventModal;
