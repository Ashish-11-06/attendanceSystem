import axiosInstance from "../axiosInstance";

const attendanceAPIs = {
  fetchAttendance: (payload) =>
    axiosInstance.post('/management/event-unit-attendance/', payload),

  addAttendance: (data) =>
    axiosInstance.post('/management/attendance/', data),
};

export default attendanceAPIs;
