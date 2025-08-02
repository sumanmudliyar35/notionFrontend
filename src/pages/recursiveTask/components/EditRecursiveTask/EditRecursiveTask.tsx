import React, { useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import dayjs from 'dayjs'
import CustomModal from '../../../../components/customModal/CustomModal'
import DateInput from '../../../../components/CustomDateInput/CustomDateInput'
import CustomInput from '../../../../components/customInput/CustomInput'
import { useGetRecursiveTask } from '../../../../api/get/getRecursiveTask'
import { useGetPreviousRecursiveTaskLogsByRecursiveId } from '../../../../api/get/getRecursiveTaskLogByDateAndRecursiveTask'
import { formatDisplayDate } from '../../../../utils/commonFunction'
import { Badge, Tabs } from "antd";

interface EditRecursiveTaskProps {
  open: boolean;
  onClose: () => void;
  title: string;
  taskId: number;
  width?: string | number;
  onSave?: (taskId: number, data: any) => void; // Add this if you want to handle save
}

const validationSchema = Yup.object().shape({
  endDate: Yup.date().required('End date is required'),
  // Add other fields if you want to edit more
});

const EditRecursiveTask = ({ open, onClose, title, width, taskId, onSave }: EditRecursiveTaskProps) => {
  const { data: RecursiveTaskData, isLoading: taskLoading } = useGetRecursiveTask(taskId);

  const {data: LastPrecursiveTaskLogs}= useGetPreviousRecursiveTaskLogsByRecursiveId(taskId);

    const [showFullName, setShowFullName] = useState(false);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      endDate: RecursiveTaskData?.endDate || '',
      // Add other fields if needed
    },
    validationSchema,
    onSubmit: values => {
      if (onSave) {
        onSave(taskId,  values.endDate
        );
      }
      onClose();
    },
  });

  return (
    <CustomModal
      open={open}
      onClose={onClose}
      title={title}
      width={width}
    >
      {taskLoading ? (
        <div>Loading...</div>
      ) : (
        <form onSubmit={formik.handleSubmit}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ fontWeight: 600 }}>
              Name:&nbsp;
              {RecursiveTaskData?.title
                ? (
                  <>
                    {showFullName || RecursiveTaskData.title.length <= 100
                      ? RecursiveTaskData.title
                      : `${RecursiveTaskData.title.slice(0, 100)}...`
                    }
                    {RecursiveTaskData.title.length > 100 && (
                      <span
                        style={{ color: "#1677ff", cursor: "pointer", marginLeft: 8, fontWeight: 400, fontSize: 13 }}
                        onClick={() => setShowFullName(v => !v)}
                      >
                        {showFullName ? "See less" : "See more"}
                      </span>
                    )}
                  </>
                )
                : 'Loading...'}
            </div>
             <div style={{ fontWeight: 600 }}>
                        Next Task on <span style={{color:"red"}}>{formatDisplayDate(LastPrecursiveTaskLogs?.nextRecursiveTask) || 'N/A'}</span>
                      </div>
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
      )}
      {(LastPrecursiveTaskLogs?.comments?.length > 0 || LastPrecursiveTaskLogs?.files?.length > 0) && (

        <div style={{display: 'flex', flexDirection: 'column', gap: 8}}>
           
                      <div style={{ fontWeight: 600 }}>
                        Last Task on {formatDisplayDate(LastPrecursiveTaskLogs?.date) || 'N/A'}
                      </div>

        
        <div>
          <Tabs
            defaultActiveKey="comments"
            items={[
              {
                key: "comments",
                label: <Badge count={LastPrecursiveTaskLogs?.comments?.length} size="small" color="#1677ff"><div style={{color: "white"}}>Comments</div></Badge>,
                children: (
                  LastPrecursiveTaskLogs?.comments?.length > 0 ? (
                    <div>
                    
                      <ul style={{ paddingLeft: 16 }}>
                        {LastPrecursiveTaskLogs.comments.map((comment: any) => (
                          <li key={comment.id} style={{ marginBottom: 8 }}>
                            <div style={{ fontSize: 13, color: "white" }}>{comment.comment}</div>
                            <div style={{ fontSize: 11, color: "#888" }}>
                              By: {comment.givenBy} &nbsp; | &nbsp; {dayjs(comment.givenAt).format("YYYY-MM-DD HH:mm")}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <div style={{ color: "#888" }}>No comments available.</div>
                  )
                ),
              },
              {
                key: "attachments",
                label: <Badge count={LastPrecursiveTaskLogs?.files?.length} size="small" color="#1677ff"><div style={{color: "white"}}>Attachments</div></Badge>,
                children: (
                  LastPrecursiveTaskLogs?.files?.length > 0 ? (
                    <ul style={{ paddingLeft: 16 }}>
                      {LastPrecursiveTaskLogs.files.map((file: any) => (
                        <li key={file.id} style={{ marginBottom: 8 }}>
                          <a
                            href={file.downloadUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: "#1677ff", textDecoration: "underline" }}
                            download={file.fileName}
                          >
                            {file.fileName}
                          </a>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div style={{ color: "#888" }}>No attachments available.</div>
                  )
                ),
              },
            ]}
          />
        </div>
        </div>
      )}
    </CustomModal>
  )
}

export default EditRecursiveTask