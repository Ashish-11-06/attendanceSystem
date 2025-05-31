import React, { useState } from 'react';
import { Table, Input, Row, Col, Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const LocationList = () => {
  const [searchText, setSearchText] = useState('');

  const dataSource = [
    { key: '1', address: '123 Main St', state: 'California', city: 'Los Angeles' },
    { key: '2', address: '456 Oak Ave', state: 'Texas', city: 'Austin' },
    { key: '3', address: '789 Pine Rd', state: 'New York', city: 'Albany' },
  ];

  const filteredData = dataSource.filter(({ address, state, city }) => {
    const searchLower = searchText.toLowerCase();
    return (
      address.toLowerCase().includes(searchLower) ||
      state.toLowerCase().includes(searchLower) ||
      city.toLowerCase().includes(searchLower)
    );
  });

  const columns = [
    { title: 'Sr. No.', dataIndex: 'key', key: 'srNo', render: (_, __, index) => index + 1, width: '8%' },
    { title: 'Address', dataIndex: 'address', key: 'address', width: '40%' },
    { title: 'State', dataIndex: 'state', key: 'state', width: '26%' },
    { title: 'City', dataIndex: 'city', key: 'city', width: '26%' },
  ];

  const handleAddLocation = () => {
    alert('Add Location button clicked!');
  };

  return (
    <div style={{ padding: 30, background: '#f4f7fa', minHeight: '100vh' }}>
      <h1 style={{ justifyContent: 'flex-start', marginBottom: 30 }}>Location List</h1>

      {/* Search and Add Location button in the same row */}
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }} gutter={[16, 16]}>
        <Col xs={24} sm={18} md={16} lg={12} xl={10}>
          <Input
            placeholder="Search by address, state or city"
            allowClear
            size="large"
            prefix={<SearchOutlined style={{ color: '#999' }} />}
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            style={{ borderRadius: 8, width: '100%' }}
          />
        </Col>

        <Col>
          <Button
            type="primary"
            size="large"
            style={{
              fontSize: 18,
              padding: '12px 35px',
              background: '#3f87f5',
              borderColor: '#3f87f5',
              borderRadius: 8,
              boxShadow: '0 3px 10px rgba(63, 135, 245, 0.3)',
            }}
            onClick={handleAddLocation}
          >
            Add Location
          </Button>
        </Col>
      </Row>

      {/* Table Display */}
      <div
        style={{
          background: '#ffffff',
          padding: 24,
          borderRadius: 12,
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.08)',
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
    </div>
  );
};

export default LocationList;
