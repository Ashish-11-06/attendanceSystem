import React, { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  TimePicker,
  Button,
  message,
  Spin,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  addEvent,
  updateEvent,
  fetchAllEvents,
} from "../../Redux/Slices/EventSlice";
import { fetchAllLocations, addLocation } from "../../Redux/Slices/locationSlice";
import { fetchAllUnits } from "../../Redux/Slices/UnitSlice";
import dayjs from "dayjs";
import statesData from "../../data/states.json";
import citiesData from "../../data/cities.json";

const { Option } = Select;

const AddEventModal = ({ visible, onCancel, form, editingEvent }) => {
  const dispatch = useDispatch();
  const { locations, loading } = useSelector((state) => state.locations);
  const { units } = useSelector((state) => state.units);

  const [selectedLocations, setSelectedLocations] = useState([]);
  const [unitsByLocation, setUnitsByLocation] = useState({});
  // Add state for location modal
  const [isLocationModalVisible, setIsLocationModalVisible] = useState(false);
  const [locationForm] = Form.useForm();
  const [selectedStateId, setSelectedStateId] = useState(null);
  const [cityOptions, setCityOptions] = useState([]);

  // Prepare state and city options for the modal (same as LocationList)
  const indianStates = statesData.filter(state => state.country_name === 'India');
  const filteredCities = citiesData.filter(city => city.state_id === selectedStateId);

  useEffect(() => {
    dispatch(fetchAllUnits());
  }, [dispatch]);

  useEffect(() => {
    if (visible && locations.length === 0) {
      dispatch(fetchAllLocations());
    }
  }, [visible, dispatch, locations.length]);

  useEffect(() => {
    if (visible && editingEvent) {
      const locationIds =
        editingEvent.locations?.map((loc) =>
          String(loc.location_id || loc.id)
        ) || [];
      form.setFieldsValue({
        eventName: editingEvent.event_name,
        locations: locationIds,
        start_date: dayjs(editingEvent.start_date),
        end_date: dayjs(editingEvent.end_date),
        time: dayjs(editingEvent.time, "HH:mm:ss"),
        units:
          editingEvent.locations?.reduce((acc, loc) => {
            // Always use array of string ids for selected units
            let unitArr = [];
            if (Array.isArray(loc.units)) {
              unitArr = loc.units.map(unit =>
                String(unit.unit_id || unit.id)
              );
            } else if (Array.isArray(loc.unit)) {
              unitArr = loc.unit.map(unitId => String(unitId));
            }
            acc[String(loc.location_id || loc.id)] = unitArr;
            return acc;
          }, {}) || {},
      });
      setSelectedLocations(locationIds);
    } else if (!visible) {
      form.resetFields();
      setSelectedLocations([]);
    }
  }, [visible, editingEvent, form, units]);

  useEffect(() => {
    const newUnitsByLocation = {};
    selectedLocations.forEach((locId) => {
      newUnitsByLocation[locId] = units;
    });
    setUnitsByLocation(newUnitsByLocation);
  }, [selectedLocations, units]);

  const handleLocationChange = (value) => {
    const stringValues = value.map(String);
    setSelectedLocations(stringValues);
    const currentUnits = form.getFieldValue("units") || {};
    const filteredUnits = Object.fromEntries(
      Object.entries(currentUnits).filter(([locId]) =>
        stringValues.includes(locId)
      )
    );
    form.setFieldsValue({ units: filteredUnits });
  };

  // Open location modal
  const handleAddLocation = () => {
    setIsLocationModalVisible(true);
    locationForm.resetFields();
  };

  // Handle location modal submit
  const handleLocationModalOk = async () => {
    try {
      const values = await locationForm.validateFields();
      // Convert state id to state name before sending to backend
      const selectedState = indianStates.find(state => state.id === values.state);
      const payload = {
        address: values.address,
        state: selectedState ? selectedState.name : "",
        city: values.city,
      };
      const res = await dispatch(addLocation(payload));
      if (res.meta.requestStatus === "fulfilled") {
        message.success("Location added!");
        setIsLocationModalVisible(false);
        dispatch(fetchAllLocations());
      } else {
        throw new Error("Failed to add location");
      }
    } catch (err) {
      if (err.errorFields) return; // validation error
      message.error(err.message || "Error adding location");
    }
  };

  const handleLocationModalCancel = () => {
    setIsLocationModalVisible(false);
  };

  const onFinish = async () => {
    const rawValues = form.getFieldsValue(true);
    let locationsArray = [];
    if (Array.isArray(rawValues.locations)) {
      locationsArray = rawValues.locations.map((locIdOrObj) => {
        let locEntry;
        let locKey;
        if (typeof locIdOrObj === "string" || typeof locIdOrObj === "number") {
          const locId = parseInt(locIdOrObj, 10);
          locKey = String(locId);
          const unitIds = rawValues.units?.[locKey] || [];
          locEntry = {
            location_id: locId,
            unit: unitIds, // array of string ids
          };
        }
        return locEntry;
      });
    }
    const eventData = {
      event_name: rawValues.eventName,
      locations: locationsArray,
      start_date: rawValues.start_date.format("YYYY-MM-DD"),
      end_date: rawValues.end_date.format("YYYY-MM-DD"),
      time: rawValues.time.format("HH:mm:ss"),
    };

    try {
      let resultAction;
      if (editingEvent) {
        resultAction = await dispatch(
          updateEvent({ id: editingEvent.event_id, updatedEvent: eventData })
        );
      } else {
        resultAction = await dispatch(addEvent(eventData));
      }

      if (resultAction.meta.requestStatus === "fulfilled") {
        message.success(
          editingEvent ? "Event updated successfully!" : "Event added successfully!"
        );
        form.resetFields();
        onCancel();
        dispatch(fetchAllEvents());
      } else {
        throw new Error(resultAction.payload || "Operation failed");
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  // When state changes in add location modal, update city options
  const handleLocationStateChange = (stateId) => {
    setSelectedStateId(stateId);
    locationForm.setFieldsValue({ city: undefined });
  };

  // Add this handler before the return statement
  const handleUnitsChange = (locId) => (selected) => {
    if (selected.includes("__all__")) {
      // Select all units for this location
      const allUnitIds = (unitsByLocation[locId] || []).map(u => String(u.id));
      form.setFieldsValue({
        units: {
          ...form.getFieldValue("units"),
          [locId]: allUnitIds,
        }
      });
    } else {
      form.setFieldsValue({
        units: {
          ...form.getFieldValue("units"),
          [locId]: selected,
        }
      });
    }
  };

  return (
    <>
      <Modal
        title={editingEvent ? "Update Event" : "Add New Event"}
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
            rules={[{ required: true, message: "Please enter event name" }]}
          >
            <Input placeholder="Enter event name" />
          </Form.Item>

          <Form.Item
            label={
              editingEvent ? (
                "Location(s)"
              ) : (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span>Location(s)</span>
                  <Button type="link" size="small" onClick={handleAddLocation}>
                    + Add Location
                  </Button>
                </div>
              )
            }
            name="locations"
            rules={[
              { required: true, message: "Please select at least one location" },
            ]}
          >
            {/* Only show the button above, no add location form */}
            {loading ? (
              <Spin />
            ) : (
              <Select
                mode="multiple"
                showSearch
                placeholder="Select location(s)"
                optionFilterProp="label"
                onChange={handleLocationChange}
                value={selectedLocations}
                filterOption={(input, option) =>
                  option?.label?.toLowerCase().includes(input.toLowerCase())
                }
              >
                {locations.map((loc) => {
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

          {selectedLocations.length > 0 &&
            selectedLocations.map((locId) => {
              const locationObj = locations.find((l) => String(l.id) === locId);
              const unitsForLocation = unitsByLocation[locId] || [];
              if (!locationObj) return null;
              return (
                <Form.Item
                  key={locId}
                  label={`Unit(s) for ${locationObj.address}, ${locationObj.city}, ${locationObj.state}`}
                  name={["units", String(locId)]}
                >
                  <Select
                    mode="multiple"
                    placeholder="Select unit(s)"
                    allowClear
                    maxTagCount="responsive"
                    optionLabelProp="children"
                    onChange={handleUnitsChange(String(locId))}
                  >
                    <Option key="__all__" value="__all__">
                      Select All Units
                    </Option>
                    {unitsForLocation.map((unit) => (
                      <Option
                        key={unit.id}
                        value={String(unit.id)}
                      >
                        {`${unit.unit_id} - ${unit.unit_name}`}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              );
            })}

          <Form.Item
            label="Start Date"
            name="start_date"
            rules={[{ required: true, message: "Please select start date" }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            label="End Date"
            name="end_date"
            rules={[{ required: true, message: "Please select end date" }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            label="Time"
            name="time"
            rules={[{ required: true, message: "Please select time" }]}
          >
            <TimePicker
              format="hh:mm A"
              use12Hours
              style={{ width: "100%" }}
              placeholder="Select time"
            />
          </Form.Item>

          <Form.Item>
            <div style={{ display: "flex", justifyContent: "center", gap: 16 }}>
              <Button onClick={onCancel}>Cancel</Button>
              <Button type="primary" htmlType="submit">
                {editingEvent ? "Update Event" : "Add Event"}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>

      {/* Location Modal */}
      <Modal
        title="Add Location"
        open={isLocationModalVisible}
        onOk={handleLocationModalOk}
        onCancel={handleLocationModalCancel}
        okText="Add"
        destroyOnClose
      >
        <Form form={locationForm} layout="vertical">
          <Form.Item
            label="Address"
            name="address"
            rules={[{ required: true, message: "Please enter address" }]}
          >
            <Input placeholder="Enter address" />
          </Form.Item>
          <Form.Item
            label="State"
            name="state"
            rules={[{ required: true, message: "Please select state" }]}
          >
            <Select
              showSearch
              placeholder="Select a state"
              optionFilterProp="children"
              onChange={handleLocationStateChange}
            >
              {indianStates.map((state) => (
                <Option key={state.id} value={state.id}>
                  {state.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="City"
            name="city"
            rules={[{ required: true, message: "Please select city" }]}
          >
            <Select
              showSearch
              placeholder="Select a city"
              optionFilterProp="children"
              disabled={!locationForm.getFieldValue("state")}
            >
              {filteredCities.map((city) => (
                <Option key={city.id} value={city.name}>
                  {city.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};



export default AddEventModal;
