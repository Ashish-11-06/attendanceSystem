import React, { useState, useEffect,useRef  } from 'react';
import { Table, Tag, Button, Select, Spin, message } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllEvents } from '../Redux/Slices/EventSlice';
import { fetchAllUnits } from '../Redux/Slices/UnitSlice';
import { fetchAllVolinteer } from '../Redux/Slices/VolinteerSlice';
import { fetchAttendance } from '../Redux/Slices/AttendanceSlice';
import { title } from 'framer-motion/client';
import Download from './Download';


const Attendance_list = () => {
  const dispatch = useDispatch();

  const { events, loading: eventsLoading, error: eventsError } = useSelector((state) => state.events);
  const { units, loading: unitsLoading, error: unitsError } = useSelector((state) => state.units);
  const {  loading: volunteerLoading, error: volunteerError } = useSelector((state) => state.attendance);

  const [ attendance, setAttendance ] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const downloadRef = useRef();

  const handlePrint = () => {
  downloadRef.current?.print();
  };

  // Fetch events and units on mount
  useEffect(() => {
    dispatch(fetchAllEvents());
    dispatch(fetchAllUnits());
  }, [dispatch]);

  // Fetch volunteers only if both event and unit are selected
useEffect(() => {
  const getAttendance = async () => {
    if (selectedEvent && selectedUnit) {
      try {
        const response = await dispatch(
          fetchAttendance({ event: selectedEvent, unit: selectedUnit })
        );
        if (response.payload) {
          setAttendance(response.payload);
        }
      } catch (error) {
        console.error('Failed to fetch attendance:', error);
      }
    }
  };

  getAttendance();
}, [dispatch, selectedEvent, selectedUnit]);


  console.log(attendance);

  // Prepare table data only if both selected
  // const tableData =
  //   selectedEvent && selectedUnit
  //     ? attendance?.map((v, index) => ({
  //         key: v.id || index,
  //         atdId: v.atdId || `ATD${index + 1}`,
  //         volunteerId: v.volunteer_id || v.id,
  //         // event: v.event || '-',
  //         unitId: v.unit_id || (v.unit && v.unit.unit_id) || '-',
  //         date: v.date || '-',
  //         inTime: v.inTime || '-',
  //         outTime: v.outTime || '-',
  //         present: typeof v.present === 'boolean' ? v.present : false,
  //         remark: v.remark || '-',
  //       }))
  //     : [];

  //     console.log(tableData);

const tableData = (attendance || []).map((v, index) => ({
  key: v.id || index,
  atdId: v.atd_id || `ATD${index + 1}`,
  volunteerId: v.volunteer?.new_personal_number || 'N/A',
  eventId: v.event?.event_id || 'N/A',
  unitId: v.volunteer?.unit?.unit_id || 'N/A',
  date: v.date ? new Date(v.date).toISOString().split('T')[0] : 'N/A', // YYYY-MM-DD
  inTime: v.in_time || 'N/A',
  outTime: v.out_time || 'N/A',
  present: typeof v.present === 'boolean' ? v.present : false,
  remark: v.remark || '-',
}));



  const columns = [
    { title: 'ATD_ID', dataIndex: 'atd_id', key: 'atdId' },
     {
  title: 'New P no',
  dataIndex: 'volunteer',
  key: 'new_personal_number',
  render: (volunteer) => volunteer?.new_personal_number	 ?? 'N/A',
},
 
    {
  title: 'Event ID',
  dataIndex: 'event', // keep this as the root object
  key: 'eventId',
  render: (event) => event?.event_id?? 'N/A',
},
    {
      title: 'Unit ID',
      dataIndex: 'volunteer',
      key: 'unitId',
      render: (volunteer) => volunteer?.unit?.unit_id || 'N/A',
    },
    { title: 'Date', dataIndex: 'date', key: 'date' },
    { title: 'In Time', dataIndex: 'in_time', key: 'in_time' },
    { title: 'Out Time', dataIndex: 'out_time', key: 'out_time' },
    {
      title: 'Present / Absent',
      dataIndex: 'present',
      key: 'present',
      render: (present) => (
        <Tag color={present ? 'green' : 'red'}>{present ? 'Present' : 'Absent'}</Tag>
      ),
    },
    { title: 'Remark', dataIndex: 'remark', key: 'remark' },
  ];

  const handleDownload = () => {
    if (tableData.length === 0) {
      message.info('No data to download');
      return;
    }

    const csvHeader = [
      'ATD_ID,Volunteer ID,Event ID,Unit ID,Date,In Time,Out Time,Present / Absent,Remark',
    ];
    const csvRows = tableData.map((row) =>
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
    <div
      style={{
        padding: 16,
        maxWidth: 1200,
        margin: 'auto',
        minHeight: '70vh',
      }}
    >
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
        
        <div
          style={{
            display: 'flex',
            gap: 12,
          }}
        >

                  <Button
            type="primary"
            icon={<DownloadOutlined />}
            onClick={handleDownload}
            style={{ minWidth: 120 }}
            disabled={tableData.length === 0}
          >
            Download Attendance
          </Button>

          <Button onClick={handlePrint}>Download Report</Button>
        </div>
      </div>

      <Download ref={downloadRef} />

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

        {/* Event Select */}
        <div style={{ flex: '1 1 250px', minWidth: 200 }}>
          <label
            htmlFor="eventSelect"
            style={{
              display: 'block',
              marginBottom: 6,
              fontWeight: 600,
              fontSize: 14,
            }}
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
              allowClear
              filterOption={(input, option) =>
                option.children
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
            >
              {events.map((event) => (
                <Select.Option
                  key={event.id || event._id}
                  value={event.id || event._id}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      fontSize: 14,
                    }}
                  >
                    <p style={{ margin: 0 }}>{event.event_name || event.name}</p> -{' '}
                    <span>
                        {event.date || event.start_date
                          ? new Date(event.date || event.start_date).toLocaleDateString('en-GB')
                          : 'N/A'}
                      </span>
                  </div>
                </Select.Option>
              ))}
            </Select>
          )}
        </div>

        {/* Unit Select */}
        <div style={{ flex: '1 1 250px', minWidth: 200 }}>
          <label
            htmlFor="unitSelect"
            style={{
              display: 'block',
              marginBottom: 6,
              fontWeight: 600,
              fontSize: 14,
            }}
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
              allowClear
              filterOption={(input, option) =>
                option.children
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
            >
              {units.map((unit) => (
                <Select.Option
                  key={unit.id}
                  value={unit.id}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      fontSize: 14,
                    }}
                  >
                    <span>{unit.unit_id || unit.id}</span> -{' '}
                    <p style={{ margin: 0 }}>{unit.unit_name || unit.name}</p>
                  </div>
                </Select.Option>
              ))}
            </Select>
          )}
        </div>
      </div>

      {/* Show table only if both event and unit are selected */}
      {selectedEvent && selectedUnit ? (
        <Spin spinning={volunteerLoading}>
          <Table
            dataSource={attendance}
            columns={columns}
            pagination={{
              current: pagination.current,
              pageSize: pagination.pageSize,
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
        </Spin>
      ) : (
        <p
          style={{
            textAlign: 'center',
            marginTop: 40,
            color: '#888',
            fontStyle: 'italic',
          }}
        >
          {/* Please select both <b>Event</b> and <b>Unit</b> to view attendance. */}
        </p>
      )}
    </div>
  );
};

export default Attendance_list;
