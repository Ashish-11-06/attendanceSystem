import React, { useEffect, useState } from 'react';
import { Table, Input, Row, Col, Button, Spin, message } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import AddVolunteerModal from '../components/Modals/AddVolunteerModal';
import { fetchAllVolinteer } from '../Redux/Slices/VolinteerSlice';
import { useDispatch, useSelector } from 'react-redux';

const VolunteerList = () => {

  const dispatch = useDispatch();
  const { volinteers, loading, error } = useSelector((state) => state.volinteers);

  useEffect(() => {
    dispatch(fetchAllVolinteer());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      message.error(`Failed to load events: ${error}`);
    }
  }, [error]);
  const [searchText, setSearchText] = useState('');


  const [isModalVisible, setIsModalVisible] = useState(false);

  console.log(volinteers);

  const filteredData = volinteers.filter(({ name, email, volunteer_id, old_personal_number, new_personal_number, phone, gender }) => {
    const lowerSearch = searchText.toLowerCase();
    return (
      name.toLowerCase().includes(lowerSearch) ||
      volunteer_id.toLowerCase().includes(lowerSearch) ||
      old_personal_number.toLowerCase().includes(lowerSearch) ||
      new_personal_number.toLowerCase().includes(lowerSearch) ||
      phone?.toString().toLowerCase().includes(lowerSearch) ||
      gender.toString().toLowerCase().includes(lowerSearch) ||


      // phone.toLowerCase().includes(lowerSearch) ||
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
    { title: 'Volinteer ID', dataIndex: 'volunteer_id', key: 'volunteer_id', width: 150 },
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
      title: 'Old P. No.',
      dataIndex: 'old_personal_number',
      key: 'oldPersonalNumber',
      width: 150,
    },
    {
      title: 'New P. No.',
      dataIndex: 'new_personal_number',
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
            // background: '#ffffff',
            // padding: 16,
            borderRadius: 12,
            boxShadow: '0 8px 20px rgba(0, 0, 0, 0.05)',
            overflowX: 'auto',
          }}
        >
          <Spin spinning={loading} tip="Loading Volunteers...">
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
                size='small'
                pagination={{ pageSize: 5 }}
                bordered
                scroll={{ x: 900 }}
              />
            </div>
          </Spin>

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
