import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Button, message, Select, Row, Col } from 'antd';
import { addKhetra, addNewKhetra, addUnit, fetchAllUnits, updateUnit } from '../../Redux/Slices/UnitSlice';
import { useDispatch } from 'react-redux';
import { PlusOutlined } from '@ant-design/icons';

const AddUnitModal = ({ open, onCancel, form, editingUnit }) => {
  const dispatch = useDispatch();
  const isEditing = !!editingUnit;
  const [khetra, setKhetra] = useState([]);
  const [addKhetraModalVisible, setAddKhetraModalVisible] = useState(false);
  const [newKhetraName, setNewKhetraName] = useState("");

  useEffect(() => {
    const fetchKhetra = async () => {
      const response = await dispatch(addKhetra());
      setKhetra(response.payload);
      // message.success('Khetra fetched successfully!'); // Removed as per request
    };
    fetchKhetra();
  }, []);

  useEffect(() => {
    if (editingUnit) {
      form.setFieldsValue({
        ...editingUnit,
        password: '', // Clear password when editing
      });
    }
  }, [editingUnit, form]);

  const onFinish = async (values) => {
    try {
      // Don't send password if blank while editing
      if (isEditing && !values.password) {
        delete values.password;
      }

      const result = isEditing
        ? await dispatch(updateUnit({ ...editingUnit, ...values }))
        : await dispatch(addUnit(values));

      if ((isEditing ? updateUnit : addUnit).fulfilled.match(result)) {
        message.success(`Unit ${isEditing ? 'updated' : 'added'} successfully!`);
        form.resetFields();
        onCancel();
        await dispatch(fetchAllUnits());
      } else {
        throw new Error(result.payload || `Failed to ${isEditing ? 'update' : 'add'} unit`);
      }
    } catch (error) {
      message.error(error.message || `Error ${isEditing ? 'updating' : 'adding'} unit`);
    }
  };

  const handleAddKhetra = async () => {
    if (!newKhetraName.trim()) {
      message.error("Please enter a khetra name.");
      return;
    }
    try {
      // Add new khetra
      const res = await dispatch(addNewKhetra({ khetra: newKhetraName }));
      console.log(res);

      if (res?.payload.message) {
        message.success(res.payload.message || "Khetra added!");
        setAddKhetraModalVisible(false);
        setNewKhetraName("");
        // Fetch updated khetra list after adding new khetra
        const response = await dispatch(addKhetra());
        setKhetra(response.payload);
      } else {
        throw new Error(res.payload || "Failed to add khetra");
      }
    } catch (err) {
      message.error(err.message || "Error adding khetra");
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
  <Row gutter={16}>
    <Col span={12}>
      <Form.Item
        label={
          <span>
            Khetra{" "}
            <Button
              type="link"
              icon={<PlusOutlined />}
              style={{ padding: 0, fontSize: 16 }}
              onClick={() => setAddKhetraModalVisible(true)}
            >
              Add Khetra
            </Button>
          </span>
        }
        name="khetra"
        rules={[{ required: true, message: 'Please enter the khetra' }]}
      >
        <Select
          showSearch
          placeholder="Select a khetra"
          optionFilterProp="children"
        >
          {khetra.map((item) => (
            <Select.Option key={item.id} value={item.id}>
              {`${item.id} - ${item.khetra}`}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
    </Col>

    <Col span={12}>
      <Form.Item
        name="unit_id"
        label="Unit ID"
        rules={[{ required: true, message: 'Please enter unit ID' }]}
      >
        <Input disabled={isEditing} />
      </Form.Item>
    </Col>
  </Row>

  <Row gutter={16}>
    <Col span={12}>
      <Form.Item
        name="unit_name"
        label="Unit Name"
        rules={[{ required: true, message: 'Please enter unit name' }]}
      >
        <Input />
      </Form.Item>
    </Col>

    <Col span={12}>
      <Form.Item
        name="password"
        label="Password"
        rules={[{ required: !isEditing, message: 'Please enter password' }]}
      >
        <Input.Password />
      </Form.Item>
    </Col>
  </Row>

  <Row gutter={16}>
    <Col span={12}>
      <Form.Item
        name="location"
        label="Address"
        rules={[{ required: true, message: 'Please enter address' }]}
      >
        <Input />
      </Form.Item>
    </Col>

    <Col span={12}>
      <Form.Item name="email" label="Email (optional)">
        <Input />
      </Form.Item>
    </Col>
  </Row>

  <Row gutter={16}>
    <Col span={12}>
      <Form.Item name="phone" label="Phone (optional)">
        <Input />
      </Form.Item>
    </Col>
  </Row>

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


      {/* Add Khetra Modal */}
      <Modal
        title="Add Khetra"
        open={addKhetraModalVisible}
        onCancel={() => {
          setAddKhetraModalVisible(false);
          setNewKhetraName("");
        }}
        onOk={handleAddKhetra}
        okText="Add"
        destroyOnClose
      >
        <Input
          placeholder="Enter new khetra name"
          value={newKhetraName}
          onChange={e => setNewKhetraName(e.target.value)}
          onPressEnter={handleAddKhetra}
        />
      </Modal>
    </Modal>
  );
};

export default AddUnitModal;
