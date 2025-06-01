import React, { useState } from 'react';
import {
  Table,
  Input,
  DatePicker,
  Button,
  Modal,
  Form,
  Select,
  TimePicker,
} from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Option } = Select;

const EventList = () => {
  const [searchText, setSearchText] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const [events, setEvents] = useState([
    {
      key: '1',
      eventName: 'Charity Run',
      location: 'Central Park',
      date: '2025-06-01 10:30 AM',
    },
    {
      key: '2',
      eventName: 'Food Drive',
      location: 'Community Center',
      date: '2025-06-05 02:00 PM',
    },
    {
      key: '3',
      eventName: 'Blood Donation Camp',
      location: 'City Hospital',
      date: '2025-06-10 09:15 AM',
    },
  ]);

  // Filter data for table based on search text and selected date
  const filteredData = events.filter(({ eventName, location, date }) => {
    const matchesText =
      eventName.toLowerCase().includes(searchText.toLowerCase()) ||
      location.toLowerCase().includes(searchText.toLowerCase());

    const matchesDate = selectedDate
      ? dayjs(date, 'YYYY-MM-DD hh:mm A').isSame(selectedDate, 'day')
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
      sorter: (a, b) =>
        dayjs(a.date, 'YYYY-MM-DD hh:mm A').toDate() -
        dayjs(b.date, 'YYYY-MM-DD hh:mm A').toDate(),
    },
  ];

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const onFinish = (values) => {
    // Format date and time with AM/PM included
    const dateStr = values.date.format('YYYY-MM-DD');
    const timeStr = values.time.format('hh:mm A'); // time includes AM/PM now
    const fullDateTime = `${dateStr} ${timeStr}`;

    const newEvent = {
      key: (events.length + 1).toString(),
      eventName: values.eventName,
      location: values.location,
      date: fullDateTime,
    };

    setEvents([...events, newEvent]);
    setIsModalVisible(false);
    form.resetFields();
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
          onClick={showModal}
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

      {/* Modal for adding event */}
      <Modal
        title="Add New Event"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        centered
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          name="add_event_form"
        >
          <Form.Item
            label="Event Name"
            name="eventName"
            rules={[{ required: true, message: 'Please enter event name' }]}
          >
            <Input placeholder="Enter event name" />
          </Form.Item>

          <Form.Item
            label="Location"
            name="location"
            rules={[{ required: true, message: 'Please select location' }]}
          >
            <Select
              showSearch
              placeholder="Select location"
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().includes(input.toLowerCase())
              }
            >
              <Option value="Pune">Pune</Option>
              <Option value="Mumbai">Mumbai</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Date"
            name="date"
            rules={[{ required: true, message: 'Please select date' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            label="Time"
            name="time"
            rules={[{ required: true, message: 'Please select time' }]}
          >
            <TimePicker
              format="hh:mm A"
              use12Hours={true}
              style={{ width: '100%' }}
              placeholder="Select time"
            />
          </Form.Item>

          <Form.Item>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: 16,
                marginTop: 24,
              }}
            >
              <Button onClick={handleCancel}>Cancel</Button>
              <Button type="primary" htmlType="submit">
                Add Event
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default EventList;
