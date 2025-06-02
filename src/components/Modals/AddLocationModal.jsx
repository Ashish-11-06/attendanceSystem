import React from 'react';
import { Modal, Form, Input, Select, Row, Col, Button } from 'antd';

const { Option } = Select;


const AddLocationModal = ({ visible, onCancel, onFinish, form, states, cities }) => {
  return (
    <Modal
      title="Add New Location"
      open ={visible}
      onCancel={onCancel}
      footer={null}
      // destroyOnClose
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

        <Form.Item
          label="State"
          name="state"
          rules={[{ required: true, message: 'Please select the state' }]}
        >
          <Select
            placeholder="Select state"
            showSearch
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.children.toLowerCase().includes(input.toLowerCase())
            }
            allowClear
          >
            {states.map((state) => (
              <Option key={state} value={state}>
                {state}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="City"
          name="city"
          rules={[{ required: true, message: 'Please select the city' }]}
        >
          <Select
            placeholder="Select city"
            showSearch
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.children.toLowerCase().includes(input.toLowerCase())
            }
            allowClear
          >
            {cities.map((city) => (
              <Option key={city} value={city}>
                {city}
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
              <Button type="primary" htmlType="submit" >
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
