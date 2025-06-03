import React, { useState } from 'react';
import { Table, Input, Row, Col, Button } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import AddVolunteerModal from '../components/Modals/AddVolunteerModal';

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
      fixed: 'left',
      width: 70,
    },
    { title: 'Name', dataIndex: 'name', key: 'name', width: 150 },
    { title: 'Gender', dataIndex: 'gender', key: 'gender', width: 100 },
    {
      title: 'Phone Number',
      dataIndex: 'phone',
      key: 'phone',
      render: (text) => text || '-',
      width: 130,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (text) => text || '-',
      width: 200,
    },
    {
      title: 'Old Personal Number',
      dataIndex: 'oldPersonalNumber',
      key: 'oldPersonalNumber',
      width: 150,
    },
    {
      title: 'New Personal Number',
      dataIndex: 'newPersonalNumber',
      key: 'newPersonalNumber',
      width: 150,
    },
  ];

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleAddVolunteer = (values) => {
    const newVolunteer = {
      key: (dataSource.length + 1).toString(),
      ...values,
    };
    setDataSource([...dataSource, newVolunteer]);
    setIsModalVisible(false);
  };

  return (
    <>
      <style>
        {`
          .addVolunteerBtn {
            font-size: 14px;
            padding: 6px 16px;
            background: #3f87f5;
            border-color: #3f87f5;
            border-radius: 6px;
            box-shadow: 0 3px 10px rgba(63, 135, 245, 0.3);
          }

          @media (max-width: 576px) {
            .addVolunteerBtn {
              margin-left: 0 !important;
              width: auto !important;
              display: inline-block;
            }
          }
        `}
      </style>

      <div
        style={{
          padding: 20,
          background: '#f4f7fa',
          minHeight: '100vh',
          boxSizing: 'border-box',
        }}
      >
        <h1 style={{ marginBottom: 30, textAlign: 'left' }}>Volunteer List</h1>

        <Row
          justify="space-between"
          align="middle"
          gutter={[16, 16]}
          style={{ marginBottom: 24 }}
        >
          <Col xs={24} sm={18} md={16} lg={12} xl={10}>
            <Input
              placeholder="Search by name, phone, or email"
              allowClear
              // size="large"
              prefix={<SearchOutlined style={{ color: '#999' }} />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: '100%' }}
            />
          </Col>
          <Col xs={12} sm={6} md={6} lg={4} xl={3}>
            <Button
              type="primary"
              // size="large"
              icon={<PlusOutlined />}
              className="addVolunteerBtn"
              onClick={showModal}
              block={false}
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
            pagination={{ pageSize: 5 }}
            bordered
            scroll={{ x: 900 }}
          />
        </div>

        {/* New modal component here */}
        <AddVolunteerModal
          visible={isModalVisible}
          onCancel={handleCancel}
          onAdd={handleAddVolunteer}
        />
      </div>
    </>
  );
};

export default VolunteerList;
