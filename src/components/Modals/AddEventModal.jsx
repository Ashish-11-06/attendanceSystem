import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, DatePicker, TimePicker, Button, message, Spin } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { addEvent, fetchAllEvents } from '../../Redux/Slices/EventSlice';
import { fetchAllLocations } from '../../Redux/Slices/locationSlice';

const { Option } = Select;

const AddEventModal = ({ visible, onCancel, form }) => {
    const dispatch = useDispatch();
    const { locations, loading } = useSelector((state) => state.locations);

    useEffect(() => {
        if (locations.length === 0) {
            dispatch(fetchAllLocations());
        }
    }, [dispatch, locations]);

    const onFinish = async (values) => {
        const eventData = {
            event_id: 1,
            event_name: values.eventName,
            location: values.location,
            start_date: values.start_date.format('YYYY-MM-DD'),
            end_date: values.end_date.format('YYYY-MM-DD'),
            time: values.time.format('HH:mm:ss'),
        };

        try {
            const resultAction = await dispatch(addEvent(eventData));
            if (addEvent.fulfilled.match(resultAction)) {
                message.success('Event added successfully!')
                form.resetFields();
                onCancel();
                await dispatch(fetchAllEvents());
            } else {
                throw new Error(resultAction.payload || 'Failed to add event');
            }
        } catch (error) {
            message.error(error.message || 'Error adding event');
        }
    };

    return (
        <Modal
            title="Add New Event"
            open={visible}
            onCancel={onCancel}
            footer={null}
            centered
            destroyOnClose
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                name="add_event_form"
            >
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
                            mode="multiple"  // ✅ Allow multiple selection
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
                    rules={[{ required: true, message: 'Please select date' }]}
                >
                    <DatePicker style={{ width: '100%' }} />
                </Form.Item>
                 <Form.Item
                    label="End Date"
                    name="end_date"
                    rules={[{ required: true, message: 'Please select date' }]}
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
                            Add Event
                        </Button>
                    </div>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default AddEventModal;
