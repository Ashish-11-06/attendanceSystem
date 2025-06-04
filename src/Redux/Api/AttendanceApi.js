import axiosInstance from "../axiosInstance";

const attendanceAPIs = {
  fetchAttendance: (eventId, unitId) =>
    axiosInstance.post('/management/event-unit-attendance/', {
      event_id: eventId,
      unit_id: unitId,
    }),
};

export default attendanceAPIs;
