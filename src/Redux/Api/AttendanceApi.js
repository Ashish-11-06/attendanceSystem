import axiosInstance from "../axiosInstance";

const attendanceAPIs = {
  fetchAttendance: (payload) =>
    axiosInstance.post('/management/event-unit-attendance/', payload),

  addAttendance: (data) =>
    axiosInstance.post('/management/attendance/', data),

addAttendanceFile: (formData) => {
  return axiosInstance.post(
    `/management/attendance/attendance-files/`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
}

};

export default attendanceAPIs;
