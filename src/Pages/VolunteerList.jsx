import React, { useState } from 'react';
import { Table, Input, Row, Col, Button, Modal, Form, Select } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';

const { Option } = Select;

const VolunteerList = () => {
  const [searchText, setSearchText] = useState('');
  const [dataSource, setDataSource] = useState([
    {
      key: '1',
      name: 'Alice Johnson',
      gender: 'Female',
      phone: '123-456-7890',
      email: 'alice@example.com',
      oldPersonalNumber: 'ABC123',
      newPersonalNumber: 'XYZ789',
    },
    {
      key: '2',
      name: 'Bob Smith',
      gender: 'Male',
      phone: '987-654-3210',
      email: '-',
      oldPersonalNumber: 'DEF456',
      newPersonalNumber: 'LMN456',
    },
    {
      key: '3',
      name: 'Charlie Brown',
      gender: 'Male',
      phone: '555-555-5555',
      email: 'charlie.brown@example.com',
      oldPersonalNumber: 'GHI789',
      newPersonalNumber: 'OPQ123',
    },
  ]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const filteredData = dataSource.filter(({ name, phone, email }) => {
    const lowerSearch = searchText.toLowerCase();
    return (
      name.toLowerCase().includes(lowerSearch) ||
      phone.toLowerCase().includes(lowerSearch) ||
      (email && email.toLowerCase().includes(lowerSearch))
    );
  });

  const columns = [
    {
      title: 'Sr. No.',
      dataIndex: 'key',
      key: 'srNo',
      render: (_, __, index) => index + 1,
      width: 70,
      fixed: 'left',
    },
    { title: 'Name', dataIndex: 'name', key: 'name', width: 150 },
    { title: 'Gender', dataIndex: 'gender', key: 'gender', width: 100 },
    { title: 'Phone Number', dataIndex: 'phone', key: 'phone', width: 130, render: (text) => text || '-' },
    { title: 'Email', dataIndex: 'email', key: 'email', width: 200, render: (text) => text || '-' },
    { title: 'Old Personal Number', dataIndex: 'oldPersonalNumber', key: 'oldPersonalNumber', width: 150 },
    { title: 'New Personal Number', dataIndex: 'newPersonalNumber', key: 'newPersonalNumber', width: 150 },
  ];

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleAddVolunteer = (values) => {
    const newVolunteer = {
      key: (dataSource.length + 1).toString(),
      ...values,
    };
    setDataSource([...dataSource, newVolunteer]);
    setIsModalVisible(false);
    form.resetFields();
  };

  return (
    <div
      style={{
        padding: 20,
        background: '#f4f7fa',
        minHeight: '100vh',
        boxSizing: 'border-box',
      }}
    >
      <h1 style={{ marginBottom: 30, justifyContent: 'flex-start' }}>Volunteer List</h1>

      <Row
        justify="space-between"
        align="middle"
        gutter={[16, 16]}
        style={{ marginBottom: 24, flexWrap: 'wrap' }}
      >
        <Col xs={24} sm={16} md={14} lg={12} xl={10}>
          <Input
            placeholder="Search by name, phone, or email"
            allowClear
            size="large"
            prefix={<SearchOutlined style={{ color: '#999' }} />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: '100%' }}
          />
        </Col>
        <Col xs={24} sm={8} md={6} lg={4} xl={3}>
          <Button
            type="primary"
            size="large"
            icon={<PlusOutlined />}
            style={{
              fontSize: 16,
              padding: '10px 20px',
              background: '#3f87f5',
              borderColor: '#3f87f5',
              borderRadius: 8,
              boxShadow: '0 3px 10px rgba(63, 135, 245, 0.3)',
              width: '100%',
            }}
            onClick={showModal}
          >
            Add Volunteer
          </Button>
        </Col>
      </Row>

      <div
        style={{
          background: '#ffffff',
          padding: 16,
          borderRadius: 12,
          boxShadow: '0 8px 20px rgba(0, 0, 0, 0.05)',
          overflowX: 'auto',
        }}
      >
        <Table
          dataSource={filteredData}
          columns={columns}
          pagination={{ pageSize: 10 }}
          bordered
          size="small"
          scroll={{ x: 1000 }}
        />
      </div>

      {/* Modal for Adding Volunteer */}
      <Modal
        title="Add New Volunteer"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        destroyOnClose
        centered
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAddVolunteer}
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
            <Row justify="center" gutter={16} wrap>
              <Col xs={12} sm={8}>
                <Button block onClick={handleCancel}>
                  Cancel
                </Button>
              </Col>
              <Col xs={12} sm={8}>
                <Button type="primary" htmlType="submit" block>
                  Add Volunteer
                </Button>
              </Col>
            </Row>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default VolunteerList;
