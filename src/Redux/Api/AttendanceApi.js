import axiosInstance from "../axiosInstance";

const attendanceAPIs = {
  fetchAttendance: (payload) =>
    axiosInstance.post('/management/event-unit-attendance/', payload),
};

export default attendanceAPIs;
