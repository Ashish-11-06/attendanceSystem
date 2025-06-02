import React, { useState, useEffect } from 'react';
import { Table, Tag, Button } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';

const Attendance_list = () => {
  // Track screen width to toggle layout
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 992); // 992px is common desktop breakpoint

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 992);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const containerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    flexWrap: isDesktop ? 'nowrap' : 'wrap', // nowrap on desktop, wrap on smaller screens
  };

  const headingStyle = {
    margin: 0,
    flex: isDesktop ? '0 1 auto' : '1 1 100%', // heading takes auto width on desktop, full width on mobile
  };

  const buttonWrapperStyle = {
    flex: '0 0 auto',
    marginTop: isDesktop ? 0 : 10, // no margin on desktop, margin-top on mobile for spacing
  };

  // ... rest of your code unchanged (columns, dataSource, handleDownload)

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
  ];

  const handleDownload = () => {
    const csvHeader = [
      'ATD_ID,Volunteer ID,Event ID,Unit ID,Date,In Time,Out Time,Present / Absent,Remark',
    ];
    const csvRows = dataSource.map((row) =>
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
    <div style={{ padding: 16 }}>
      <div style={containerStyle}>
        <h1 style={headingStyle}>Attendance List</h1>
        <div style={buttonWrapperStyle}>
          <Button
            type="primary"
            icon={<DownloadOutlined />}
            onClick={handleDownload}
          >
            Download
          </Button>
        </div>
      </div>

      <Table
        dataSource={dataSource}
        columns={columns}
        bordered
        scroll={{ x: 'max-content' }}
      />
    </div>
  );
};

export default Attendance_list;
