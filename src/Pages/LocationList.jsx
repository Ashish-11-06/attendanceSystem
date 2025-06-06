import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Input, Row, Col, Button, Form, Spin, Alert, message } from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import AddLocationModal from '../components/Modals/AddLocationModal';
import { addLocation, fetchAllLocations } from '../Redux/Slices/locationSlice';
import statesData from '../data/states.json';
import citiesData from '../data/cities.json';

const LocationList = () => {
  const dispatch = useDispatch();
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const { locations, loading, error } = useSelector((state) => state.locations);

  const [selectedStateId, setSelectedStateId] = useState(null);
  const indianStates = statesData.filter(state => state.country_name === 'India');
  const filteredCities = citiesData.filter(city => city.state_id === selectedStateId);

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  useEffect(() => {
    dispatch(fetchAllLocations());
  }, [dispatch]);

  const filteredData = locations.filter(({ address, state, city }) => {
    const searchLower = searchText.toLowerCase();
    return (
      (address || '').toLowerCase().includes(searchLower) ||
      (state || '').toLowerCase().includes(searchLower) ||
      (city || '').toLowerCase().includes(searchLower)
    );
  });

  const columns = [
    {
      title: 'Sr. No.',
      key: 'srNo',
      render: (_, __, index) => (pagination.current - 1) * pagination.pageSize + index + 1,
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
    setSelectedStateId(null);
  };

  const handleAddLocation = async (values) => {
    const selectedState = indianStates.find(state => state.id === values.state);

    const payload = {
      address: values.address,
      state: selectedState ? selectedState.name : '',
      city: values.city,
    };

    try {
      await dispatch(addLocation(payload)).unwrap();
      form.resetFields();
      setSelectedStateId(null);
      setIsModalVisible(false);
      message.success("Location added successfully!");
      dispatch(fetchAllLocations());
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
            prefix={<SearchOutlined style={{ color: '#999' }} />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: '100%', borderRadius: 8 }}
          />
        </Col>
        <Col>
          <Button
            type="primary"
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
        // <Alert message="Error" description={error} type="error" showIcon style={{ marginBottom: 20 }} />
        message.error(error, 5)
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
        <Spin spinning={loading} tip="Loading Locations...">
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
            bordered
            size="small"
            rowKey="key"
            scroll={{ x: 'max-content' }}
          />
        </Spin>
      </div>

      <AddLocationModal
        visible={isModalVisible}
        onCancel={handleCancel}
        onFinish={handleAddLocation}
        form={form}
        states={indianStates}
        cities={filteredCities}
        onStateChange={setSelectedStateId}
      />
    </div>
  );
};

export default LocationList;
