import React, { useState, useEffect } from 'react';
import { TimePicker } from 'antd';
import dayjs from 'dayjs';
import {
  Select,
  Form,
  Row,
  Col,
  Table,
  Checkbox,
  Button,
  Input,
  Spin,
  Alert,
} from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllEvents } from '../Redux/Slices/EventSlice';
import { fetchAllUnits } from '../Redux/Slices/UnitSlice';
import {
  fetchAttendance,
  addAttendanceFile,
  addAttendance,
} from '../Redux/Slices/AttendanceSlice';
import AttendanceUploadModal from '../components/Modals/AttendanceUploadModal';
import { getVolunteerByUnitId } from '../Redux/Slices/VolinteerSlice';

const { Option } = Select;

const Attendance = () => {
  const dispatch = useDispatch();

  const { events, loading: eventsLoading } = useSelector(
    (state) => state.events
  );
  const { units, loading: unitsLoading } = useSelector(
    (state) => state.units
  );
  console.log('units:', events);
  
  const {
    volinteers,
    loading: attendanceLoading,
    error: attendanceError,
  } = useSelector((state) => state.volinteers);

  const [form] = Form.useForm();
  const [uploadForm] = Form.useForm();
  const [showTable, setShowTable] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [filterOption, setFilterOption] = useState(null);
  const [localVolunteers, setLocalVolunteers] = useState([]);

  useEffect(() => {
    dispatch(fetchAllEvents());
    dispatch(fetchAllUnits());
  }, [dispatch]);

  const onValuesChange = (_, allValues) => {
    if (allValues?.event && allValues?.unit) {
      const payload = {
        unit: allValues.unit,
        event: allValues.event, // send events.id instead of events.event_id
      };
      dispatch(getVolunteerByUnitId(payload));
      setShowTable(true);
    } else {
      setShowTable(false);
    }
  };

  useEffect(() => {
    setLocalVolunteers(
      volinteers?.map((vol) => ({
        ...vol,
        key: vol.id || vol.new_personal_number || vol.atdId || String(vol.name) // make sure key is unique & consistent
      })) || []
    );
  }, [volinteers]);

  const handlePresentToggle = (checked, recordKey) => {
    setLocalVolunteers((prev) =>
      prev.map((v) =>
        v.key === recordKey
          ? { ...v, present: checked }
          : v
      )
    );
  };

  const handleRemarkChange = (value, recordKey) => {
    setLocalVolunteers((prev) =>
      prev.map((v) =>
        v.key === recordKey
          ? { ...v, remark: value }
          : v
      )
    );
  };

const handleInTimeChange = (time, timeString, recordKey) => {
  setLocalVolunteers((prev) =>
    prev.map((v) =>
      v.key === recordKey
        ? { ...v, in_time: timeString }
        : v
    )
  );
};


  const showModal = () => setIsModalOpen(true);
  const handleCancel = () => {
    setIsModalOpen(false);
    uploadForm.resetFields();
    setFileList([]);
  };

const handleUploadSubmit = async (values) => {
  console.log('Attendance upload data to backend:', values);
  console.log('Attendance upload data to backend file:', values.file);

  const formData = new FormData();
  // Get the uploaded Excel file (binary)
  const fileObj = values.file?.[0]?.originFileObj;
  const fileName = fileObj?.name;
  // if (!fileObj) {
  //   alert('Please upload an Excel file.');
  //   return;
  // }

  // Append the binary file
  formData.append('file', fileObj); // Key: "file"
formData.append('file_name', fileName);
  // Append other data fields (as string)
  formData.append('event', String(values.event));
  formData.append('unit', String(values.unit));

  try {
    const res = await dispatch(addAttendanceFile(formData));
    console.log('Upload response:', res);

    alert(res?.payload?.message || 'Attendance file uploaded successfully!');
    setIsModalOpen(false);
    uploadForm.resetFields();
    setFileList([]);
  } catch (error) {
    console.error('Upload failed:', error);
    alert('Upload failed. Please try again.');
  }
};


  // Apply filter based on dropdown selection
  const filteredVolunteers = volinteers?.filter((vol) => {
    if (!filterOption) return true;
    if (filterOption === 'male' || filterOption === 'female') {
      return vol.gender?.toLowerCase() === filterOption;
    }
    if (filterOption === 'registered') {
      return vol.is_registered === true;
    }
    if (filterOption === 'unregistered') {
      return vol.is_registered === false;
    }
    return true;
  });

  const columns = [
    {
      title: 'New P no.',
      dataIndex: 'new_personal_number',
      key: 'new_personal_number',
      ellipsis: true,
    },
    { title: 'Name', dataIndex: 'name', key: 'name', ellipsis: true },
    { title: 'Gender', dataIndex: 'gender', key: 'gender', ellipsis: true },
    {
      title: 'Is Reg?',
      dataIndex: 'is_registered',
      key: 'is_registered',
      render: (value) => (value ? 'Yes' : 'No'),
      ellipsis: true,
    },
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
  title: 'In Time',
  dataIndex: 'in_time',
  key: 'in_time',
  render: (in_time, record) => (
    <TimePicker
      value={in_time ? dayjs(in_time, 'HH:mm') : null}
      onChange={(time, timeString) =>
        handleInTimeChange(time, timeString, record.key)
      }
      format="HH:mm"
    />
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

  const handleSubmitAttendance = () => {
  form.validateFields().then((values) => {
    const { event, unit } = values;
    const date = new Date().toISOString().split('T')[0]; // e.g. '2025-06-04'

    const payload = localVolunteers.map((vol) => ({
      volunteer: vol.id || vol.volunteer || vol.key, // ensure correct ID
      event,
      unit,
      date,
      in_time: vol.in_time || null,
      out_time: vol.out_time || null, // if you want to support it
      present: vol.present || false,
      absent: !vol.present,
      remark: vol.remark || '',
    }));

    dispatch(addAttendance(payload))
      .unwrap()
      .then(() => {
        alert('Attendance successfully submitted!');
      })
      .catch((error) => {
        console.error('Failed to submit attendance:', error);
        alert('Error submitting attendance.');
      });
  });
};


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
          <Col xs={24} sm={8}>
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
                {events?.map((event, index) => (
                  <Option
                    key={event.id ?? `event-${index}`}
                    value={event.id ?? `event-${index}`}
                  >
                    {`${event.event_name} - ${new Date(event.start_date).toLocaleDateString('en-GB')}`}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} sm={8}>
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
                {units?.map((unit, index) => (
                  <Option
                    key={unit.id ?? `unit-${index}`}
                    value={unit.id ?? `unit-${index}`}
                  >
                    {`${unit.unit_id ?? unit.id} - ${unit.unit_name ?? unit.name}`}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} sm={8}>
            <Form.Item label="Filter Volunteers">
              <Select
                allowClear
                placeholder="Select filter"
                onChange={(value) => setFilterOption(value)}
              >
                <Option value="male">Male</Option>
                <Option value="female">Female</Option>
                <Option value="registered">Registered</Option>
                <Option value="unregistered">Unregistered</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </Form>

      {showTable && (
        <>
          {attendanceError && (
            // Only show error if it's not HTML (e.g., not starting with '<')
            !/^</.test(attendanceError) && (
              <Alert message={attendanceError.message} type="error" style={{ marginBottom: 16 }} />
            )
          )}

          <Row style={{ overflowX: 'auto' }}>
            <Col span={24}>
              <Table
                dataSource={localVolunteers}
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
