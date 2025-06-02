import React, { useState } from 'react';
import { Table, Input, Row, Col, Button, Modal, Form, Select, message } from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';

const { Option } = Select;

const UnitList = () => {
  const [searchText, setSearchText] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const [units, setUnits] = useState([
    { key: '1', name: 'Unit A', password: 'pass123', location: 'Pune', email: 'unitA@example.com', phone: '1234567890' },
    { key: '2', name: 'Unit B', password: 'abc456', location: 'Mumbai', email: 'unitB@example.com', phone: '9876543210' },
    { key: '3', name: 'Unit C', password: 'xyz789', location: 'Pune', email: '-', phone: '-' },
  ]);

  const filteredData = units.filter(({ name, location }) =>
    name.toLowerCase().includes(searchText.toLowerCase()) ||
    location.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: 'Sr. No.',
      key: 'srNo',
      render: (_, __, index) => index + 1,
      width: 80,
    },
    { title: 'Name', dataIndex: 'name', key: 'name', width: 150 },
    { title: 'Password', dataIndex: 'password', key: 'password', width: 150 },
    { title: 'Location', dataIndex: 'location', key: 'location', width: 150 },
    { title: 'Email', dataIndex: 'email', key: 'email', width: 200 },
    { title: 'Phone', dataIndex: 'phone', key: 'phone', width: 150 },
  ];

  const onFinish = (values) => {
    const newUnit = {
      key: (units.length + 1).toString(),
      name: values.name,
      password: values.password,
      location: values.location,
      email: values.email || '-',
      phone: values.phone || '-',
    };

    setUnits([...units, newUnit]);
    form.resetFields();
    setIsModalOpen(false);

    setTimeout(() => {
      message.success('Unit added successfully!');
    }, 200);
  };

  return (
    <div style={{ padding: 20, background: '#f4f7fa', minHeight: '100vh' }}>
      <h1 style={{ marginBottom: 30 }}>Unit List</h1>

      <Row justify="space-between" align="middle" gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={18} md={16} lg={12} xl={10}>
          <Input
            placeholder="Search by name or location"
            allowClear
            size="large"
            prefix={<SearchOutlined style={{ color: '#999' }} />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: '100%' }}
          />
        </Col>
        <Col>
          <Button
            type="primary"
            size="large"
            icon={<PlusOutlined />}
            onClick={() => setIsModalOpen(true)}
            style={{
              fontSize: 16,
              padding: '10px 30px',
              background: '#3f87f5',
              borderColor: '#3f87f5',
              borderRadius: 8,
              boxShadow: '0 3px 10px rgba(63, 135, 245, 0.3)',
            }}
          >
            Add Unit
          </Button>
        </Col>
      </Row>

      <div
        style={{
          background: '#ffffff',
          padding: 16,
          borderRadius: 12,
          boxShadow: '0 8px 20px rgba(0, 0, 0, 0.05)',
        }}
      >
        <Table
          dataSource={filteredData}
          columns={columns}
          pagination={{ pageSize: 10 }}
          bordered
          size="small"
          scroll={{ x: 'max-content' }}
        />
      </div>

      <Modal
        title="Add New Unit"
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
        }}
        footer={null}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
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
        setIsModalOpen(false);
        form.resetFields();
      }}
    >
      Cancel
    </Button>
    <Button
      type="primary"
      htmlType="submit"
    >
      Add Unit
    </Button>
  </div>
</Form.Item>

        </Form>
      </Modal>
    </div>
  );
};

export default UnitList;
