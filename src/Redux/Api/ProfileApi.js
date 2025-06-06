import axiosInstance from '../axiosInstance';

const updateProfile = (userType, id, data) => {
  const endpoint =
    userType === 'admin'
      ? `/management/admins/${id}/`
      : `/management/units/${id}/`;
  return axiosInstance.put(endpoint, data);
};

export default {
  updateProfile,
};
