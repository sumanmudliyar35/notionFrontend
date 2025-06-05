import React from 'react';
import { Button } from 'antd';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import CustomModal from '../../../../components/customModal/CustomModal';
import InputWithLabel from '../../../../components/customInput/CustomInput';
import { useCreateUser } from '../../../../api/post/newUser';
import CustomSelect from '../../../../components/customSelect/CustomSelect';

interface AddMemberModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  width?: number | string;
  refetch: any;
}

const roleOptions = [
  { label: 'Super Admin', value: '1' },
  { label: 'Member', value: '3' },
];

const AddMemberModal: React.FC<AddMemberModalProps> = ({
  open,
  onClose,
  title = 'Add New Member',
  width = 500,
  refetch
}) => {

  const useCreateMutate = useCreateUser();
  const formik = useFormik({
    initialValues: {
      name: '',
      username: '',
      password: '',
      role: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Name is required'),
      username: Yup.string().required('Username is required'),
      password: Yup.string().required('Password is required'),
      role: Yup.string().required('Role is required'),
    }),
    onSubmit: async(values, {resetForm}) => {
      const body = {
        name: values.name,
        email: values.username,
        password: values.password,
        roleId: values.role,
      };

      await useCreateMutate.mutateAsync([body, 1]);
      refetch();
      resetForm();
    },
  });

  return (
    <CustomModal open={open} onClose={onClose} title={title} width={width}>
      <form onSubmit={formik.handleSubmit}>
        <InputWithLabel
          label="Name"
          name="name"
          placeholder="Enter name"
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={
            formik.touched.name && formik.errors.name
              ? formik.errors.name
              : ''
          }
        />

        <InputWithLabel
          label="Email"
          name="username"
          placeholder="Enter Email"
          value={formik.values.username}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={
            formik.touched.username && formik.errors.username
              ? formik.errors.username
              : ''
          }
        />

        <InputWithLabel
          label="Password"
          name="password"
          type="password"
          placeholder="Enter password"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={
            formik.touched.password && formik.errors.password
              ? formik.errors.password
              : ''
          }
        />

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 4 }}>Role</label>
          <CustomSelect
            options={roleOptions}
            value={roleOptions.find(opt => opt.value === formik.values.role) || null}
            onChange={option => formik.setFieldValue('role', option ? option.value : '')}
            placeholder="Select role"
            error={formik.touched.role && formik.errors.role}
          />
          {formik.touched.role && formik.errors.role && (
            <div style={{ color: 'red', fontSize: 12 }}>{formik.errors.role}</div>
          )}
        </div>

        <div style={{ marginTop: 20, textAlign: 'right' }}>
          <Button onClick={onClose} style={{ marginRight: 10 }}>
            Cancel
          </Button>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </div>
      </form>
    </CustomModal>
  );
};

export default AddMemberModal;
