// src/Models/AddUnitModal.jsx

import React from 'react';
import { Modal, Form, Input, Select, Button } from 'antd';

const { Option } = Select;

const AddUnitModal = ({ open, onCancel, onFinish, form }) => {
  return (
    <Modal
      title="Add New Unit"
      open={open}
      onCancel={() => {
        onCancel();
        form.resetFields();
      }}
      footer={null}
      destroyOnClose
    >
      <Form form={form} layout="vertical" onFinish={onFinish} autoComplete="off">
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: 'Please enter name' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="password"
          label="Password"
          rules={[{ required: true, message: 'Please enter password' }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="location"
          label="Location"
          rules={[{ required: true, message: 'Please select location' }]}
        >
          <Select
            showSearch
            placeholder="Select location"
            optionFilterProp="children"
            filterOption={(input, option) =>
              option?.children?.toLowerCase().includes(input.toLowerCase())
            }
          >
            <Option value="Pune">Pune</Option>
            <Option value="Mumbai">Mumbai</Option>
          </Select>
        </Form.Item>

        <Form.Item name="email" label="Email (optional)">
          <Input />
        </Form.Item>

        <Form.Item name="phone" label="Phone (optional)">
          <Input />
        </Form.Item>

        <Form.Item>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 16,
              marginTop: 24,
            }}
          >
            <Button
              onClick={() => {
                onCancel();
                form.resetFields();
              }}
            >
              Cancel
            </Button>
            <Button type="primary" htmlType="submit">
              Add Unit
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddUnitModal;
