import axiosInstance from "../axiosInstance";

export const fetchAttendanceReport = async (id) => {
  const response = await axiosInstance.get(`/management/attendance-report/${id}/`);
  return response.data;
};
