import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Input, Row, Col, Button, Form, Spin, Alert } from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import AddLocationModal from '../components/Modals/AddLocationModal';
import { addLocation, fetchAllLocations } from '../Redux/Slices/locationSlice';

const LocationList = () => {
  const dispatch = useDispatch();
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const { locations, loading, error } = useSelector((state) => state.locations);

  // States and Cities arrays moved here outside handler
  const states = ['California', 'Texas', 'New York', 'Florida', 'Illinois'];
  const cities = ['Los Angeles', 'Austin', 'New York City', 'Miami', 'Chicago'];

  useEffect(() => {
    dispatch(fetchAllLocations());
  }, [dispatch]);

const filteredData = locations.filter(({ address, state, city }) => {
  const searchLower = searchText.toLowerCase();

  const addressStr = address ? address.toLowerCase() : '';
  const stateStr = state ? state.toLowerCase() : '';
  const cityStr = city ? city.toLowerCase() : '';

  return (
    addressStr.includes(searchLower) ||
    stateStr.includes(searchLower) ||
    cityStr.includes(searchLower)
  );
});


  const columns = [
    {
      title: 'Sr. No.',
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

  const handleAddLocation = async (values) => {
    const payload = {
      address: values.address,
      state: values.state,
      city: values.city,
    };



    try {
      await dispatch(addLocation(payload)).unwrap(); 
      form.resetFields(); 
      setIsModalVisible(false); 
    } catch (err) {
      console.error('Failed to add location:', err);
    }
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
            // size="large"
            prefix={<SearchOutlined style={{ color: '#999' }} />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: '100%', borderRadius: 8 }}
          />
        </Col>
        <Col>
          <Button
            type="primary"
            // size="large"
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

      {error && (
        <Alert message="Error" description={error} type="error" showIcon style={{ marginBottom: 20 }} />
      )}

      <div
        style={{
          background: '#ffffff',
          padding: 24,
          borderRadius: 12,
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.08)',
          overflowX: 'auto',
        }}
      >
        <Spin spinning={loading}>
          <Table
            dataSource={filteredData}
            columns={columns}
            pagination={{ pageSize: 10 }}
            bordered
            size="small"
            rowKey="id"
            scroll={{ x: 'max-content' }}
          />
        </Spin>
      </div>

      <AddLocationModal
        visible={isModalVisible}
        onCancel={handleCancel}
         onFinish={async (values) => {
              await handleAddLocation(values); 
                dispatch(fetchAllLocations());   
              }}
        form={form}
        states={states}
        cities={cities}
      />
    </div>
  );
};

export default LocationList;
