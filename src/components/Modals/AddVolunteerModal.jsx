import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, Button, message } from 'antd';

const { Option } = Select;

const AddVolunteerModal = ({ visible, onCancel, onFinish, volunteer }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (volunteer) {
      // Prefill form fields when editing
      form.setFieldsValue({
        name: volunteer.name,
        gender: volunteer.gender,
        phone: volunteer.phone,
        email: volunteer.email,
        oldPersonalNumber: volunteer.old_personal_number,
        newPersonalNumber: volunteer.new_personal_number,
      });
    } else {
      form.resetFields();
    }
  }, [volunteer, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      onFinish(values, volunteer ? volunteer.key : null);
      form.resetFields();
    } catch (error) {
      message.error('Please fix the errors before submitting.');
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title={volunteer ? 'Edit Volunteer' : 'Add New Volunteer'}
      visible={visible}
      onCancel={handleCancel}
      destroyOnClose
      centered
      width={600}
      footer={
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '16px',
            paddingBottom: '12px',
          }}
        >
          <Button onClick={handleCancel}>Cancel</Button>
          <Button type="primary" onClick={handleSubmit}>
            {volunteer ? 'Update' : 'Add'}
          </Button>
        </div>
      }
    >
      <Form form={form} layout="vertical">
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
                  : Promise.reject('Phone must be in format xxx-xxx-xxxx'),
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
                  : Promise.reject('Enter valid email address'),
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
      </Form>
    </Modal>
  );
};

export default AddVolunteerModal;
