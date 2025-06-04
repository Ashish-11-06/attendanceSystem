import React, { useState, useEffect } from 'react';
import { Table, Tag, Button, Select, Spin, message } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllEvents } from '../Redux/Slices/EventSlice';
import { fetchAllUnits } from '../Redux/Slices/UnitSlice'; // Import unit fetch thunk

const Attendance_list = () => {
  const dispatch = useDispatch();

  // Get events and units from Redux
  const { events, loading: eventsLoading, error: eventsError } = useSelector((state) => state.events);
  const { units, loading: unitsLoading, error: unitsError } = useSelector((state) => state.units);

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedUnit, setSelectedUnit] = useState(null);

  
    const [pagination, setPagination] = useState({
      current: 1,
      pageSize: 10,
    });
  

  // Sample attendance data - replace this with real API data if available
  const dataSource = [
    {
      key: '1',
      atdId: 'ATD001',
      volunteerId: 'V001',
      eventId: 'E001',
      unitId: 'U001',
      date: '2025-06-02',
      inTime: '09:00 AM',
      outTime: '05:00 PM',
      present: true,
      remark: 'On time',
    },
    {
      key: '2',
      atdId: 'ATD002',
      volunteerId: 'V002',
      eventId: 'E002',
      unitId: 'U002',
      date: '2025-06-02',
      inTime: '10:00 AM',
      outTime: '04:00 PM',
      present: false,
      remark: 'Sick leave',
    },
    {
      key: '3',
      atdId: 'ATD003',
      volunteerId: 'V003',
      eventId: 'E001',
      unitId: 'U002',
      date: '2025-06-03',
      inTime: '08:30 AM',
      outTime: '04:30 PM',
      present: true,
      remark: 'Late arrival',
    },
    {
      key: '4',
      atdId: 'ATD004',
      volunteerId: 'V004',
      eventId: 'E002',
      unitId: 'U001',
      date: '2025-06-03',
      inTime: '09:15 AM',
      outTime: '05:15 PM',
      present: true,
      remark: 'On time',
    },
  ];

  // Fetch events and units on mount
  useEffect(() => {
    dispatch(fetchAllEvents());
    dispatch(fetchAllUnits());
  }, [dispatch]);

  // Show errors if any
  useEffect(() => {
    if (eventsError) message.error(`Failed to load events: ${eventsError}`);
    if (unitsError) message.error(`Failed to load units: ${unitsError}`);
  }, [eventsError, unitsError]);

  // Table columns definition
  const columns = [
    { title: 'ATD_ID', dataIndex: 'atdId', key: 'atdId' },
    { title: 'Volunteer ID', dataIndex: 'volunteerId', key: 'volunteerId' },
    { title: 'Event ID', dataIndex: 'eventId', key: 'eventId' },
    { title: 'Unit ID', dataIndex: 'unitId', key: 'unitId' },
    { title: 'Date', dataIndex: 'date', key: 'date' },
    { title: 'In Time', dataIndex: 'inTime', key: 'inTime' },
    { title: 'Out Time', dataIndex: 'outTime', key: 'outTime' },
    {
      title: 'Present / Absent',
      dataIndex: 'present',
      key: 'present',
      render: (present) => (
        <Tag color={present ? 'green' : 'red'}>
          {present ? 'Present' : 'Absent'}
        </Tag>
      ),
    },
    { title: 'Remark', dataIndex: 'remark', key: 'remark' },
  ];

  // CSV download handler
  const handleDownload = () => {
    const csvHeader = [
      'ATD_ID,Volunteer ID,Event ID,Unit ID,Date,In Time,Out Time,Present / Absent,Remark',
    ];
    const filteredData = dataSource.filter(
      (item) =>
        (!selectedEvent || item.eventId === selectedEvent) &&
        (!selectedUnit || item.unitId === selectedUnit)
    );
    const csvRows = filteredData.map((row) =>
      [
        row.atdId,
        row.volunteerId,
        row.eventId,
        row.unitId,
        row.date,
        row.inTime,
        row.outTime,
        row.present ? 'Present' : 'Absent',
        row.remark,
      ].join(',')
    );
    const csvContent = [csvHeader, ...csvRows].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'attendance_list.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ padding: 16, maxWidth: 1200, margin: 'auto' }}>
      {/* Header */}
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
        <h1 style={{ margin: 0, fontSize: '1.8rem' }}>Attendance List</h1>
        <Button
          type="primary"
          icon={<DownloadOutlined />}
          onClick={handleDownload}
          style={{ minWidth: 120 }}
          disabled={!selectedEvent || !selectedUnit}
        >
          Download
        </Button>
      </div>

      {/* Dropdowns */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 24,
          marginTop: 40,
          marginBottom: 24,
          justifyContent: 'flex-start',
        }}
      >
        <div style={{ flex: '1 1 250px', minWidth: 200 }}>
          <label
            htmlFor="eventSelect"
            style={{ display: 'block', marginBottom: 6, fontWeight: 500 }}
          >
            Choose Event <span style={{ color: 'red' }}>*</span>
          </label>
          {eventsLoading ? (
            <Spin />
          ) : (
            <Select
              id="eventSelect"
              showSearch
              placeholder="Select Event"
              style={{ width: '100%' }}
              value={selectedEvent}
              onChange={(value) => setSelectedEvent(value)}
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.props.children[0]
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              allowClear
            >
              {events.map((event) => (
                <Select.Option
                  key={event.id || event._id}
                  value={event.id || event._id}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <p>{event.event_name || event.name}</p>-
                    <span style={{ fontSize: 14 }}>
                      {event.date || event.start_date}
                    </span>
                  </div>
                </Select.Option>
              ))}
            </Select>
          )}
        </div>

        <div style={{ flex: '1 1 250px', minWidth: 200 }}>
          <label
            htmlFor="unitSelect"
            style={{ display: 'block', marginBottom: 6, fontWeight: 500 }}
          >
            Choose Unit <span style={{ color: 'red' }}>*</span>
          </label>
          {unitsLoading ? (
            <Spin />
          ) : (
            <Select
              id="unitSelect"
              showSearch
              placeholder="Select Unit"
              style={{ width: '100%' }}
              value={selectedUnit}
              onChange={(value) => setSelectedUnit(value)}
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.props.children[0]
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              allowClear
            >
              {units.map((unit) => (
                <Select.Option
                  key={unit.unit_id || unit.id}
                  value={unit.unit_id || unit.id}
                >
                  <div style={{ display: 'flex', alignItems: 'center' , gap: 6}}>
                    <span style={{ fontSize: 14 }}>
                      {unit.unit_id || unit.id}
                    </span>-
                     <p>{unit.unit_name || unit.name}</p>
                  </div>
                </Select.Option>
              ))}
            </Select>
          )}
        </div>
      </div>

      {/* Attendance Table */}
      {selectedEvent && selectedUnit && (
        <Table
          dataSource={dataSource.filter(
            (item) =>
              item.eventId === selectedEvent && item.unitId === selectedUnit
          )}
          columns={columns}
          pagination={{
              current: pagination.current,
              pageSize: pagination.pageSize,
              // total: filteredData.length,
              showSizeChanger: false,
            }}
            onChange={(paginationInfo) => {
              setPagination({
                ...pagination,
                current: paginationInfo.current,
              });
            }}
          bordered
          scroll={{ x: 'max-content' }}
          size="middle"
          rowKey="key"
        />
      )}
    </div>
  );
};

export default Attendance_list;
