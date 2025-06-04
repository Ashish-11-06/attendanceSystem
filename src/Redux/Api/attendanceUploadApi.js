// Api/attendanceUploadApi.js
import axiosInstance from "../axiosInstance";

const uploadAttendanceFileApi = async (formData) => {
  const response = await axiosInstance.post('/management/attendance-files/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export default {
  uploadAttendanceFileApi,
};
