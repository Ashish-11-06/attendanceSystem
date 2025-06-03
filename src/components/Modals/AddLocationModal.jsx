import React from 'react';
import { Modal, Form, Input, Select, Row, Col, Button } from 'antd';

const { Option } = Select;

const AddLocationModal = ({ visible, onCancel, onFinish, form, states, cities, onStateChange }) => {
  return (
    <Modal
      title="Add New Location"
      open={visible}
      onCancel={onCancel}
      footer={null}
      centered
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Address"
          name="address"
          rules={[{ required: true, message: 'Please enter the address' }]}
        >
          <Input placeholder="Enter address" />
        </Form.Item>

        <Form.Item name="state" label="State" rules={[{ required: true }]}>
          <Select
            showSearch
            placeholder="Select a state"
            optionFilterProp="children"
            onChange={onStateChange}
          >
            {states.map((state) => (
              <Option key={state.id} value={state.id}>
                {state.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="city" label="City" rules={[{ required: true }]}>
          <Select
            showSearch
            placeholder="Select a city"
            optionFilterProp="children"
          >
            {cities.map((city) => (
              <Option key={city.id} value={city.name}>
                {city.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item style={{ marginTop: 24 }}>
          <Row justify="center" gutter={16}>
            <Col>
              <Button onClick={onCancel}>Cancel</Button>
            </Col>
            <Col>
              <Button type="primary" htmlType="submit">
                Add Location
              </Button>
            </Col>
          </Row>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddLocationModal;
