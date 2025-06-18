import React, { use, useEffect } from 'react';
import { Button, Input } from 'antd';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useMention } from '../../../../hooks/useMention';
import { createPortal } from 'react-dom';
import CustomModal from '../../../../components/customModal/CustomModal';
import { useCreateComment } from '../../../../api/post/newComment';

interface CommentModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  footer?: React.ReactNode;
  width?: number | string;
  leadId: number;
  assigneeOptions: any[];
  refetch:()=> void;
}

const CommentModal: React.FC<CommentModalProps> = ({
  open,
  onClose,
  title = 'Add Comment',
  footer = null,
  width = 600,
  leadId,
  assigneeOptions,
  refetch,
}) => {
  const initialValues = { comment:  ''};  

  const userid = Number(localStorage.getItem('userid'));

  const [storeMentionedUserIds, setStoreMentionedUserIds] = React.useState<string[]>([]);
  const validationSchema = Yup.object({
    comment: Yup.string().required('Comment is required'),
  });



  const createCommentMutate = useCreateComment();
  const formik = useFormik({
    initialValues: initialValues,
    
    validationSchema,
    onSubmit: async (values, { resetForm }) => {

      const body={

        leadId: leadId,
        comment: values.comment,
        mentionedMembers: storeMentionedUserIds,
      }
      const response = await createCommentMutate.mutateAsync([body,userid]);
      resetForm();
      refetch(); // Refetch the data after adding the comment
      setInputValue(''); // Reset the input value
      onClose();
    },
  });

    const {
    inputValue,
    setInputValue,
    showDropdown,
    dropdownPos,
    filteredOptions,
    inputRef,
    handleInputChange,
    handleSelectMember,
    mentionedUserIds,
    ignoreBlurRef,
  } = useMention(assigneeOptions, formik.values.comment);

  useEffect(() => {

    setStoreMentionedUserIds(mentionedUserIds);

  }
, [mentionedUserIds]);

  // Focus the comment input field when the modal opens
  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);



  const handleBlur = () => {
    if (ignoreBlurRef.current) return;

    formik.handleBlur({ target: { name: 'comment' } });
    };

    useEffect(() => {
      formik.setFieldValue('comment', inputValue);


    }, [inputValue]);

  return (
    <CustomModal
      open={open}
      onClose={onClose}
      title={title}
      footer={footer}
      width={width}
    >
        <div style={{ marginBottom: 20 }}>
          <textarea
            ref={inputRef}
            value={inputValue}
            onChange={(e) => handleInputChange(e)}
            onBlur={handleBlur}
            style={{
              width: '100%',
              minHeight: 80,
              border: '1px solid #ccc',
              borderRadius: 4,
              padding: 8,
              background: 'rgb(25, 25, 25)',
              color: 'white',
            }}
            onKeyDown={(e) => {
    if (e.key === 'Enter') {
      if (e.shiftKey) {
        // Insert a newline
        const cursorPos = inputRef.current?.selectionStart || 0;
        const before = inputValue.slice(0, cursorPos);
        const after = inputValue.slice(cursorPos);
        const newValue = `${before}\n${after}`;
        setInputValue(newValue);
        setTimeout(() => {
          inputRef.current?.focus();
          inputRef.current?.setSelectionRange(cursorPos + 1, cursorPos + 1);
        }, 0);
        e.preventDefault();
      } else {
        // Submit the form
        e.preventDefault();
        formik.handleSubmit();
      }
    }
  }}
          />
          {formik.touched.comment && formik.errors.comment && (
            <div style={{ color: 'red', marginTop: 4 }}>{formik.errors.comment}</div>
          )}
        </div>
        {showDropdown &&
          createPortal(
            <div
              style={{
                position: 'fixed',
                top: dropdownPos.top,
                left: dropdownPos.left,
                width: dropdownPos.width,
                background: '#222',
                zIndex: 2200,
                border: '1px solid #444',
                maxHeight: 150,
                overflowY: 'auto',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              }}
            >
              {filteredOptions.map((member: any) => (
                <div
                  key={member.value}
                  style={{ padding: 8, cursor: 'pointer', color: 'white' }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleSelectMember(member);
                  }}
                >
                  {member.label}
                </div>
              ))}
            </div>,
            document.body
          )}
        <div style={{ textAlign: 'right' }}>
          <Button onClick={() => { onClose(); console.log("djsjdj"); }} style={{ marginRight: 10 }}>
            Cancel
          </Button>
          <Button type="primary" onClick={() => formik.handleSubmit()} >
            Add Comment
          </Button>
        </div>
    </CustomModal>
  );
};

export default CommentModal;
