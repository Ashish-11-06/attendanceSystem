// src/Models/AddVolunteerModal.jsx
import React from 'react';
import { Modal, Form, Input, Select, Row, Col, Button } from 'antd';

const { Option } = Select;

const AddVolunteerModal = ({ visible, onCancel, onAdd }) => {
  const [form] = Form.useForm();

  const handleFinish = (values) => {
    onAdd(values);
    form.resetFields();
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title="Add New Volunteer"
      open={visible}
      onCancel={handleCancel}
      footer={null}
      destroyOnClose
      centered
      bodyStyle={{ padding: '24px 24px 12px' }}
      width="90%"
      style={{ maxWidth: 600 }}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{ gender: 'Male' }}
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: 'Please input volunteer name!' }]}
        >
          <Input placeholder="Enter name" />
        </Form.Item>

        <Form.Item
          label="Gender"
          name="gender"
          rules={[{ required: true, message: 'Please select gender!' }]}
        >
          <Select>
            <Option value="Male">Male</Option>
            <Option value="Female">Female</Option>
            <Option value="Other">Other</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Phone Number"
          name="phone"
          rules={[
            {
              validator: (_, value) =>
                !value || /^\d{3}-\d{3}-\d{4}$/.test(value)
                  ? Promise.resolve()
                  : Promise.reject('Phone number must be in format xxx-xxx-xxxx'),
            },
          ]}
        >
          <Input placeholder="123-456-7890 (optional)" />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            {
              validator: (_, value) =>
                !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
                  ? Promise.resolve()
                  : Promise.reject('Please enter a valid email address'),
            },
          ]}
        >
          <Input placeholder="example@example.com (optional)" />
        </Form.Item>

        <Form.Item
          label="Old Personal Number"
          name="oldPersonalNumber"
          rules={[
            { required: true, message: 'Please input old personal number!' },
            {
              pattern: /^[a-zA-Z0-9]{6,12}$/,
              message: 'Must be 6-12 alphanumeric characters',
            },
          ]}
        >
          <Input placeholder="Enter old personal number (6-12 chars)" />
        </Form.Item>

        <Form.Item
          label="New Personal Number"
          name="newPersonalNumber"
          rules={[
            { required: true, message: 'Please input new personal number!' },
            {
              pattern: /^[a-zA-Z0-9]{6,12}$/,
              message: 'Must be 6-12 alphanumeric characters',
            },
          ]}
        >
          <Input placeholder="Enter new personal number (6-12 chars)" />
        </Form.Item>

        <Form.Item>
          <Row justify="center" gutter={16}>
            <Col>
              <Button onClick={handleCancel}>Cancel</Button>
            </Col>
            <Col>
              <Button type="primary" htmlType="submit">
                Add Volunteer
              </Button>
            </Col>
          </Row>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddVolunteerModal;
