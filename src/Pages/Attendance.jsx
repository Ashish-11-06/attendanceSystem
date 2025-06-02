import React, { useState } from 'react';
import {
  Select,
  Form,
  Row,
  Col,
  Table,
  Checkbox,
  Button,
  Input,
} from 'antd';
import AttendanceUploadModal from '../components/Modals/AttendanceUploadModal';

const { Option } = Select;

const Attendance = () => {
  const [form] = Form.useForm();
  const [uploadForm] = Form.useForm();
  const [attendanceData, setAttendanceData] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fileList, setFileList] = useState([]);

  const onValuesChange = (_, allValues) => {
    if (allValues.event && allValues.unit) {
      const mockData = [
        {
          key: '1',
          atdId: 'ATD001',
          name: 'John Doe',
          gender: 'Male',
          email: 'john@example.com',
          mobile: '1234567890',
          present: true,
          remark: '',
        },
        {
          key: '2',
          atdId: 'ATD002',
          name: 'Jane Smith',
          gender: 'Female',
          email: 'jane@example.com',
          mobile: '0987654321',
          present: false,
          remark: '',
        },
      ];
      setAttendanceData(mockData);
      setShowTable(true);
    } else {
      setShowTable(false);
      setAttendanceData([]);
    }
  };

  const handlePresentToggle = (checked, recordKey) => {
    setAttendanceData((prevData) =>
      prevData.map((item) =>
        item.key === recordKey ? { ...item, present: checked } : item
      )
    );
  };

  const handleRemarkChange = (value, recordKey) => {
    setAttendanceData((prevData) =>
      prevData.map((item) =>
        item.key === recordKey ? { ...item, remark: value } : item
      )
    );
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
          <h2>Mark Attendance</h2>
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
              <Select placeholder="Select an event" allowClear showSearch>
                <Option value="event1">Event 1</Option>
                <Option value="event2">Event 2</Option>
                <Option value="event3">Event 3</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Choose Unit"
              name="unit"
              rules={[{ required: true, message: 'Please select a unit!' }]}
            >
              <Select placeholder="Select a unit" allowClear showSearch>
                <Option value="unit1">Unit 1</Option>
                <Option value="unit2">Unit 2</Option>
                <Option value="unit3">Unit 3</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </Form>

      {showTable && (
        <>
          <Row style={{ overflowX: 'auto' }}>
            <Col span={24}>
              <Table
                dataSource={attendanceData}
                columns={columns}
                pagination={false}
                rowKey="key"
                size="middle"
                scroll={{ x: true }}
              />
            </Col>
          </Row>

          <Row justify="center" style={{ marginTop: 24 }}>
            <Button type="primary" onClick={handleSubmitAttendance}>
              Submit
            </Button>
          </Row>
        </>
      )}

      {/* Separate Modal Component */}
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
