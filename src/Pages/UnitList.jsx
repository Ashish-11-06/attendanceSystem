import React, { useState } from 'react';
import { Table, Input, Row, Col, Button } from 'antd';

const { Search } = Input;

const UnitList = () => {
  const [searchText, setSearchText] = useState('');

  const dataSource = [
    { key: '1', name: 'Unit A', password: 'pass123', location: 'New York' },
    { key: '2', name: 'Unit B', password: 'abc456', location: 'Los Angeles' },
    { key: '3', name: 'Unit C', password: 'xyz789', location: 'Chicago' },
  ];

  const filteredData = dataSource.filter(({ name, location }) => {
    return (
      name.toLowerCase().includes(searchText.toLowerCase()) ||
      location.toLowerCase().includes(searchText.toLowerCase())
    );
  });

  const columns = [
    {
      title: 'Sr. No.',
      dataIndex: 'key',
      key: 'srNo',
      render: (text, record, index) => index + 1,
      width: 100,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: 150,
    },
    {
      title: 'Password',
      dataIndex: 'password',
      key: 'password',
      width: 150,
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
      width: 150,
    },
  ];

  const handleAddUnit = () => {
    alert('Add Unit button clicked!');
  };

  return (
    <div style={{ padding: 20, background: '#f4f7fa', minHeight: '100vh' }}>
      <h1 style={{ textAlign: 'center', marginBottom: 30 }}>Unit List</h1>

      {/* Add Unit Button */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
        <Button
          type="primary"
          size="large"
          style={{
            fontSize: 16,
            padding: '10px 30px',
            background: '#3f87f5',
            borderColor: '#3f87f5',
            borderRadius: 8,
            boxShadow: '0 3px 10px rgba(63, 135, 245, 0.3)',
          }}
          onClick={handleAddUnit}
        >
          Add Unit
        </Button>
      </div>

      {/* Search Input */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={20} md={16} lg={12} xl={10}>
          <Search
            placeholder="Search by name or location"
            allowClear
            enterButton="Search"
            size="large"
            onSearch={(value) => setSearchText(value)}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: '100%' }}
          />
        </Col>
      </Row>

      {/* Table Section */}
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
          scroll={{ x: 'max-content' }}
        />
      </div>
    </div>
  );
};

export default UnitList;
