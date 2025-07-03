import axiosInstance from "../axiosInstance";
import { addKhetra } from "../Slices/UnitSlice";

const unitAPIs = {
  getAllUnits: () => axiosInstance.get("/management/units/"),

  addUnit: (newUnit) => axiosInstance.post("/management/units/", newUnit),

  updateUnit: (data) => axiosInstance.put(`/management/units/${data.id}/`, data),

  deleteUnit: (unitId) => axiosInstance.delete(`/management/units/${unitId}/`),

  addKhetra: () => axiosInstance.get("/management/khetras/"),
  addNewKhetra: (data) => axiosInstance.post("/management/khetras/", data),
  
};

export default unitAPIs;
