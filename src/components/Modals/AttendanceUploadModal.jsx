// AttendanceUploadModal.jsx
import React from 'react';
import {
  Modal,
  Form,
  Select,
  Upload,
  Button,
  DatePicker,
  Row,
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const { Option } = Select;

const AttendanceUploadModal = ({
  isModalOpen,
  handleCancel,
  handleUploadSubmit,
  uploadForm,
  fileList,
  setFileList,
}) => {
  const handleUploadChange = ({ fileList }) => setFileList(fileList.slice(-1));

  return (
    <Modal
      title="Upload Attendance File"
      open={isModalOpen}
      onCancel={handleCancel}
      footer={null}
      centered
      width="100%"
      style={{ maxWidth: 520 }}
      destroyOnClose
    >
      <Form form={uploadForm} layout="vertical">
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

        <Form.Item
          label="Upload File"
          name="uploadFile"
          rules={[{ required: true, message: 'Please upload a file!' }]}
        >
          <Upload
            beforeUpload={() => false}
            onChange={handleUploadChange}
            fileList={fileList}
            maxCount={1}
            showUploadList
          >
            <Button icon={<UploadOutlined />}>Choose File</Button>
          </Upload>
        </Form.Item>

        <Form.Item
          label="Date"
          name="date"
          rules={[{ required: true, message: 'Please select a date!' }]}
        >
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item>
          <Row justify="center">
            <Button type="primary" onClick={handleUploadSubmit}>
              Submit
            </Button>
          </Row>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AttendanceUploadModal;
