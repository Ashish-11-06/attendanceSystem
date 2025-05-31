import React, { useState } from 'react';
import { Table, Input, DatePicker, Row, Col, Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const EventList = () => {
  const [searchText, setSearchText] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);

  const dataSource = [
    {
      key: '1',
      eventName: 'Charity Run',
      location: 'Central Park',
      date: '2025-06-01 10:30',
    },
    {
      key: '2',
      eventName: 'Food Drive',
      location: 'Community Center',
      date: '2025-06-05 14:00',
    },
    {
      key: '3',
      eventName: 'Blood Donation Camp',
      location: 'City Hospital',
      date: '2025-06-10 09:15',
    },
  ];

  const filteredData = dataSource.filter(({ eventName, location, date }) => {
    const matchesText =
      eventName.toLowerCase().includes(searchText.toLowerCase()) ||
      location.toLowerCase().includes(searchText.toLowerCase());

    const matchesDate = selectedDate
      ? dayjs(date).isSame(selectedDate, 'day')
      : true;

    return matchesText && matchesDate;
  });

  const columns = [
    {
      title: 'Sr. No.',
      dataIndex: 'key',
      key: 'srNo',
      render: (text, record, index) => index + 1,
      width: 80,
    },
    {
      title: 'Event Name',
      dataIndex: 'eventName',
      key: 'eventName',
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: 'Date & Time',
      dataIndex: 'date',
      key: 'date',
      sorter: (a, b) => new Date(a.date) - new Date(b.date),
      render: (date) => dayjs(date).format('YYYY-MM-DD hh:mm A'),
    },
  ];

  const handleAddEvent = () => {
    alert('Add Event button clicked!');
  };

  return (
    <div style={{ padding: 16, background: '#f4f7fa', minHeight: '100vh' }}>
      <h1 style={{ marginBottom: 24 }}>Event List</h1>

      {/* Search and button row */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          gap: 16,
          marginBottom: 24,
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
          <Input
            placeholder="Search by event name or location"
            allowClear
            size="large"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            prefix={<SearchOutlined style={{ color: '#999' }} />}
            style={{ width: 250 }}
          />
          <DatePicker
            placeholder="Filter by date"
            onChange={(date) => setSelectedDate(date)}
            allowClear
            size="large"
            style={{ width: 180 }}
          />
        </div>

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
          onClick={handleAddEvent}
        >
          Add Event
        </Button>
      </div>

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
          size="small"   
          scroll={{ x: 'max-content' }}
        />
      </div>
    </div>
  );
};

export default EventList;
