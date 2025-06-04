import React, { useEffect } from 'react';
import { Modal, Form, Select, Row, Col, Button, Upload, Spin, Alert } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAllUnits } from '../../Redux/Slices/UnitSlice'; 
import { addVolinteer } from '../../Redux/Slices/VolinteerSlice';

const { Option } = Select;

const normFile = (e) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e && e.fileList;
};

const AddVolunteerModal = ({ visible, onCancel }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const { units, loadingUnit, errorUnit } = useSelector((state) => state.units);

  // Fetch units if not already in the store
  useEffect(() => {
    if (!units.length) {
      dispatch(fetchAllUnits());
    }
  }, [dispatch, units]);

  const handleFinish = (values) => {
    const formData = new FormData();
    
    // Check if a file was uploaded
    if (values.file && values.file.length > 0) {
      const file = values.file[0].originFileObj; // Access the actual file object
      formData.append('file', file); // Append the actual file data

      // Append unit_id as well
      formData.append('unit_id', values.unit);

      // Optional: Log FormData keys and values for debugging
      for (let pair of formData.entries()) {
        console.log(pair[0] + ': ', pair[1]);
      }

      dispatch(addVolinteer(formData));
      form.resetFields();
    } else {
      console.error("No file uploaded");
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title="Add New Volunteer"
      open={visible}
      onCancel={handleCancel}
      footer={null}
      destroyOnClose
      centered
      width="90%"
      style={{ maxWidth: 600 }}
    >
      {loadingUnit ? (
        <Spin tip="Loading units..." />
      ) : errorUnit ? (
        <Alert message="Error loading units" type="error" />
      ) : (
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
        >
          <Form.Item
            label="Unit"
            name="unit"
            rules={[{ required: true, message: 'Please select a unit!' }]}
          >
            <Select placeholder="Select a unit">
              {units.map((unit) => (
                <Option key={unit.id} value={unit.id}>
                  {unit.name}
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

          <Form.Item>
            <Row justify="center" gutter={16}>
              <Col>
                <Button onClick={handleCancel}>Cancel</Button>
              </Col>
              <Col>
                <Button type="primary" htmlType="submit">
                  Add Volunteer
                </Button>
              </Col>
            </Row>
          </Form.Item>
        </Form>
      )}
    </Modal>
  );
};

export default AddVolunteerModal;
