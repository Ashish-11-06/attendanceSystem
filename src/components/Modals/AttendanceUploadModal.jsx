import React, { useEffect } from 'react';
import {
  Modal,
  Form,
  Select,
  Upload,
  Button,
  DatePicker,
  Row,
  Spin,
  message,
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllEvents } from '../../Redux/Slices/EventSlice';
import { fetchAllUnits } from '../../Redux/Slices/UnitSlice';
import { uploadAttendanceFile } from '../../Redux/Slices/AttendanceUploadSlice';

const { Option } = Select;

const AttendanceUploadModal = ({
  isModalOpen,
  handleCancel,
  uploadForm,
  fileList,
  setFileList,
}) => {
  const dispatch = useDispatch();

  const { events, loading: eventsLoading } = useSelector((state) => state.events);
  const { units, loading: unitsLoading } = useSelector((state) => state.units);
  const { loading: uploadLoading } = useSelector((state) => state.attendance);

  useEffect(() => {
    if (isModalOpen) {
      dispatch(fetchAllEvents());
      dispatch(fetchAllUnits());
    }
  }, [isModalOpen, dispatch]);

  const handleUploadChange = ({ fileList }) => {
    setFileList(fileList.slice(-1)); // Only keep latest file
  };

 const handleUploadSubmit = () => {
  uploadForm
    .validateFields()
    .then((values) => {
      if (fileList.length === 0) {
        message.warning('Please upload a file!');
        return;
      }

      const formData = new FormData();
         formData.append('file', fileList[0].originFileObj);     // actual file binary
      formData.append('file_name', fileList[0].name);   
      formData.append('event', values.event);
      formData.append('unit', values.unit);
      formData.append('date', values.date.format('YYYY-MM-DD'));

      dispatch(uploadAttendanceFile(formData))
        .unwrap()
        .then(() => {
          message.success('Attendance file uploaded successfully!');
          handleCancel();
          setFileList([]);
          uploadForm.resetFields();
        })
        .catch((err) => {
          console.error('Upload failed:', err);
          message.error('Failed to upload attendance file!');
        });
    })
    .catch((info) => {
      console.log('Validation Failed:', info);
    });
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
      <Form form={uploadForm} layout="vertical">
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
              <Option key={event.id ?? index} value={event.id ?? index}>
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
              <Option key={unit.id ?? index} value={unit.id ?? index}>
                {`${unit.unit_id} - ${unit.unit_name ?? unit.name}`}
              </Option>
            ))}
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
            <Button type="primary" onClick={handleUploadSubmit} loading={uploadLoading}>
              Submit
            </Button>
          </Row>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AttendanceUploadModal;
