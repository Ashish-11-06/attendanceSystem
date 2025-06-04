// src/components/Modals/AddUnitModal.jsx
import React, { useEffect } from 'react';
import { Modal, Form, Input, Button, message } from 'antd';
import { addUnit, updateUnit } from '../../Redux/Slices/UnitSlice';
import { useDispatch } from 'react-redux';

const AddUnitModal = ({ open, onCancel, form, editingUnit }) => {
  const dispatch = useDispatch();
  const isEditing = !!editingUnit;

  useEffect(() => {
    if (editingUnit) {
      form.setFieldsValue(editingUnit);
    }
  }, [editingUnit, form]);

  const onFinish = async (values) => {
    try {
      const result = isEditing
        ? await dispatch(updateUnit({ ...editingUnit, ...values }))
        : await dispatch(addUnit(values));

      if ((isEditing ? updateUnit : addUnit).fulfilled.match(result)) {
        message.success(`Unit ${isEditing ? 'updated' : 'added'} successfully!`);
        form.resetFields();
        onCancel();
      } else {
        throw new Error(result.payload || `Failed to ${isEditing ? 'update' : 'add'} unit`);
      }
    } catch (error) {
      message.error(error.message || `Error ${isEditing ? 'updating' : 'adding'} unit`);
    }
  };

  return (
    <Modal
      title={isEditing ? 'Edit Unit' : 'Add New Unit'}
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
          rules={[{ required: true, message: 'Please enter unit ID' }]}
        >
          <Input disabled={isEditing} />
        </Form.Item>

        <Form.Item
          name="unit_name"
          label="Unit Name"
          rules={[{ required: true, message: 'Please enter unit name' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="password"
          label="Password"
          rules={[{ required: !isEditing, message: 'Please enter password' }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="location"
          label="Address"
          rules={[{ required: true, message: 'Please enter address' }]}
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
          <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 24 }}>
            <Button
              onClick={() => {
                onCancel();
                form.resetFields();
              }}
            >
              Cancel
            </Button>
            <Button type="primary" htmlType="submit">
              {isEditing ? 'Update Unit' : 'Add Unit'}
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddUnitModal;
