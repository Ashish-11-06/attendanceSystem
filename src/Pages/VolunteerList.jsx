import React, { useEffect, useState } from 'react';
import { Table, Input, Row, Col, Button, Spin, message } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import AddVolunteerModal from '../components/Modals/AddVolunteerModal';
import { fetchAllVolinteer, addVolinteer, updateVolinteer } from '../Redux/Slices/VolinteerSlice';
import { useDispatch, useSelector } from 'react-redux';

const VolunteerList = () => {
  const dispatch = useDispatch();
  const { volinteers, loading, error } = useSelector((state) => state.volinteers);

  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [editingVolunteer, setEditingVolunteer] = useState(null);

  useEffect(() => {
    dispatch(fetchAllVolinteer());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      message.error(`Failed to load volunteers: ${error}`);
    }
  }, [error]);

  const filteredData = volinteers.filter(({ name, email, volunteer_id, old_personal_number, new_personal_number, phone, gender }) => {
    const lowerSearch = searchText.toLowerCase();
    return (
      name.toLowerCase().includes(lowerSearch) ||
      volunteer_id.toLowerCase().includes(lowerSearch) ||
      old_personal_number.toLowerCase().includes(lowerSearch) ||
      new_personal_number.toLowerCase().includes(lowerSearch) ||
      (phone ? phone.toString().toLowerCase().includes(lowerSearch) : false) ||
      (gender ? gender.toString().toLowerCase().includes(lowerSearch) : false) ||
      (email && email.toLowerCase().includes(lowerSearch))
    );
  });

  const columns = [
    {
      title: 'Sr. No.',
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
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Button type="link" onClick={() => handleEdit(record)}>
          Edit
        </Button>
      ),
    },
  ];

  const handleAddClick = () => {
    setEditingVolunteer(null);
    setIsModalVisible(true);
  };

  const handleEdit = (volunteer) => {
    setEditingVolunteer(volunteer);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingVolunteer(null);
  };

  const handleAddOrUpdate = async (values, volunteerKey) => {
    try {
      if (volunteerKey) {
        // Update existing volunteer
        await dispatch(updateVolinteer({ id: volunteerKey, data: values }));
        message.success('Volunteer updated successfully!');
      } else {
        // Add new volunteer
        await dispatch(addVolinteer(values));
        message.success('Volunteer added successfully!');
      }
      setIsModalVisible(false);
      setEditingVolunteer(null);
      dispatch(fetchAllVolinteer());
    } catch (err) {
      message.error('Error occurred while saving volunteer.');
    }
  };

  return (
    <div style={{ padding: 20, background: '#f4f7fa', minHeight: '100vh', boxSizing: 'border-box' }}>
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
            onClick={handleAddClick}
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
        <div style={{ background: '#fff', padding: 12, borderRadius: 12, overflowX: 'auto' }}>
          <Table
            dataSource={filteredData}
            columns={columns}
            pagination={{
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: filteredData.length,
              showSizeChanger: false,
            }}
            onChange={(page) => setPagination(page)}
            rowKey="key"
            bordered
            scroll={{ x: 'max-content' }}
            size="middle"
          />
        </div>
      </Spin>

      <AddVolunteerModal
        visible={isModalVisible}
        onCancel={handleCancel}
        onFinish={handleAddOrUpdate}
        volunteer={editingVolunteer}
      />
    </div>
  );
};

export default VolunteerList;
