// src/Pages/Login.jsx
import React from "react";
import {
  Form,
  Input,
  Button,
  Typography,
  Card,
  Radio,
  message,
  Row,
  Col,
} from "antd";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import authAPIs from "../Redux/Api/authApi"; 

const { Title, Text } = Typography;

const AnimatedTypingWithSlogan = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 12,
        userSelect: "none",
        padding: "20px",
        textAlign: "center",
      }}
    >
      <h1
        className="typing-text"
        style={{
          fontSize: "2.2rem",
          fontWeight: "900",
          background: "linear-gradient(90deg, #36D1DC, #5B86E5)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          fontFamily: "'Poppins', sans-serif",
          whiteSpace: "nowrap",
          overflow: "hidden",
          borderRight: "0.15em solid #5B86E5",
          width: "22ch",
          animation: "typing 3s steps(22), blink 0.75s step-end infinite",
          margin: 0,
        }}
      >
        Attendance System
      </h1>

      <motion.p
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 3, duration: 1.2 }}
        style={{
          fontSize: "1rem",
          fontWeight: "600",
          fontStyle: "italic",
          color: "#2380c3",
          margin: 0,
          lineHeight: 1.4,
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        }}
      >
        Empowering your attendance tracking with ease and accuracy.
      </motion.p>

      <style>{`
        @keyframes typing {
          from { width: 0 }
          to { width: 22ch }
        }
        @keyframes blink {
          50% { border-color: transparent }
        }

        @media (max-width: 576px) {
          .typing-text {
            font-size: 1.6rem !important;
            width: 18ch !important;
          }
        }
      `}</style>
    </div>
  );
};

const Login = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      const { data } = await authAPIs.login(values);

      message.success("Login successful!");
      console.log("Response:", data);

    if (!data.user.id) {
      data.user.id = data.user._id || ""; // fallback if _id exists or empty string
    }

          // Store the email, password, and user_type in localStorage
localStorage.setItem("user", JSON.stringify(data.user));
 

      
      // localStorage.setItem("token", data.token); // adjust based on your API
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
      const msg =
        error.response?.data?.message ||
        error.response?.data?.detail ||
        "Login failed. Please try again.";
      message.error(msg);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Login failed:", errorInfo);
    message.error("Please check the form fields and try again.");
  };

  return (
    <div
      style={{
        minHeight: "92vh",
        background: "#f0f2f5",
        padding: "20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Row
        gutter={[32, 32]}
        style={{ width: "100%", maxWidth: "1200px" }}
        align="middle"
        justify="center"
      >
        <Col
          xs={24}
          md={12}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <AnimatedTypingWithSlogan />
        </Col>

        <Col xs={24} md={12}>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Card
              bordered={false}
              style={{
                borderRadius: 20,
                background: "white",
                boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                border: "1px solid #ddd",
                width: "100%",
                maxWidth: 400,
                margin: "0 auto",
              }}
            >
              <Title
                level={2}
                style={{
                  textAlign: "center",
                  marginBottom: 24,
                  color: "#1890ff",
                }}
              >
                Login
              </Title>

              <Form
                form={form}
                name="loginForm"
                layout="vertical"
                initialValues={{ email: "", password: "", userType: "" }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
              >
                <Form.Item
                  label="Email"
                  name="email"
                  rules={[
                    { required: true, message: "Please input your email!" },
                    { type: "email", message: "Please enter a valid email!" },
                  ]}
                >
                  <Input placeholder="Enter your email" />
                </Form.Item>

                <Form.Item
                  label="Password"
                  name="password"
                  rules={[
                    { required: true, message: "Please input your password!" },
                  ]}
                >
                  <Input.Password placeholder="Enter your password" />
                </Form.Item>

                <Form.Item
                  label="User Type"
                  name="user_type"
                  rules={[
                    { required: true, message: "Please select a user type!" },
                  ]}
                >
                  <div
                    style={{ display: "flex", gap: "90px", marginLeft: "60px" }}
                  >
                    <Radio.Group>
                      <Radio value="admin" style={{ marginRight: 30 }}>
                        Admin
                      </Radio>
                      <Radio value="unit">Unit</Radio>
                    </Radio.Group>
                  </div>
                </Form.Item>

                <Form.Item style={{ marginBottom: 0 }}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    style={{
                      width: "100%",
                      borderRadius: 8,
                      padding: "10px 0",
                      fontWeight: "600",
                      fontSize: 16,
                      background: "linear-gradient(135deg, #36D1DC, #5B86E5)",
                      border: "none",
                    }}
                  >
                    Login
                  </Button>
                </Form.Item>
              </Form>

              <div style={{ textAlign: "center", marginTop: 16 }}>
                <Text type="secondary">Don't have an account?</Text>{" "}
                <a
                  href="/signup"
                  style={{ color: "#1890ff", fontWeight: "500" }}
                >
                  Sign up
                </a>
              </div>
            </Card>
          </motion.div>
        </Col>
      </Row>
    </div>
  );
};

export default Login;
