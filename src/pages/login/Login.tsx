// src/pages/login/Login.tsx
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Button,Input,message } from 'antd';
import { useNavigate } from 'react-router-dom';
import * as styled from './style'
import { useLogin } from '../../api/post/login'; // <-- import the hook


const Login = () => {
  const navigate = useNavigate();
  const [responseMessage, setResponseMessage] = message.useMessage();

  const loginMutate = useLogin(); // <-- use the hook

  const formik = useFormik({
    initialValues: {
      phone: '',
      password: '',
    },
    validationSchema: Yup.object({
      phone: Yup.string().required('Phone is required'),
      password: Yup.string().required('Password is required'),
    }),
    onSubmit: async (values) => {
      const body = {
        email: formik.values.phone,
        password: formik.values.password,
      };

      try {
        const response = await loginMutate.mutateAsync(body);

        if (response.success) {
          responseMessage.open({
            type: 'success',
            content: 'Logged in successfully.',
          });
          localStorage.setItem('userid', response.data.userId);
          localStorage.setItem('roleid', response.data.roleId);
          localStorage.setItem('name', response.data.name);
          navigate('/leads');
        } else {
          responseMessage.open({
            type: 'error',
            content: response.message || 'Login failed.',
          });
        }
      } catch (error: any) {
        responseMessage.open({
          type: 'error',
          content: error?.response?.data?.message || 'Login failed.',
        });
      }
    },
  });







  return (
    <styled.Container>
      {setResponseMessage}

      <styled.Card>
        {/* <styled.Logo src={rylogo} alt="RY Logo" /> Add the logo here */}
        <styled.Title>Welcome Backkk</styled.Title>
        <styled.Subtitle>Login to your account</styled.Subtitle>

        <styled.Form onSubmit={formik.handleSubmit}>
          <Input
            name="phone"
            placeholder="username"
            value={formik.values.phone}
            onChange={(fieldValue) =>
              formik.setFieldValue('phone', fieldValue.target.value)
            }
          />

          {formik.touched.phone && formik.errors.phone && (
            <div className="text-red-500">{formik.errors.phone}</div>
          )}

          <Input
            name="password"
            placeholder="Enter your password"
            type="password"
            value={formik.values.password}
            onChange={(fieldValue) =>
              formik.setFieldValue('password', fieldValue.target.value)
            }
          />

          {formik.touched.password && formik.errors.password && (
            <div className="text-red-500">{formik.errors.password}</div>
          )}

          {/* <styled.ForgotLink>Forgot Password?</styled.ForgotLink> */}

          <Button type="primary" htmlType="submit">
            Login
          </Button>

      
        </styled.Form>

        {/* <styled.LinkText>
          Don't have an account? <a onClick={() => navigate('/signup')}>Sign Up</a>
        </styled.LinkText> */}
      </styled.Card>
    </styled.Container>

    
  );
};

export default Login;
