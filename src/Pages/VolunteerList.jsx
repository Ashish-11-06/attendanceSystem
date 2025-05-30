import React, { useState } from 'react';
import { Table, Input, Row, Col, Button } from 'antd';

const { Search } = Input;

const VolunteerList = () => {
  const [searchText, setSearchText] = useState('');

  const dataSource = [
    { key: '1', name: 'Alice Johnson', gender: 'Female', phone: '123-456-7890' },
    { key: '2', name: 'Bob Smith', gender: 'Male', phone: '987-654-3210' },
    { key: '3', name: 'Charlie Brown', gender: 'Male', phone: '555-555-5555' },
  ];

  const filteredData = dataSource.filter(({ name, phone }) => {
    return (
      name.toLowerCase().includes(searchText.toLowerCase()) ||
      phone.toLowerCase().includes(searchText.toLowerCase())
    );
  });

  const columns = [
    { title: 'Sr. No.', dataIndex: 'key', key: 'srNo', render: (_, __, index) => index + 1, width: 100 },
    { title: 'Name', dataIndex: 'name', key: 'name', width: 200 },
    { title: 'Gender', dataIndex: 'gender', key: 'gender', width: 150 },
    { title: 'Phone Number', dataIndex: 'phone', key: 'phone', width: 200 },
  ];

  const handleAddVolunteer = () => {
    alert('Add Volunteer button clicked!');
  };

  return (
    <div style={{ padding: 20, background: '#f4f7fa', minHeight: '100vh' }}>
      <h1 style={{ textAlign: 'center', marginBottom: 30 }}>Volunteer List</h1>

      {/* Add Volunteer Button */}
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
          onClick={handleAddVolunteer}
        >
          Add Volunteer
        </Button>
      </div>

      {/* Search Input */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={20} md={16} lg={12} xl={10}>
          <Search
            placeholder="Search by name or phone number"
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

export default VolunteerList;
