// src/UnitList.jsx
import React, { useEffect, useState } from 'react';
import {
  Table,
  Input,
  Row,
  Col,
  Button,
  Form,
  message,
  Spin,
} from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';

import AddUnitModal from '../components/Modals/AddUnitModal';
import { fetchAllUnits } from '../Redux/Slices/UnitSlice';

const UnitList = () => {
  const dispatch = useDispatch();
  const [searchText, setSearchText] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [editingUnit, setEditingUnit] = useState(null);

  const { units, loading, error } = useSelector((state) => state.units);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  useEffect(() => {
    dispatch(fetchAllUnits());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      message.error(`Failed to load events: ${error}`);
    }
  }, [error]);

  const filteredData = units?.filter(({ email, unit_name, unit_id, phone, location }) => {
    const search = searchText.toLowerCase();
    return (
      email?.toLowerCase().includes(search) ||
      unit_name?.toLowerCase().includes(search) ||
      unit_id?.toString().toLowerCase().includes(search) ||
      phone?.toString().toLowerCase().includes(search) ||
      location?.toLowerCase().includes(search)
    );
  });

  const columns = [
    {
      title: 'Sr. No.',
      key: 'srNo',
      render: (_, __, index) => (pagination.current - 1) * pagination.pageSize + index + 1,
      width: 80,
    },
    {
      title: 'Unit ID',
      dataIndex: 'unit_id',
      key: 'unit_id',
    },
    {
      title: 'Name',
      dataIndex: 'unit_name',
      key: 'name',
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: 200,
      render: (text) => text || '-',
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
      render: (text) => text || '-',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Button
          type="link"
          onClick={() => {
            setEditingUnit(record);
            setIsModalOpen(true);
          }}
        >
          Edit
        </Button>
      ),
    },
  ];

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingUnit(null);
    form.resetFields();
  };

  return (
    <div style={{ padding: 20, background: '#f4f7fa', minHeight: '100vh' }}>
      <h1 style={{ marginBottom: 30 }}>Unit List</h1>

      <Row justify="space-between" align="middle" gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={18} md={16} lg={12} xl={10}>
          <Input
            placeholder="Search by name or location"
            allowClear
            prefix={<SearchOutlined style={{ color: '#999' }} />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </Col>
        <Col>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setIsModalOpen(true);
              setEditingUnit(null);
            }}
            style={{
              fontSize: 16,
              padding: '10px 30px',
              background: '#3f87f5',
              borderColor: '#3f87f5',
              borderRadius: 8,
              boxShadow: '0 3px 10px rgba(63, 135, 245, 0.3)',
            }}
          >
            Add Unit
          </Button>
        </Col>
      </Row>

      <div
        style={{
          background: '#ffffff',
          padding: 16,
          borderRadius: 12,
          boxShadow: '0 8px 20px rgba(0, 0, 0, 0.05)',
        }}
      >
        <Spin spinning={loading} size="large" tip="Loading Units...">
          <Table
            dataSource={filteredData}
            columns={columns}
            pagination={{
              ...pagination,
              total: filteredData.length,
              showSizeChanger: false,
            }}
            onChange={(paginationInfo) => {
              setPagination({
                current: paginationInfo.current,
                pageSize: paginationInfo.pageSize,
              });
            }}
            bordered
            size="small"
            scroll={{ x: 'max-content' }}
            rowKey="id"
          />
        </Spin>
      </div>

      <AddUnitModal
        open={isModalOpen}
        onCancel={handleCancel}
        form={form}
        editingUnit={editingUnit}
      />
    </div>
  );
};

export default UnitList;
