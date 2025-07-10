import React, { useState, useEffect,useRef  } from 'react';
import { Table, Tag, Button, Select, Spin, message, TimePicker } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllEvents } from '../Redux/Slices/EventSlice';
import { fetchAllUnits } from '../Redux/Slices/UnitSlice';
import { fetchAllVolinteer } from '../Redux/Slices/VolinteerSlice';
import { fetchAttendance } from '../Redux/Slices/AttendanceSlice';
import { title } from 'framer-motion/client';
import AttendanceReportModal from '../components/Modals/AttendanceReportModal';
import { data } from 'react-router-dom';
import dayjs from 'dayjs';


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


const convertUTCtoIST = (timeString) => {
  if (!timeString) return 'N/A';

  const [hours, minutes, secondsWithMs] = timeString.split(':');
  const seconds = parseInt(secondsWithMs); // safely handle milliseconds
  const utcDate = new Date(Date.UTC(1970, 0, 1, +hours, +minutes, +seconds));

  // Add 5.5 hours to convert to IST
  const istOffsetMillis = 5.5 * 60 * 60 * 1000;
  const istDate = new Date(utcDate.getTime() + istOffsetMillis);

  return istDate.toLocaleTimeString('en-IN', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

// Helper for formatting time as 'HH:mm' after adding 5.5 hours (IST)
const getISTTimeHHMM = (timeStr) => {
  if (!timeStr) return '';
  const parts = timeStr.split(':');
  let date = dayjs('1970-01-01T' + (parts.length === 2 ? timeStr + ':00' : timeStr));
  date = date.add(5, 'hour').add(30, 'minute');
  return date.format('HH:mm');
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

// const tableData = (attendance || []).map((v, index) => ({
//   key: v.id || index,
//   atdId: v.atd_id || `ATD${index + 1}`,
//   volunteerId: v.volunteer?.new_personal_number || 'N/A',
//   eventId: v.event?.event_id || 'N/A',
//   unitId: v.volunteer?.unit?.unit_id || 'N/A',
//   date: v.date ? new Date(v.date).toISOString().split('T')[0] : 'N/A', // YYYY-MM-DD
//  inTime: convertUTCtoIST(v.in_time),
// outTime: convertUTCtoIST(v.out_time),
//  present: typeof v.present === 'boolean' ? v.present : false,
//   remark: v.remark || '-',
// }));


const tableData = (attendance || []).map((v, index) => ({
  // key: v.id || index,
  // atdId: v.atd_id || `ATD${index + 1}`,
  srNo: index + 1,
  volunteerName: v.volunteer?.name || 'N/A',
  volunteerNumber: v.volunteer?.new_personal_number || 'N/A',
  // eventId: v.event?.event_id || 'N/A',
  unitId: v.volunteer?.unit?.unit_id || 'N/A',
  date: v.date ? new Date(v.date).toISOString().split('T')[0] : 'N/A', // YYYY-MM-DD
  inTime: getISTTimeHHMM(v.in_time) || '-',
  outTime: getISTTimeHHMM(v.out_time) || '-',
  
  present: typeof v.present === 'boolean' ? v.present : false,
  remark: v.remark || '-',
}));



  const columns = [
    {
      title: 'Sr.No.',
      dataIndex: 'sr_no',
      key: 'sr_no',
      render: (_, __, index) => index + 1,
    },
    {
      title: 'Volunteer Name',
      dataIndex: 'volunteer',
      key: 'name',
      render: (volunteer) => volunteer?.name || 'N/A',
    },
    {
      title: 'New P no',
      dataIndex: 'volunteer',
      key: 'new_personal_number',
      render: (volunteer) => volunteer?.new_personal_number	 ?? 'N/A',
    },
    {
      title: 'Unit ID',
      dataIndex: 'volunteer',
      key: 'unitId',
      render: (volunteer) => volunteer?.unit?.unit_id || 'N/A',
    },
    { title: 'Date', dataIndex: 'date', key: 'date' },
    {
      title: (
        <span>
          In Time<br />
          {/* <span style={{ fontWeight: 'normal', fontSize: 12, color: '#888' }}>
            (IST HH:mm)
          </span> */}
        </span>
      ),
      dataIndex: 'in_time',
      key: 'in_time',
      render: (in_time) => getISTTimeHHMM(in_time) || '-',
    },
    {
      title: (
        <span>
          Out Time<br />
          {/* <span style={{ fontWeight: 'normal', fontSize: 12, color: '#888' }}>
            (IST hh:mm A)
          </span> */}
        </span>
      ),
      dataIndex: 'out_time',
      key: 'out_time',
      render: (out_time, record) => {
        if (!out_time) return '-'; // Show blank if no time
        let istTime = '';
        if (out_time) {
          const parts = out_time.split(':');
          let date = dayjs('1970-01-01T' + (parts.length === 2 ? out_time + ':00' : out_time));
          date = date.add(5, 'hour').add(30, 'minute');
          istTime = date.format('HH:mm');
        }
        return (
          <TimePicker
            value={istTime ? dayjs(istTime, 'HH:mm') : null}
            onChange={(time, timeString) =>
              setAttendance((prev) =>
                prev.map((v) =>
                  v.key === record.key
                    ? { ...v, out_time: timeString }
                    : v
                )
              )
            }
            format="HH:mm"
            placeholder="Out Time (IST)"
          />
        );
      },
      sorter: (a, b) => {
        const getTimeInSeconds = (timeStr) => {
          if (!timeStr) return 0;
          const parts = timeStr.split(':');
          if (parts.length === 2) timeStr = timeStr + ':00';
          const [h, m, s] = timeStr.split(':').map(Number);
          return h * 3600 + m * 60 + s;
        };
        return getTimeInSeconds(a.out_time) - getTimeInSeconds(b.out_time);
      },
    },
    {
      title: 'Male/Female',
      dataIndex: 'volunteer',
      key: 'volunteer',
      render: (volunteer) => {
        if (!volunteer) return 'N/A';
        if (volunteer.gender === 'Male') {
          return <Tag color="blue">Male</Tag>;
        }
        if (volunteer.gender === 'Female') {
          return <Tag color="pink">Female</Tag>;
        }
        return 'N/A';
      }
    },
    {
      title: 'Present / Absent',
      dataIndex: 'present',
      key: 'present',
      render: (present) => (
        <Tag color={present ? 'green' : 'red'}>{present ? 'Present' : 'Absent'}</Tag>
      ),
    },
    {
      title: 'Reg/Un-Reg',
      dataIndex: 'volunteer',
      key: 'volunteer',
      render: (volunteer) => { 
        if (!volunteer) return 'N/A';
        return volunteer.is_registered ? (
          <Tag color="orange">Reg</Tag>
        ) : (
          <Tag color="violet">Not Reg</Tag>
        );
      }
    },
    { title: 'Remark', dataIndex: 'remark', key: 'remark' },
  ];

  const handleDownload = () => {
    if (tableData.length === 0) {
      message.info('No data to download');
      return;
    }

    const csvHeader = [
      'Sr.No,Volunteer Name,New P No,Unit ID,Date,In Time,Out Time,Male/Female,Present / Absent,Reg/Un-Reg,Remark',
    ];
    const csvRows = (attendance || []).map((v, index) => {
      // Male/Female
      let genderLabel = 'N/A';
      if (v.volunteer?.gender === 'Male') genderLabel = 'Male';
      else if (v.volunteer?.gender === 'Female') genderLabel = 'Female';

      // Reg/Un-Reg
      let regLabel = 'N/A';
      if (typeof v.volunteer?.is_registered === 'boolean') {
        regLabel = v.volunteer.is_registered ? 'Reg' : 'Not Reg';
      }

      return [
        index + 1,
        v.volunteer?.name || 'N/A',
        v.volunteer?.new_personal_number || 'N/A',
        v.volunteer?.unit?.unit_id || 'N/A',
        v.date ? new Date(v.date).toISOString().split('T')[0] : 'N/A',
        getISTTimeHHMM(v.in_time) || '-',
        getISTTimeHHMM(v.out_time) || '-',
        genderLabel,
        typeof v.present === 'boolean' ? (v.present ? 'Present' : 'Absent') : 'Absent',
        regLabel,
        v.remark || '-',
      ].join(',');
    });

    // Calculate total present volunteers
    const totalPresent = (attendance || []).filter(v => v.present === true).length;
    const totalPresentRow = [`Total Present Volunteers: ${totalPresent}`];

    const csvContent = [csvHeader, ...csvRows, '', ...totalPresentRow].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const filename = `attendance_report_${yyyy}-${mm}-${dd}.csv`;
    link.setAttribute('download', filename);
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

     <AttendanceReportModal />



                    
        </div>
      </div>
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
