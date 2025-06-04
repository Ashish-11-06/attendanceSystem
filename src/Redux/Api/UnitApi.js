import axiosInstance from "../axiosInstance";

const unitAPIs = {

  getAllUnits: () => axiosInstance.get("/management/units/"),

  addUnit: (newUnit) => axiosInstance.post("/management/units/", newUnit),

  updateUnit: (data) => axiosInstance.put(`/management/units/${data.id}/`, data),

  deleteUnit: (unitId) => axiosInstance.delete(`/management/units/${unitId}/`),

};

export default unitAPIs;
