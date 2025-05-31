import React, { useState } from 'react';
import {
  Card,
  Avatar,
  Upload,
  Button,
  Descriptions,
  message,
  Typography,
} from 'antd';
import { UploadOutlined, UserOutlined } from '@ant-design/icons';

const { Title } = Typography;

const Profile = () => {
  const [imageUrl, setImageUrl] = useState(null);

  const handleUpload = info => {
    if (info.file.status === 'done') {
      message.success(`${info.file.name} uploaded successfully`);
      const reader = new FileReader();
      reader.onload = () => {
        setImageUrl(reader.result);
      };
      reader.readAsDataURL(info.file.originFileObj);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} upload failed.`);
    }
  };

  return (
    <div
      style={{
        background: 'linear-gradient(to right, #f0f2f5, #e6f7ff)',
        minHeight: '100vh',
        padding: '50px 20px',
      }}
    >
      <Card
        style={{
          maxWidth: 500,
          margin: '0 auto',
          borderRadius: 20,
          boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
          overflow: 'hidden',
        }}
        cover={
          <div
            style={{
              height: 120,
              background: 'linear-gradient(to right, #1890ff, #40a9ff)',
            }}
          />
        }
      >
        <div style={{ textAlign: 'center', marginTop: -60 }}>
          <Avatar
            size={100}
            icon={<UserOutlined />}
            src={imageUrl}
            style={{
              border: '3px solid white',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            }}
          />
          <div style={{ marginTop: 12 }}>
            <Upload
              showUploadList={false}
              customRequest={({ file, onSuccess }) => {
                setTimeout(() => {
                  onSuccess('ok');
                }, 1000);
              }}
              onChange={handleUpload}
            >
              <Button
                icon={<UploadOutlined />}
                type="primary"
                ghost
                size="small"
              >
                Change Picture
              </Button>
            </Upload>
          </div>
        </div>

        <div style={{ padding: '20px 10px' }}>
          <Title level={4} style={{ textAlign: 'center' }}>
            Shrutika Desai
          </Title>

          <Descriptions
            title="User Info"
            bordered
            size="small"
            column={1}
            labelStyle={{ fontWeight: 600, width: '40%' }}
            contentStyle={{ color: '#595959' }}
          >
            <Descriptions.Item label="Email">
              shrutika@example.com
            </Descriptions.Item>
            <Descriptions.Item label="Phone">+91-9876543210</Descriptions.Item>
            <Descriptions.Item label="Role">Customer</Descriptions.Item>
          </Descriptions>
        </div>
      </Card>
    </div>
  );
};

export default Profile;
