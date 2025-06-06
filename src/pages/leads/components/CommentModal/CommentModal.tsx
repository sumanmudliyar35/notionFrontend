import React from 'react';
import CustomModal from '../../../../components/customModal/CustomModal';
import { Button } from 'antd';
import InputWithLabel from '../../../../components/customInput/CustomInput';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useCreateComment } from '../../../../api/post/newComment';
import { useGetCommentsByLead } from '../../../../api/get/getCommentsByLead';
import CommentsList from '../CommentsList/CommentsList';
// import CommentsList from '../CommentsList/CommentsList';

interface CommentModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  footer?: React.ReactNode;
  width?: number | string;
  leadId: number;
  refetch: () => void;
}

const CommentModal: React.FC<CommentModalProps> = ({
  open,
  onClose,
  title = 'Add Comment',
  footer = null,
  width = 600,
  leadId,
  refetch,
}) => {
  const userid = localStorage.getItem('userid');
  const { data: comments, refetch: refetchComments } = useGetCommentsByLead(leadId);
  const createCommentMutate = useCreateComment();

  const initialValues = {
    comment: '',
  };

  const validationSchema = Yup.object({
    comment: Yup.string().required('Comment is required'),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      const payload = {
        comment: values.comment,
        givenBy: userid, // You can dynamically pass user ID here
        leadId,
      };

      await createCommentMutate.mutateAsync([payload, 1]);
      resetForm();
      refetchComments();
      refetch();
    },
  });

  return (
    <CustomModal open={open} onClose={onClose} title={title} footer={footer} width={width}>
      <form onSubmit={formik.handleSubmit}>
        <InputWithLabel
          label="Comment"
          name="comment"
          placeholder="Enter comment"
          value={formik.values.comment}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.comment && formik.errors.comment ? formik.errors.comment : ''}
        />

        <div style={{ marginTop: 20, textAlign: 'right' }}>
          <Button onClick={onClose} style={{ marginRight: 10 }}>
            Cancel
          </Button>
          <Button type="primary" htmlType="submit">
            Add Comment
          </Button>
        </div>
      </form>

      <CommentsList comments={comments?.data || []} />
    </CustomModal>
  );
};

export default CommentModal;
