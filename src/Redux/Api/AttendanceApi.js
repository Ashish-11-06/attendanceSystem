import axiosInstance from "../axiosInstance";

const attendanceAPIs = {
  fetchAttendance: ({eventId,unitId}) =>
    axiosInstance.post('/management/event-unit-attendance/', {
      event: eventId,
      unit: unitId,
    }),
};

export default attendanceAPIs;
