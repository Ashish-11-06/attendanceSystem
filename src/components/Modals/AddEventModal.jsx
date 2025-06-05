import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, DatePicker, TimePicker, Button, message, Spin } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { addEvent, updateEvent, fetchAllEvents } from '../../Redux/Slices/EventSlice';
import { fetchAllLocations } from '../../Redux/Slices/locationSlice';

import dayjs from 'dayjs';
import { fetchAllUnits } from '../../Redux/Slices/UnitSlice';

const { Option } = Select;

const AddEventModal = ({ visible, onCancel, form, editingEvent }) => {
  const dispatch = useDispatch();
  const { locations, loading } = useSelector((state) => state.locations);
  const { units } = useSelector((state) => state.units); // Fetch units from the store

  const [selectedLocations, setSelectedLocations] = useState([]);
  const [unitsByLocation, setUnitsByLocation] = useState({});

  // Fetch all units when the component mounts
  useEffect(() => {
    dispatch(fetchAllUnits());
  }, [dispatch]);

  // Fetch units when selectedLocations changes
  useEffect(() => {
    const fetchAllUnitsForLocations = () => {
      const newUnitsByLocation = { ...unitsByLocation };
      for (const locId of selectedLocations) {
        if (!newUnitsByLocation[locId]) {
          // Filter units for the selected location
          newUnitsByLocation[locId] = units.filter(unit => !Object.values(newUnitsByLocation).flat().includes(unit.id));
        }
      }
      // Remove units for unselected locations
      Object.keys(newUnitsByLocation).forEach((locId) => {
        if (!selectedLocations.includes(locId)) {
          delete newUnitsByLocation[locId];
        }
      });
      setUnitsByLocation(newUnitsByLocation);
    };

    if (selectedLocations.length > 0) {
      fetchAllUnitsForLocations();
    } else {
      setUnitsByLocation({});
    }
  }, [selectedLocations, units]);

  const safeLocations = Array.isArray(locations) ? locations : [];

  useEffect(() => {
    if (visible && locations.length === 0) {
      dispatch(fetchAllLocations());
    }
  }, [visible, dispatch, locations.length]);

  useEffect(() => {
    if (visible && editingEvent) {
      form.setFieldsValue({
        eventName: editingEvent.event_name,
        location: Array.isArray(editingEvent.location)
          ? editingEvent.location.map((loc) => String(loc.id))
          : [],
        start_date: dayjs(editingEvent.start_date),
        end_date: dayjs(editingEvent.end_date),
        time: dayjs(editingEvent.time, 'HH:mm:ss'),
        units: Array.isArray(editingEvent.location)
          ? editingEvent.location.reduce((acc, loc) => {
              acc[String(loc.id)] = Array.isArray(loc.units)
                ? loc.units.map((unit) => String(unit.id))
                : [];
              return acc;
            }, {})
          : {},
      });
      setSelectedLocations(
        Array.isArray(editingEvent.location)
          ? editingEvent.location.map((loc) => String(loc.id))
          : []
      );
    } else if (!visible) {
      form.resetFields();
      setSelectedLocations([]);
    }
  }, [visible, editingEvent, form]);

  const handleLocationChange = (value) => {
    const stringValues = value.map(String);
    setSelectedLocations(stringValues);
    const currentUnits = form.getFieldValue('units') || {};
    const filteredUnits = Object.fromEntries(
      Object.entries(currentUnits).filter(([locId]) => stringValues.includes(locId))
    );
    form.setFieldsValue({ units: filteredUnits });
  };

  const onFinish = async (values) => {
    // Transform values.location and values.units to the requested format
    const locationsArray = (values.location || []).map((locId) => {
      const unitStrings = (values.units && values.units[locId]) || [];
      // Filter out 'none' or any invalid values
      const unitIds = unitStrings.filter(u => u !== 'none').map(u => parseInt(u, 10));
      return {
        location_id: parseInt(locId, 10),
        unit: unitIds,
      };
    });

    const eventData = {
      event_name: values.eventName,
      locations: locationsArray,
      start_date: values.start_date.format('YYYY-MM-DD'),
      end_date: values.end_date.format('YYYY-MM-DD'),
      time: values.time.format('HH:mm:ss'),
    };

    console.log('eventData', eventData);

    try {
      let resultAction;
      if (editingEvent) {
        resultAction = await dispatch(updateEvent({ id: editingEvent.id, updatedEvent: eventData }));
      } else {
        resultAction = await dispatch(addEvent(eventData));
      }

      console.log('resultAction', resultAction);
      
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
              onChange={handleLocationChange}
              value={selectedLocations}
            >
              {safeLocations.map((loc) => {
                const label = `${loc.address}, ${loc.city}, ${loc.state}`;
                return (
                  <Option key={loc.id} value={String(loc.id)} label={label}>
                    {label}
                  </Option>
                );
              })}
            </Select>
          )}
        </Form.Item>

        {/* Unit fields for each selected location */}
        {selectedLocations.length > 0 && selectedLocations.map((locId) => {
          const locationObj = safeLocations.find((l) => String(l.id) === String(locId));
          const unitsForLocation = unitsByLocation[locId] || [];
          if (!locationObj) return null;
          return (
            <Form.Item
              key={locId}
              label={`Unit(s) for ${locationObj.address}, ${locationObj.city}, ${locationObj.state}`}
              name={['units', locId]}
            >
              <Select
                mode="multiple"
                placeholder={unitsForLocation.length === 0 ? "No units found" : "Select unit(s)"}
                optionFilterProp="children"
                disabled={unitsForLocation.length === 0}
                allowClear
              >
                <Option key="none" value="none">None</Option>
                {unitsForLocation.map((unit) => (
                  <Option key={unit.id} value={String(unit.id)}>
                    {unit.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          );
        })}

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

