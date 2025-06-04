// src/api/dashboardApi.js
import axiosInstance from "../axiosInstance";

export const fetchTotalCounts = async () => {
  const response = await axiosInstance.get('/management/total-count/');
  return response.data; // Should return: { events: 23, units: 8, volunteers: 150, locations: 5 }
};