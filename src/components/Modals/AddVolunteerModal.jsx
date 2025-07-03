import React, { useEffect, useState } from 'react';
import { Modal, Form, Select, Row, Col, Button, Upload, Spin, Alert, message } from 'antd';
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
const [successMsg, setSuccessMsg] = useState(null);

  const { units, loadingUnit, errorUnit } = useSelector((state) => state.units);
console.log('units:', units);

  // Fetch units if not already in the store
  useEffect(() => {
    if (!units.length) {
      dispatch(fetchAllUnits());
    }
  }, [dispatch, units]);

const handleFinish = async (values) => {
  const formData = new FormData();
  if (values.file && values.file.length > 0) {
    const file = values.file[0].originFileObj;
    const unit_id = values.unit;
    formData.append('file', file);
    formData.append('unit', unit_id);

    try {
      const res = await dispatch(addVolinteer(formData));
      const msg = res?.payload?.message || 'Volunteer added successfully!';
      setSuccessMsg(msg);  // Set success message
      form.resetFields();  // Reset form fields
      setTimeout(() => {
        window.location.reload(); // Auto refresh page after add
      }, 1000);
    } catch (error) {
      console.error('Error adding volunteer:', error);
    }
  } else {
    console.error("No file uploaded");
  }
};

// Auto-clear the alert after 3 seconds
useEffect(() => {
  if (successMsg) {
    const timer = setTimeout(() => {
      setSuccessMsg(null);
      onCancel(); // Close modal after 3 seconds
    }, 3000);
    return () => clearTimeout(timer);
  }
}, [successMsg]);

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
      centered
      width="90%"
      style={{ maxWidth: 600 }}
    >
      {successMsg && (
  <Alert
    message={successMsg}
    type="success"
    showIcon
    style={{ marginBottom: '1rem' }}
  />
)}

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
                  {unit.unit_name}
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
