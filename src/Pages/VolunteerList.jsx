import React, { useEffect, useState } from 'react';
import { Table, Input, Row, Col, Button, Spin, message } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import AddVolunteerModal from '../components/Modals/AddVolunteerModal';
import { fetchAllVolinteer } from '../Redux/Slices/VolinteerSlice';
import { useDispatch, useSelector } from 'react-redux';

const VolunteerList = () => {
  const dispatch = useDispatch();
  const { volinteers, loading, error } = useSelector((state) => state.volinteers);

  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [localVolunteers, setLocalVolunteers] = useState([]);

  useEffect(() => {
    dispatch(fetchAllVolinteer());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      message.error(`Failed to load volunteers: ${error}`);
    }
  }, [error]);

  useEffect(() => {
    setLocalVolunteers(volinteers);
  }, [volinteers]);

  const filteredData = localVolunteers.filter(({ name, email, volunteer_id, old_personal_number, new_personal_number, phone, gender }) => {
    const lowerSearch = searchText.toLowerCase();
    return (
      name.toLowerCase().includes(lowerSearch) ||
      volunteer_id.toLowerCase().includes(lowerSearch) ||
      old_personal_number.toLowerCase().includes(lowerSearch) ||
      new_personal_number.toLowerCase().includes(lowerSearch) ||
      phone?.toString().toLowerCase().includes(lowerSearch) ||
      gender.toString().toLowerCase().includes(lowerSearch) ||
      (email && email.toLowerCase().includes(lowerSearch))
    );
  });

  const columns = [
    {
      title: 'Sr. No.',
      dataIndex: 'key',
      key: 'srNo',
      render: (_, __, index) => (pagination.current - 1) * pagination.pageSize + index + 1,
    },
    { title: 'Volunteer ID', dataIndex: 'volunteer_id', key: 'volunteer_id' },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Gender', dataIndex: 'gender', key: 'gender' },
    {
      title: 'Phone Number',
      dataIndex: 'phone',
      key: 'phone',
      render: (text) => text || '-',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (text) => text || '-',
    },
    {
      title: 'Old P. No.',
      dataIndex: 'old_personal_number',
      key: 'oldPersonalNumber',
    },
    {
      title: 'New P. No.',
      dataIndex: 'new_personal_number',
      key: 'newPersonalNumber',
    },
  ];

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleAddVolunteer = (values) => {
    const newVolunteerId = `V${localVolunteers.length + 1}`;
    const newVolunteer = {
      key: (localVolunteers.length + 1).toString(),
      volunteer_id: newVolunteerId,
      ...values,
    };
    setLocalVolunteers([...localVolunteers, newVolunteer]);
    setIsModalVisible(false);
    message.success('Volunteer added successfully!');
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
      <h1 style={{ marginBottom: 20 }}>Volunteer List</h1>

      <Row gutter={[16, 16]} justify="space-between" style={{ marginBottom: 16 }}>
        <Col xs={24} sm={18}>
          <Input
            placeholder="Search by name, phone, or email"
            allowClear
            prefix={<SearchOutlined style={{ color: '#999' }} />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: '55%' }}
          />
        </Col>
        <Col xs={24} sm={6}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={showModal}
            block
            style={{
              fontSize: 16,
              padding: '10px 30px',
              background: '#3f87f5',
              borderColor: '#3f87f5',
              borderRadius: 6,
              boxShadow: '0 3px 10px rgba(63, 135, 245, 0.3)',
              width: '50%',
            }}
          >
            Add Volunteer
          </Button>
        </Col>
      </Row>

      <Spin spinning={loading} tip="Loading Volunteers...">
        <div
          style={{
            background: '#fff',
            padding: 12,
            borderRadius: 12,
            overflowX: 'auto',
          }}
        >
          <Table
            dataSource={filteredData}
            columns={columns}
            pagination={{
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: filteredData.length,
              showSizeChanger: false,
            }}
            onChange={(pagination) => setPagination(pagination)}
            rowKey="key"
            bordered
            scroll={{ x: 'max-content' }}
            size="middle"
          />
        </div>
      </Spin>

      <AddVolunteerModal visible={isModalVisible} onCancel={handleCancel} onAdd={handleAddVolunteer} />
    </div>
  );
};

export default VolunteerList;
