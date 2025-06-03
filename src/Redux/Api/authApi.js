import axiosInstance from '../axiosInstance';

const authAPIs = {
  login: (payload) => axiosInstance.post("/management/login/", payload),
  register: (payload) => axiosInstance.post('/management/register/', payload),
  verifyOtp: (payload) => axiosInstance.post('/management/verify-otp/', payload),
};

export default authAPIs;
