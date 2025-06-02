import axiosInstance from "../axiosInstance";

const unitAPIs = {

  getAllUnits: () => axiosInstance.get("/management/units/"),

  addUnit: (newUnit) => axiosInstance.post("/management/units/", newUnit),

  updateUnit: (unitId, updatedUnit) => axiosInstance.put(`/management/units/${unitId}/`, updatedUnit),

  deleteUnit: (unitId) => axiosInstance.delete(`/management/units/${unitId}/`),

};

export default unitAPIs;
