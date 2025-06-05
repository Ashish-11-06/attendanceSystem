// src/Pages/EventList.jsx
import React, { useEffect, useState } from 'react';
import {
  Table,
  Input,
  DatePicker,
  Button,
  Spin,
  message,
  Form,
  Divider,
} from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllEvents } from '../Redux/Slices/EventSlice';
import AddEventModal from '../components/Modals/AddEventModal';

const EventList = () => {
  const dispatch = useDispatch();
  const { events, loading, error } = useSelector((state) => state.events);

  const [searchText, setSearchText] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await dispatch(fetchAllEvents()).unwrap();
        console.log('res', res);
      } catch (err) {
        console.error('Failed to fetch events:', err);
        // message.error('Failed to load events. Please try again later.');
      }
    }
    fetchEvents();
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      message.error(`Failed to load events: ${error}`);
    }
  }, [error]);

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  const filteredData = (Array.isArray(events) ? events : []).filter(({ event_name, location, start_date, end_date }) => {
    const matchesText =
      event_name.toLowerCase().includes(searchText.toLowerCase()) ||
      location.some(
        (loc) =>
          loc.city?.toLowerCase().includes(searchText.toLowerCase()) ||
          loc.address?.toLowerCase().includes(searchText.toLowerCase()) ||
          loc.state?.toLowerCase().includes(searchText.toLowerCase())
      );

    const matchesDate = selectedDate
      ? dayjs(start_date, 'YYYY-MM-DD').isSame(selectedDate, 'day') ||
        (end_date && dayjs(end_date, 'YYYY-MM-DD').isSame(selectedDate, 'day'))
      : true;

    return matchesText && matchesDate;
  });

  const columns = [
    {
      title: 'Sr. No.',
      key: 'srNo',
      render: (_, __, index) => (pagination.current - 1) * pagination.pageSize + index + 1,
      width: 80,
    },
    {
      title: 'Event Name',
      dataIndex: 'event_name',
      key: 'eventName',
    },
{
  title: 'Location',
  dataIndex: 'locations',
  key: 'location',
  render: (locations) => {
    if (!Array.isArray(locations) || locations.length === 0) return 'N/A';

    return (
      <div>
        {locations.map((loc, index) => (
          <div key={index} style={{ marginBottom: '8px' }}>
            <div>
              <strong>{loc.location_address}, {loc.location_city}</strong>
            </div>
            {Array.isArray(loc.units) && loc.units.length > 0 ? (
              <ul style={{ marginLeft: 16 }}>
                {loc.units.map((unit, idx) => (
                  <li key={idx}>{unit.unit_name}</li>
                ))}
              </ul>
            ) : (
              <div style={{ marginLeft: 16 }}>No units available</div>
            )}
            {index !== locations.length - 1 && <Divider style={{ margin: '8px 0' }} />}
          </div>
        ))}
      </div>
    );
  },
},

    {
      title: 'Start Date',
      dataIndex: 'start_date',
      key: 'start_date',
      render: (text) => (text ? dayjs(text).format('DD-MM-YYYY') : '-'),
      sorter: (a, b) => new Date(a.start_date) - new Date(b.start_date),
    },
    {
      title: 'End Date',
      dataIndex: 'end_date',
      key: 'end_date',
      render: (text) => (text ? dayjs(text).format('DD-MM-YYYY') : '-'),
      sorter: (a, b) => new Date(a.end_date || 0) - new Date(b.end_date || 0),
    },
    {
      title: 'Time',
      dataIndex: 'time',
      key: 'time',
      render: (text) => dayjs(text, 'HH:mm:ss').format('hh:mm A'),
      sorter: (a, b) => {
        const getTimeInSeconds = (timeStr) => {
          const [h, m, s] = timeStr.split(':').map(Number);
          return h * 3600 + m * 60 + s;
        };
        return getTimeInSeconds(a.time) - getTimeInSeconds(b.time);
      },
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Button
          type="link"
          onClick={() => {
            setEditingEvent(record);
            setIsModalVisible(true);
          }}
        >
          Edit
        </Button>
      ),
    },
  ];

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingEvent(null);
    form.resetFields();
  };

  return (
    <div style={{ padding: 16, background: '#f4f7fa', minHeight: '100vh' }}>
      <h1 style={{ marginBottom: 24 }}>Event List</h1>

     <div
  style={{
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginBottom: 24,
    gap: 12,
  }}
>
  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
    <Input
      placeholder="Search by event name or location"
      allowClear
      value={searchText}
      onChange={(e) => setSearchText(e.target.value)}
      prefix={<SearchOutlined style={{ color: '#999' }} />}
      style={{ width: 250 }}
    />
    <DatePicker
      placeholder="Filter by date"
      onChange={(date) => setSelectedDate(date)}
      allowClear
      style={{ width: 180 }}
    />
  </div>

  <Button
    type="primary"
    icon={<PlusOutlined />}
    style={{
      fontSize: 16,
      padding: '10px 30px',
      background: '#3f87f5',
      borderColor: '#3f87f5',
      borderRadius: 8,
      boxShadow: '0 3px 10px rgba(63, 135, 245, 0.3)',
    }}
    onClick={() => {
      setEditingEvent(null);
      setIsModalVisible(true);
    }}
  >
    Add Event
  </Button>
</div>


      <div
        style={{
          background: '#fff',
          padding: 16,
          borderRadius: 12,
          boxShadow: '0 8px 20px rgba(0, 0, 0, 0.05)',
        }}
      >
        <Spin spinning={loading} size="large" tip="Loading Events...">
          <Table
            dataSource={filteredData}
            columns={columns}
            pagination={{
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: filteredData.length,
              showSizeChanger: false,
            }}
            onChange={(paginationInfo) => {
              setPagination({
                ...pagination,
                current: paginationInfo.current,
              });
            }}
            bordered
            size="small"
            scroll={{ x: 'max-content' }}
            rowKey={(record) => record.id}
          />
        </Spin>
      </div>

      <AddEventModal
        visible={isModalVisible}
        onCancel={handleCancel}
        form={form}
        editingEvent={editingEvent}
      />
    </div>
  );
};

export default EventList;
