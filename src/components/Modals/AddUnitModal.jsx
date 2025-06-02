// src/Models/AddUnitModal.jsx

import React from 'react';
import { Modal, Form, Input, Select, Button, message } from 'antd';
import { addUnit } from '../../Redux/Slices/UnitSlice';
import { useDispatch } from 'react-redux';

const { Option } = Select;

const AddUnitModal = ({ open, onCancel, form }) => {
const dispatch = useDispatch();
  
    const onFinish = async (values) => {
    try {
      const result = await dispatch(addUnit(values));
      if (addUnit.fulfilled.match(result)) {
        message.success('Unit added successfully!');
        form.resetFields();
        onCancel();
      } else {
        throw new Error(result.payload || 'Failed to add unit');
      }
    } catch (error) {
      message.error(error.message || 'Error adding unit');
    }
  };



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
          name="unit_id"
          label="Unit ID"
          rules={[{ required: true, message: 'Please enter name' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="unit_name"
          label="Unit Name"
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
          label="Address"
          rules={[{ required: true, message: 'Please select location' }]}
        >
          <Input />
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
