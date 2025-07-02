import React, { use, useEffect } from 'react';
import { Button, Input } from 'antd';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useMention } from '../../../../hooks/useMention';
import { createPortal } from 'react-dom';
import CustomModal from '../../../../components/customModal/CustomModal';
import { useCreateComment } from '../../../../api/post/newComment';
import { Mentions } from 'antd';
import type { GetProp, MentionProps } from 'antd';

type MentionsOptionProps = GetProp<MentionProps, 'options'>[number];


interface CommentModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  footer?: React.ReactNode;
  width?: number | string;
  leadId: number;
  assigneeOptions: any[];
  refetch?:()=> void;
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
  const [highlightedIndex, setHighlightedIndex] = React.useState(0);
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
        givenBy: userid,
        
      }
      const response = await createCommentMutate.mutateAsync([body,userid]);
      resetForm();
      refetch?.(); // Refetch the data after adding the comment
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


    const onChange = (value: string) => {
  console.log('Change:', value);
};

const onSelect = (option: MentionsOptionProps) => {
  console.log('select', option);
};

  // Reset highlight when dropdown or options change
useEffect(() => {
  if (showDropdown) setHighlightedIndex(0);
}, [showDropdown, filteredOptions.length]);

const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
  if (showDropdown && filteredOptions.length > 0) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex(i => (i + 1) % filteredOptions.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex(i => (i - 1 + filteredOptions.length) % filteredOptions.length);
    } else if (e.key === 'Enter') {
      if (filteredOptions[highlightedIndex]) {
        e.preventDefault();
        handleSelectMember(filteredOptions[highlightedIndex]);
      }
    }
  } else {
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
  }
};

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
              fontFamily: 'sans-serif'
            }}
            onKeyDown={handleKeyDown}
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
              {filteredOptions.map((member: any, idx: number) => (
                <div
                  key={member.value}
                  style={{
                    padding: 8,
                    cursor: 'pointer',
                    color: 'white',
                    background: idx === highlightedIndex ? '#444' : undefined,
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleSelectMember(member);
                  }}
                  onMouseEnter={() => setHighlightedIndex(idx)}
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
