// src/components/Modals/AddEventModal.jsx
import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, DatePicker, TimePicker, Button, message, Spin } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { addEvent, updateEvent, fetchAllEvents } from '../../Redux/Slices/EventSlice';
import { fetchAllLocations } from '../../Redux/Slices/locationSlice';
import dayjs from 'dayjs';

const { Option } = Select;

const AddEventModal = ({ visible, onCancel, form, editingEvent }) => {
  const dispatch = useDispatch();
  const { locations, loading } = useSelector((state) => state.locations);

  useEffect(() => {
    if (visible && locations.length === 0) {
      dispatch(fetchAllLocations());
    }
  }, [visible, dispatch, locations.length]);

  useEffect(() => {
    if (visible && editingEvent) {
      form.setFieldsValue({
        eventName: editingEvent.event_name,
        location: editingEvent.location.map((loc) => String(loc.id)),
        start_date: dayjs(editingEvent.start_date),
        end_date: dayjs(editingEvent.end_date),
        time: dayjs(editingEvent.time, 'HH:mm:ss'),
      });
    } else if (!visible) {
      form.resetFields();
    }
  }, [visible, editingEvent, form]);

  const onFinish = async (values) => {
    const eventData = {
      event_name: values.eventName,
      location: values.location,
      start_date: values.start_date.format('YYYY-MM-DD'),
      end_date: values.end_date.format('YYYY-MM-DD'),
      time: values.time.format('HH:mm:ss'),
    };

    try {
      let resultAction;
      if (editingEvent) {
        resultAction = await dispatch(updateEvent({ id: editingEvent.id, updatedEvent: eventData }));
      } else {
        resultAction = await dispatch(addEvent(eventData));
      }

      if (resultAction.meta.requestStatus === 'fulfilled') {
        message.success(editingEvent ? 'Event updated successfully!' : 'Event added successfully!');
        form.resetFields();
        onCancel();
        dispatch(fetchAllEvents());
      } else {
        throw new Error(resultAction.payload || 'Operation failed');
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  return (
    <Modal
      title={editingEvent ? "Update Event" : "Add New Event"}
      open={visible}
      onCancel={onCancel}
      footer={null}
      centered
      destroyOnClose
    >
      <Form form={form} layout="vertical" onFinish={onFinish} name="add_event_form">
        <Form.Item
          label="Event Name"
          name="eventName"
          rules={[{ required: true, message: 'Please enter event name' }]}
        >
          <Input placeholder="Enter event name" />
        </Form.Item>

        <Form.Item
          label="Location(s)"
          name="location"
          rules={[{ required: true, message: 'Please select at least one location' }]}
        >
          {loading ? (
            <Spin />
          ) : (
            <Select
              mode="multiple"
              showSearch
              placeholder="Select location(s)"
              optionFilterProp="label"
              filterOption={(input, option) =>
                option.label.toLowerCase().includes(input.toLowerCase())
              }
            >
              {locations?.map((loc) => {
                const label = `${loc.address}, ${loc.city}, ${loc.state}`;
                return (
                  <Option key={loc.id} value={loc.id} label={label}>
                    {label}
                  </Option>
                );
              })}
            </Select>
          )}
        </Form.Item>

        <Form.Item
          label="Start Date"
          name="start_date"
          rules={[{ required: true, message: 'Please select start date' }]}
        >
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          label="End Date"
          name="end_date"
          rules={[{ required: true, message: 'Please select end date' }]}
        >
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          label="Time"
          name="time"
          rules={[{ required: true, message: 'Please select time' }]}
        >
          <TimePicker
            format="hh:mm A"
            use12Hours={true}
            style={{ width: '100%' }}
            placeholder="Select time"
          />
        </Form.Item>

        <Form.Item>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 16,
              marginTop: 24,
            }}
          >
            <Button onClick={onCancel}>Cancel</Button>
            <Button type="primary" htmlType="submit">
              {editingEvent ? 'Update Event' : 'Add Event'}
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddEventModal;
