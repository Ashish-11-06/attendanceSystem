import React, { useState, useEffect } from 'react';
import { Select, Form, Row, Col, Table, Checkbox, Button, Input, Spin, Alert } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllEvents } from '../Redux/Slices/EventSlice';
import { fetchAllUnits } from '../Redux/Slices/UnitSlice';
import { fetchAttendance, clearAttendance } from '../Redux/Slices/AttendanceSlice';
import AttendanceUploadModal from '../components/Modals/AttendanceUploadModal';

const { Option } = Select;

const Attendance = () => {
  const dispatch = useDispatch();

  const { events, loading: eventsLoading } = useSelector((state) => state.events);
  const { units, loading: unitsLoading } = useSelector((state) => state.units);
  const { data: attendanceData, loading: attendanceLoading, error: attendanceError } = useSelector(
    (state) => state.attendance
  );

  const [form] = Form.useForm();
  const [uploadForm] = Form.useForm();
  const [showTable, setShowTable] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    dispatch(fetchAllEvents());
    dispatch(fetchAllUnits());
  }, [dispatch]);

const onValuesChange = (_, allValues) => {
  if (allValues?.event && allValues?.unit) {
    const payload = {
      event: allValues.event,
      unit: allValues.unit,
    };
    console.log('Fetching attendance with:', payload);
    // dispatch(fetchAttendance(payload));
    setShowTable(true);
  } else {
    // dispatch(clearAttendance());
    setShowTable(false);
  }
};


  const handlePresentToggle = (checked, recordKey) => {
    // Optional: Implement local edit of attendance if needed
  };

  const handleRemarkChange = (value, recordKey) => {
    // Optional: Implement local edit of remark if needed
  };

  const handleSubmitAttendance = () => {
    alert('Attendance submitted!');
    console.log('Submitted attendance data:', attendanceData);
  };

  const showModal = () => setIsModalOpen(true);
  const handleCancel = () => {
    setIsModalOpen(false);
    uploadForm.resetFields();
    setFileList([]);
  };

  const handleUploadSubmit = () => {
    uploadForm
      .validateFields()
      .then(() => {
        alert('Upload submitted!');
        setIsModalOpen(false);
        uploadForm.resetFields();
        setFileList([]);
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  };

  const columns = [
    { title: 'ATD_ID', dataIndex: 'atdId', key: 'atdId', ellipsis: true },
    { title: 'Name', dataIndex: 'name', key: 'name', ellipsis: true },
    { title: 'Gender', dataIndex: 'gender', key: 'gender', ellipsis: true },
    { title: 'Email', dataIndex: 'email', key: 'email', ellipsis: true },
    { title: 'Mobile', dataIndex: 'mobile', key: 'mobile', ellipsis: true },
    {
      title: 'Present / Absent',
      dataIndex: 'present',
      key: 'present',
      render: (present, record) => (
        <Checkbox
          checked={present}
          onChange={(e) => handlePresentToggle(e.target.checked, record.key)}
        >
          {present ? 'Present' : 'Absent'}
        </Checkbox>
      ),
    },
    {
      title: 'Remark',
      dataIndex: 'remark',
      key: 'remark',
      render: (remark, record) => (
        <Input
          value={remark}
          onChange={(e) => handleRemarkChange(e.target.value, record.key)}
          placeholder="Enter remark"
        />
      ),
    },
  ];

  return (
    <div style={{ padding: '16px' }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <h1>Mark Attendance</h1>
        </Col>
        <Col>
          <Button type="primary" onClick={showModal}>
            Uploads
          </Button>
        </Col>
      </Row>

      <Form form={form} layout="vertical" onValuesChange={onValuesChange}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Choose Event"
              name="event"
              rules={[{ required: true, message: 'Please select an event!' }]}
            >
              <Select
                placeholder={eventsLoading ? 'Loading events...' : 'Select an event'}
                allowClear
                showSearch
                loading={eventsLoading}
                optionFilterProp="children"
                notFoundContent={eventsLoading ? <Spin size="small" /> : 'No events found'}
              >
                {events && events.length > 0 ? (
                  events.map((event, index) => (
                    <Option
                      key={event.id ?? `event-${index}`}
                      value={event.id ?? `event-${index}`}
                    >
                      {`${event.event_name} - ${new Date(event.start_date).toLocaleDateString('en-GB')}`}
                    </Option>
                  ))
                ) : (
                  <Option disabled>No events available</Option>
                )}
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item
              label="Choose Unit"
              name="unit"
              rules={[{ required: true, message: 'Please select a unit!' }]}
            >
              <Select
                placeholder={unitsLoading ? 'Loading units...' : 'Select a unit'}
                allowClear
                showSearch
                loading={unitsLoading}
                optionFilterProp="children"
                notFoundContent={unitsLoading ? <Spin size="small" /> : 'No units found'}
              >
                {units && units.length > 0 ? (
                  units.map((unit, index) => (
                    <Option
                      key={unit.id ?? `unit-${index}`}
                      value={unit.id ?? `unit-${index}`}
                    >
                      {`${unit.unit_id ?? unit.id} - ${unit.unit_name ?? unit.name}`}
                    </Option>
                  ))
                ) : (
                  <Option disabled>No units available</Option>
                )}
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </Form>

      {showTable && (
        <>
          {attendanceError && <Alert message={attendanceError.error} type="error" style={{ marginBottom: 16 }} />}
          <Row style={{ overflowX: 'auto' }}>
            <Col span={24}>
              <Table
                dataSource={attendanceData}
                columns={columns}
                pagination={false}
                rowKey={(record) => record.key || record.atdId || record.id || Math.random()}
                size="middle"
                loading={attendanceLoading}
                scroll={{ x: true }}
              />
            </Col>
          </Row>

          <Row justify="center" style={{ marginTop: 24 }}>
            <Button type="primary" onClick={handleSubmitAttendance} disabled={attendanceLoading}>
              Submit
            </Button>
          </Row>
        </>
      )}

      <AttendanceUploadModal
        isModalOpen={isModalOpen}
        handleCancel={handleCancel}
        handleUploadSubmit={handleUploadSubmit}
        uploadForm={uploadForm}
        fileList={fileList}
        setFileList={setFileList}
      />
    </div>
  );
};

export default Attendance;
