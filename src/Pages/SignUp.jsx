import React, { useState } from 'react';
import {
  Form,
  Input,
  Button,
  Typography,
  Card,
  message,
  Row,
  Col,
} from 'antd';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import authAPIs from "../Redux/Api/authApi";


const { Title, Text } = Typography;

const AnimatedTypingWithSlogan = () => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        userSelect: 'none',
        padding: '0 16px',
        textAlign: 'center',
      }}
    >
      <h1
        className="typing-text"
        style={{
          fontSize: '2.4rem',
          fontWeight: '900',
          background: 'linear-gradient(90deg, #36D1DC, #5B86E5)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontFamily: "'Poppins', sans-serif",
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          borderRight: '0.15em solid #5B86E5',
          width: '18ch',
          animation: 'typing 3s steps(18), blink 0.75s step-end infinite',
          margin: 0,
        }}
      >
        Create Account
      </h1>

      <motion.p
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 3, duration: 1.2 }}
        style={{
          fontSize: '1.1rem',
          fontWeight: '600',
          fontStyle: 'italic',
          color: '#2380c3',
          lineHeight: 1.4,
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        }}
      >
        Join us to streamline your attendance experience.
      </motion.p>

      <style>{`
        @keyframes typing {
          from { width: 0 }
          to { width: 18ch }
        }
        @keyframes blink {
          50% { border-color: transparent }
        }

        @media (max-width: 768px) {
          .typing-text {
            font-size: 1.8rem !important;
            width: 16ch;
          }
        }
      `}</style>
    </div>
  );
};

const Signup = () => {
  const [form] = Form.useForm();
  const [otpVisible, setOtpVisible] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      const response = await authAPIs.register({
        email: values.email,
        password: values.password,
        unit_name: values.name,
      });

      message.success('Registered successfully! OTP sent to your email.');
      setOtpVisible(true);
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to register.');
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Signup failed:', errorInfo);
    message.error('Please check the form fields and try again.');
  };

  const handleOtpVerification = async () => {
    const email = form.getFieldValue('email');
    const otp = form.getFieldValue('otp');

    if (!otp || otp.length !== 6) {
      message.error('Please enter a valid 6-digit OTP.');
      return;
    }

    try {
      const response = await authAPIs.verifyOtp({ email, otp });

      if (response.data.success === false) {
        throw new Error(response.data.message || 'Invalid OTP, please try again.');
      }

      message.success('OTP verified successfully! Redirecting to login...');
      setOtpVerified(true);

      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to verify OTP.');
    }
  };

  return (
    <div style={{ minHeight: '92vh', background: '#f0f2f5', padding: '20px' }}>
      <Row justify="center" align="middle" gutter={[32, 32]}>
        <Col
          xs={24}
          md={12}
          style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
        >
          <AnimatedTypingWithSlogan />
        </Col>

        <Col xs={24} md={12} style={{ display: 'flex', justifyContent: 'center' }}>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            style={{ width: '100%', maxWidth: 400 }}
          >
            <Card
              bordered={false}
              style={{
                borderRadius: 20,
                background: 'white',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                border: '1px solid #ddd',
              }}
            >
              <Title level={2} style={{ textAlign: 'center', marginBottom: 24, color: '#1890ff' }}>
                Sign Up for Unit
              </Title>

              <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
              >
                <Form.Item
                  label="Unit Name"
                  name="name"
                  rules={[{ required: true, message: 'Please enter your name!' }]}
                >
                  <Input placeholder="Enter your unit name" />
                </Form.Item>

                <Form.Item
                  label="Email"
                  name="email"
                  rules={[
                    { required: true, message: 'Please input your email!' },
                    { type: 'email', message: 'Please enter a valid email!' },
                  ]}
                >
                  <Input placeholder="Enter your email" />
                </Form.Item>

                <Form.Item
                  label="Password"
                  name="password"
                  rules={[{ required: true, message: 'Please input your password!' }]}
                  hasFeedback
                >
                  <Input.Password placeholder="Enter a password" />
                </Form.Item>

                <Form.Item
                  label="Confirm Password"
                  name="confirmPassword"
                  dependencies={['password']}
                  hasFeedback
                  rules={[
                    { required: true, message: 'Please confirm your password!' },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('password') === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error('Passwords do not match!'));
                      },
                    }),
                  ]}
                >
                  <Input.Password placeholder="Confirm your password" />
                </Form.Item>

                <Form.Item style={{ marginBottom: 0 }}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    style={{
                      width: '100%',
                      borderRadius: 8,
                      padding: '10px 0',
                      fontWeight: '600',
                      fontSize: 16,
                      background: 'linear-gradient(135deg, #36D1DC, #5B86E5)',
                      border: 'none',
                    }}
                    disabled={otpVisible}
                  >
                    Sign Up
                  </Button>
                </Form.Item>

                {otpVisible && (
                  <Form.Item label="OTP" required>
                    <Input.Group compact>
                      <Form.Item
                        name="otp"
                        noStyle
                        rules={[{ required: true, message: 'Please enter the OTP!' }]}
                      >
                        <Input
                          placeholder="Enter OTP"
                          style={{ width: '70%' }}
                          disabled={otpVerified}
                        />
                      </Form.Item>

                      <Button
                        type={otpVerified ? 'default' : 'primary'}
                        onClick={handleOtpVerification}
                        style={{ width: '30%' }}
                        disabled={otpVerified}
                      >
                        {otpVerified ? 'Verified' : 'Verify OTP'}
                      </Button>
                    </Input.Group>
                  </Form.Item>
                )}

                <div style={{ textAlign: 'center', marginTop: 16 }}>
                  <Text type="secondary">Already have an account?</Text>{' '}
                  <a href="/login" style={{ color: '#1890ff', fontWeight: '500' }}>
                    Login
                  </a>
                </div>
              </Form>
            </Card>
          </motion.div>
        </Col>
      </Row>
    </div>
  );
};

export default Signup;
