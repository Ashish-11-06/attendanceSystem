import React, { useState } from 'react';
import { Table, Input, Row, Col, Button, Form } from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import AddLocationModal from '../components/Modals/AddLocationModal';


const LocationList = () => {
  const [searchText, setSearchText] = useState('');
  const [dataSource, setDataSource] = useState([
    { key: '1', address: '123 Main St', state: 'California', city: 'Los Angeles' },
    { key: '2', address: '456 Oak Ave', state: 'Texas', city: 'Austin' },
  ]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const states = ['California', 'Texas', 'New York', 'Florida', 'Illinois'];
  const cities = ['Los Angeles', 'Austin', 'New York City', 'Miami', 'Chicago'];

  const filteredData = dataSource.filter(({ address, state, city }) => {
    const searchLower = searchText.toLowerCase();
    return (
      address.toLowerCase().includes(searchLower) ||
      state.toLowerCase().includes(searchLower) ||
      city.toLowerCase().includes(searchLower)
    );
  });

  const columns = [
    {
      title: 'Sr. No.',
      dataIndex: 'key',
      key: 'srNo',
      render: (_, __, index) => index + 1,
      width: '8%',
    },
    { title: 'Address', dataIndex: 'address', key: 'address', width: '40%' },
    { title: 'State', dataIndex: 'state', key: 'state', width: '26%' },
    { title: 'City', dataIndex: 'city', key: 'city', width: '26%' },
  ];

  const showModal = () => setIsModalVisible(true);

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const onFinish = (values) => {
    const newLocation = {
      key: (dataSource.length + 1).toString(),
      address: values.address,
      state: values.state,
      city: values.city,
    };
    setDataSource([...dataSource, newLocation]);
    setIsModalVisible(false);
    form.resetFields();
  };

  return (
    <div style={{ padding: 30, background: '#f4f7fa', minHeight: '100vh' }}>
      <Row style={{ marginBottom: 16 }}>
        <Col>
          <h1 style={{ margin: 0 }}>Location List</h1>
        </Col>
      </Row>

      <Row justify="space-between" align="middle" gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={18} md={16} lg={12} xl={10}>
          <Input
            placeholder="Search by address, state or city"
            allowClear
            size="large"
            prefix={<SearchOutlined style={{ color: '#999' }} />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: '100%', borderRadius: 8 }}
          />
        </Col>
        <Col>
          <Button
            type="primary"
            size="large"
            icon={<PlusOutlined />}
            onClick={showModal}
            style={{
              fontSize: 16,
              padding: '10px 30px',
              background: '#3f87f5',
              borderColor: '#3f87f5',
              borderRadius: 8,
              boxShadow: '0 3px 10px rgba(63, 135, 245, 0.3)',
            }}
          >
            Add Location
          </Button>
        </Col>
      </Row>

      <div
        style={{
          background: '#ffffff',
          padding: 24,
          borderRadius: 12,
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.08)',
          overflowX: 'auto',
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

      {/* Use the separated modal component */}
      <AddLocationModal
        visible={isModalVisible}
        onCancel={handleCancel}
        onFinish={onFinish}
        form={form}
        states={states}
        cities={cities}
      />
    </div>
  );
};

export default LocationList;
