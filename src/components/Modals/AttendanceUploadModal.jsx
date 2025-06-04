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
  Spin,
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';

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
  const { events, loading: eventsLoading } = useSelector(
    (state) => state.events
  );
  const { units, loading: unitsLoading } = useSelector(
    (state) => state.units
  );
  console.log('units:', units);
  console.log('events:', events);

  const normFile = (e) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e && e.fileList;
};

  // New: handle form submit and pass values to parent
  const onFinish = (values) => {
    // Attach file info to values
    values.uploadFile = fileList && fileList.length > 0 ? fileList[0] : null;
    handleUploadSubmit(values);
  };

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
      <Form form={uploadForm} layout="vertical" onFinish={onFinish}>
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

       <Form.Item
                   label="Upload Excel File"
                   name="file"
                   valuePropName="fileList"
                   getValueFromEvent={normFile}
                   rules={[{ required: true, message: 'Please upload an Excel file!' }]}
                 >
                   <Upload
                     beforeUpload={() => false} // Prevent automatic upload
                     accept=".xlsx, .xls"
                   >
                     <Button icon={<UploadOutlined />}>Click to Upload</Button>
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
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Row>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AttendanceUploadModal;
