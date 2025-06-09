import React, { useEffect, useRef, useState } from "react";
import { Button, Modal, Select, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { getAttendanceReportById } from "../../Redux/Slices/AttendanceReportSlice";
import { fetchAllEvents } from "../../Redux/Slices/EventSlice";
import AttendanceReport from "../../Pages/Attendance_report";

const AttendanceReportModal = () => {
  const dispatch = useDispatch();
  const downloadRef = useRef();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);

  const { events: allEvents, loading: eventsLoading } = useSelector((state) => state.events);

  useEffect(() => {
    dispatch(fetchAllEvents());
  }, [dispatch]);

  const showModal = () => setIsModalOpen(true);

  const handleOk = async () => {
    if (!selectedEvent) {
      return message.warning("Please select an event.");
    }

    try {
      const result = await dispatch(getAttendanceReportById(selectedEvent)).unwrap();

      if (!result || !result.unit_summary || result.unit_summary.length === 0) {
        return message.error("No attendance report found for this event.");
      }

      setSelectedReport(result); 
      setIsModalOpen(false);
    } catch {
      message.error("Failed to fetch the attendance report.");
    }
  };


  useEffect(() => {
    if (selectedReport) {
      setTimeout(() => {
        downloadRef.current?.print();
      }, 300);
    }
  }, [selectedReport]);

  const handleCancel = () => setIsModalOpen(false);

  return (
    <>
      <Button onClick={showModal}>Download Report</Button>

   <Modal
  title="Download Attendance Report"
  open={isModalOpen}
  onCancel={handleCancel}
  footer={[
    <div key="footer" style={{ width: "100%", textAlign: "center" }}>
      <Button onClick={handleCancel} style={{ marginRight: 8 }}>
        Cancel
      </Button>
      <Button type="primary" onClick={handleOk}>
        Download
      </Button>
    </div>
  ]}
>
   <div style={{  marginTop: 24, marginBottom: 8 }}>
  <label style={{ fontWeight: '500' }}>
    Choose Event <span style={{ color: 'red' }}>*</span>
  </label>
  <Select
    showSearch
    placeholder="Choose Event"
    optionFilterProp="children"
    style={{ width: '100%' }}
    value={selectedEvent}
    onChange={setSelectedEvent}
    loading={eventsLoading}
    filterOption={(input, option) =>
      option.children.toLowerCase().includes(input.toLowerCase())
    }
  >
    {allEvents.map((event) => (
      <Select.Option key={event.id} value={event.id}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14 }}>
          <p style={{ margin: 0 }}>{event.event_name || event.name}</p> -{' '}
          <span>
            {event.date || event.start_date
              ? new Date(event.date || event.start_date).toLocaleDateString('en-GB')
              : 'N/A'}
          </span>
        </div>
      </Select.Option>
    ))}
  </Select>
</div>

      </Modal>

      <AttendanceReport ref={downloadRef} report={selectedReport} />
    </>
  );
};

export default AttendanceReportModal;
