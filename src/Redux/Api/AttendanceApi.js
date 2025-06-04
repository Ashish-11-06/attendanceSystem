  // Api/AttendanceApi.js
  import axiosInstance from "../axiosInstance";

  const attendanceAPIs = {
 fetchAttendance: (id) =>
  axiosInstance.post('/management/event-unit-attendance/', {
    id: id,
  }),


  };

  export default attendanceAPIs;
