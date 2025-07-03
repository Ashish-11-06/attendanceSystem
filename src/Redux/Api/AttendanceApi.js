import axiosInstance from "../axiosInstance";

const attendanceAPIs = {
  fetchAttendance: (payload) =>
    axiosInstance.post('/management/event-unit-attendance/', payload),

  addAttendance: (data) =>
    axiosInstance.post('/management/attendance/', data),

  addAttendanceFile: (formData) => {
    return axiosInstance.post(
      `/management/attendance-files/`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
  },

  downloadAttendanceFile: (data) =>
    axiosInstance.post('/management/download-file/', data),

  // Change updateAttendance to accept attendance_id and send to correct endpoint
  // Use PUT for update, but send a single object (not an array) if your backend expects one attendance record at a time
  updateAttendance: (updatedAttendance) => {
  console.log('updated', updatedAttendance);
  const res = axiosInstance.put(`/management/event-unit-attendance/`, updatedAttendance);
  return res;
}

};

export default attendanceAPIs;
