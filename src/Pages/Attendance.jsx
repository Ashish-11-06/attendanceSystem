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
  message
} from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllEvents } from '../Redux/Slices/EventSlice';
import { fetchAllUnits } from '../Redux/Slices/UnitSlice';
import {
  fetchAttendance,
  addAttendanceFile,
  addAttendance,
  updateAttendance,
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
  const [isEditMode, setIsEditMode] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Add state to track if attendance already exists for event/unit/date
  const [existingAttendance, setExistingAttendance] = useState(null);

  useEffect(() => {
    dispatch(fetchAllEvents());
    dispatch(fetchAllUnits());
  }, [dispatch]);

  // Fetch attendance when event/unit changes
  const onValuesChange = (_, allValues) => {
    console.log('all values',allValues);
    
    if (allValues?.event && allValues?.unit) {
      const payload = {
        unit: allValues.unit,
        event: allValues.event,
      };
      dispatch(getVolunteerByUnitId(payload));
      setShowTable(true);

      // Fetch existing attendance for this event/unit/today
      const today = new Date().toISOString().split('T')[0];
      dispatch(fetchAttendance({ event: allValues.event, unit: allValues.unit, date: today }))
        .then((res) => {
          if (res.payload && Array.isArray(res.payload) && res.payload.length > 0) {
            setExistingAttendance(res.payload);
            setIsEditMode(true);
            // Optionally, set localVolunteers with existing attendance data
            setLocalVolunteers(
              res.payload.map((vol) => ({
                ...vol,
                key: vol.id || vol.new_personal_number || vol.atdId || String(vol.name)
              }))
            );
          } else {
            setExistingAttendance(null);
            setIsEditMode(false);
          }
        });
    } else {
      setShowTable(false);
      setExistingAttendance(null);
      setIsEditMode(false);
    }
  };

  // const onValuesChange = (_, allValues) => {
  //   if (allValues?.event && allValues?.unit) {
  //     const payload = {
  //       unit: allValues.unit,
  //       event: allValues.event, // send events.id instead of events.event_id
  //     };
  //     dispatch(getVolunteerByUnitId(payload));
  //     setShowTable(true);
  //   } else {
  //     setShowTable(false);
  //   }
  // };

  useEffect(() => {
    // If in edit mode (existingAttendance loaded), use that data
    if (isEditMode && existingAttendance && existingAttendance.length > 0) {
      setLocalVolunteers(
        existingAttendance.map((vol) => ({
          ...vol,
          key:
            vol.id ||
            vol.volunteer_id ||
            vol.volunteer ||
            vol.new_personal_number ||
            vol.atdId ||
            String(vol.name),
          new_personal_number:
            vol.new_personal_number ||
            vol.personal_number ||
            vol.p_no ||
            vol.pno ||
            vol.pn ||
            (vol.volunteer && vol.volunteer.new_personal_number) ||
            "",
          name:
            vol.name ||
            vol.volunteer_name ||
            vol.full_name ||
            (vol.volunteer && (vol.volunteer.name || vol.volunteer.volunteer_name || vol.volunteer.full_name)) ||
            "",
          gender:
            vol.gender ||
            (vol.volunteer && vol.volunteer.gender) ||
            "",
          is_registered:
            vol.is_registered !== undefined
              ? vol.is_registered
              : vol.registered !== undefined
              ? vol.registered
              : vol.isReg !== undefined
              ? vol.isReg
              : (vol.volunteer && (vol.volunteer.is_registered !== undefined
                  ? vol.volunteer.is_registered
                  : vol.volunteer.registered !== undefined
                  ? vol.volunteer.registered
                  : vol.volunteer.isReg))
        }))
      );
    } else {
      // Default: use volunteers from getVolunteerByUnitId
      setLocalVolunteers(
        volinteers?.map((vol) => ({
          ...vol,
          key:
            vol.id ||
            vol.volunteer_id ||
            vol.volunteer ||
            vol.new_personal_number ||
            vol.atdId ||
            String(vol.name),
          new_personal_number:
            vol.new_personal_number ||
            vol.personal_number ||
            vol.p_no ||
            vol.pno ||
            vol.pn ||
            "",
          name: vol.name || vol.volunteer_name || vol.full_name || "",
          gender: vol.gender || "",
          is_registered:
            vol.is_registered !== undefined
              ? vol.is_registered
              : vol.registered !== undefined
              ? vol.registered
              : vol.isReg,
        })) || []
      );
    }
  }, [volinteers, isEditMode, existingAttendance]);

  const handlePresentToggle = (checked, recordKey) => {
    console.log('handlePresentToggle called with:', checked, recordKey);
    
    setLocalVolunteers((prev) =>
      prev.map((v) =>
        v.key === recordKey
          ? { ...v, present: checked }
          : v
      )
    );
  };
console.log(localVolunteers);

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
  const filteredVolunteers = localVolunteers?.filter((vol) => {
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

  // Helper for formatting time as 'hh:mm A' and showing 5.5 hours later
const formatTimePlusIST = (timeStr) => {
  if (!timeStr) return '';
  // Accepts 'HH:mm' or 'HH:mm:ss'
  const parts = timeStr.split(':');
  let date = dayjs('1970-01-01T' + (parts.length === 2 ? timeStr + ':00' : timeStr));
  // Add 5.5 hours
  date = date.add(5, 'hour').add(30, 'minute');
  return date.format('hh:mm A');
};

  const columns = [
    {
      title: 'Sr.No.',
            dataIndex: 'sr_no',
            key: 'sr_no',
            render: (_, __, index) => index + 1,
    },
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
      title: (
        <span>
          In Time<br />
          {/* <span style={{ fontWeight: 'normal', fontSize: 12, color: '#888' }}>
            (IST hh:mm A)
          </span> */}
        </span>
      ),
      dataIndex: 'in_time',
      key: 'in_time',
      render: (in_time, record) => {
        // Show IST time in the input field
        let istTime = '';
        if (in_time) {
          // Parse as dayjs, add 5.5 hours, then format as 'HH:mm'
          const parts = in_time.split(':');
          let date = dayjs('1970-01-01T' + (parts.length === 2 ? in_time + ':00' : in_time));
          date = date.add(5, 'hour').add(30, 'minute');
          istTime = date.format('HH:mm');
        }
        return (
          <TimePicker
            value={istTime ? dayjs(istTime, 'HH:mm') : null}
            onChange={(time, timeString) =>
              handleInTimeChange(time, timeString, record.key)
            }
            format="HH:mm"
            placeholder="In Time (IST)"
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
        return getTimeInSeconds(a.in_time) - getTimeInSeconds(b.in_time);
      },
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
        // Show IST time in the input field
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
              setLocalVolunteers((prev) =>
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
      // volunteer: vol.id || vol.volunteer || vol.key,
      volunteer: vol.id || vol.key, // ensure correct ID
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
        message.success('Attendance successfully submitted!');
        setIsEditMode(true); // Enable edit mode after submit
      })
      .catch((error) => {
        console.error('Failed to submit attendance:', error);
        message.error('Error submitting attendance.');
      });
  });
};


  // Handler for updating attendance (edit mode)
  const handleUpdateAttendance = () => {
    form.validateFields().then((values) => {
      console.log('values 376',values);
      
      const { event, unit } = values;
      const date = new Date().toISOString().split('T')[0];
      // Assuming you have attendance_id from existingAttendance[0].id or similar
      const attendance_id = existingAttendance && existingAttendance[0]?.id;
      console.log('volunteers', localVolunteers);
      
    const payload = localVolunteers.map((vol) => ({
      id: vol.volunteer?.id,  // include this only if you are updating existing attendance; otherwise, remove it
      volunteer: vol.volunteer?.id,  // get volunteer.id from nested object
      event: event,                 // event ID (assumed to be a number)
      unit: unit,                   // unit ID
      date: date,                   // attendance date
      in_time: vol.in_time || null,
      out_time: vol.out_time || null,
      present: vol.present || false,
      absent: !vol.present,
      remark: vol.remark || '',
    }));

      // console.log('payload 397', payload);
      
      console.log(payload)
      if (!attendance_id) {
        alert('Attendance ID not found for update.');
        return;
      }

      dispatch(updateAttendance({ updatedAttendance: payload }))
        .unwrap()
        .then(() => {
          message.success('Attendance successfully updated!');
          setRefreshing(true); // Show loader
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        })
        .catch((error) => {
          console.error('Failed to update attendance:', error);
          message.error('Error updating attendance.');
        });
    });
  };

  return (
    <div style={{ padding: '16px' }}>
      <Spin spinning={refreshing} tip="Refreshing...">
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
                  dataSource={filteredVolunteers}
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
              {!isEditMode ? (
                <Button
                  type="primary"
                  onClick={handleSubmitAttendance}
                  disabled={attendanceLoading}
                >
                  Submit
                </Button>
              ) : (
                <Button
                  type="primary"
                  onClick={handleUpdateAttendance}
                  disabled={attendanceLoading}
                >
                  Update Attendance
                </Button>
              )}
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
      </Spin>
    </div>
  );
};

export default Attendance;
