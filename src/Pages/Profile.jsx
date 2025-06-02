import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import {
  Card,
  Avatar,
  Upload,
  Button,
  Descriptions,
  message,
  Typography,
  Space,
  Modal,
  Form,
  Input,
  Row,
  Col,
} from 'antd';
import {
  UploadOutlined,
  UserOutlined,
  EditOutlined,
  LogoutOutlined,
} from '@ant-design/icons';

const { Title } = Typography;

const Profile = () => {
  const navigate = useNavigate(); // Initialize navigate

  const [imageUrl, setImageUrl] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const [profileData, setProfileData] = useState({
    name: 'Shrutika Desai',
    phone: '+91-9876543210',
    email: 'shrutika@example.com',
    city: 'Pune',
  });

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleUpload = info => {
    if (info.file.status === 'done') {
      message.success(`${info.file.name} uploaded successfully`);
      const reader = new FileReader();
      reader.onload = () => setImageUrl(reader.result);
      reader.readAsDataURL(info.file.originFileObj);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} upload failed.`);
    }
  };

  const showModal = () => {
    form.setFieldsValue(profileData);
    setIsModalVisible(true);
  };

  const handleOk = () => {
    form
      .validateFields()
      .then(values => {
        setProfileData(values);
        setIsModalVisible(false);
        message.success('Profile updated successfully!');
      })
      .catch(info => {
        console.log('Validate Failed:', info);
      });
  };

  const handleCancel = () => setIsModalVisible(false);

  const handleLogout = () => {
    message.warning('Logged out!');
    navigate('/login');  // Redirect to login page
  };

  // Adjust avatar size for smaller screens
  const avatarSize = windowWidth < 480 ? 70 : 100;
  const titleFontSize = windowWidth < 480 ? 20 : 28;

  return (
    <div
      style={{
        background: 'linear-gradient(to right, #f0f2f5, #e6f7ff)',
        minHeight: '100vh',
        padding: '30px 20px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 480,
          background: 'white',
          borderRadius: 20,
          boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
          overflow: 'hidden',
          minHeight: 480,
          display: 'flex',
          flexDirection: 'column',
          paddingBottom: 20,
        }}
      >
        <div
          style={{
            height: 120,
            background: 'linear-gradient(to right, #1890ff, #40a9ff)',
          }}
        />
        <div
          style={{
            marginTop: -60,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '0 20px',
            flexGrow: 1,
          }}
        >
          <Avatar
            size={avatarSize}
            icon={<UserOutlined />}
            src={imageUrl}
            style={{
              border: '3px solid white',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            }}
          />
          <div style={{ marginTop: 12, marginBottom: 20 }}>
            <Upload
              showUploadList={false}
              customRequest={({ file, onSuccess }) => {
                setTimeout(() => onSuccess('ok'), 1000);
              }}
              onChange={handleUpload}
            >
              <Button
                icon={<UploadOutlined />}
                type="primary"
                ghost
                size={windowWidth < 480 ? 'small' : 'middle'}
              >
                Change Picture
              </Button>
            </Upload>
          </div>

          <Title
            level={4}
            style={{
              fontSize: titleFontSize,
              textAlign: 'center',
              marginBottom: 20,
            }}
          >
            {profileData.name}
          </Title>

          <Descriptions
            title="Contact Info"
            bordered
            size={windowWidth < 480 ? 'small' : 'default'}
            column={1}
            labelStyle={{ fontWeight: 600 }}
            contentStyle={{ color: '#595959' }}
            style={{ width: '100%' }}
          >
            <Descriptions.Item label="Phone">{profileData.phone}</Descriptions.Item>
            <Descriptions.Item label="Email">{profileData.email}</Descriptions.Item>
            <Descriptions.Item label="City">{profileData.city}</Descriptions.Item>
          </Descriptions>

          <div
            style={{
              marginTop: 30,
              display: 'flex',
              gap: 15,
              flexWrap: 'wrap',
              justifyContent: 'center',
              width: '100%',
            }}
          >
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={showModal}
              style={{
                background: 'linear-gradient(to right, #36D1DC, #5B86E5)',
                border: 'none',
                borderRadius: 10,
                padding: '0 25px',
                height: 40,
                fontWeight: 500,
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                minWidth: 120,
                whiteSpace: 'nowrap',
              }}
            >
              Edit
            </Button>

            <Button
              icon={<LogoutOutlined />}
              onClick={handleLogout}
              style={{
                background: 'linear-gradient(to right,rgb(126, 20, 45), #ff4b2b)',
                color: 'white',
                border: 'none',
                borderRadius: 10,
                padding: '0 25px',
                height: 40,
                fontWeight: 500,
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                minWidth: 120,
                whiteSpace: 'nowrap',
              }}
            >
              Logout
            </Button>
          </div>
        </div>
      </div>

      <Modal
        title="Edit Profile"
        open={isModalVisible}
        onCancel={handleCancel}
        width={windowWidth < 480 ? '90%' : 520}
        footer={
          <div style={{ textAlign: 'center' }}>
            <Space>
              <Button onClick={handleCancel}>Cancel</Button>
              <Button type="primary" onClick={handleOk}>
                Save
              </Button>
            </Space>
          </div>
        }
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Full Name"
            rules={[{ required: true, message: 'Please enter your name' }]}
          >
            <Input placeholder="Enter name" />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Phone"
            rules={[{ required: true, message: 'Please enter your phone number' }]}
          >
            <Input placeholder="Enter phone" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please enter your email' },
              { type: 'email', message: 'Enter a valid email' },
            ]}
          >
            <Input placeholder="Enter email" />
          </Form.Item>

          <Form.Item
            name="city"
            label="City"
            rules={[{ required: true, message: 'Please enter your city' }]}
          >
            <Input placeholder="Enter city" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Profile;
