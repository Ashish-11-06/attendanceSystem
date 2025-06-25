import axiosInstance from '../axiosInstance';

const authAPIs = {
  login: (payload) => {
    return axiosInstance.post("/management/login/", payload)},

  register: (payload) =>{
    return axiosInstance.post('/management/register/', payload)
    },
  verifyOtp: (payload) =>{ 
    return axiosInstance.post('/management/verify-otp/', payload)

  },
};

export default authAPIs;
