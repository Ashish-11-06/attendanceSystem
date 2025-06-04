import axiosInstance from "../axiosInstance";

const volinteerAPIs = {

  getAllVolinteers: () => axiosInstance.get("/management/volinteers/"),

  updateVolunteer: (id, updatedData) => axiosInstance.put(`/management/volinteers/${id}/`, updatedData),

  addVolunteer: (data) => axiosInstance.post(`/management/volinteers/upload-file/${data.unit_id}/`, data),

  getVolunteerByUnitId: (id) => axiosInstance.post(`/management/volunteers-by-unit/`, id),

};

export default volinteerAPIs;
