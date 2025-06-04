import axiosInstance from "../axiosInstance";

const volinteerAPIs = {

  getAllVolinteers: () => axiosInstance.get("/management/volinteers/"),

  updateVolunteer: (id, updatedData) => axiosInstance.put(`/management/volinteers/${id}/`, updatedData),

  addVolunteer: (data) => axiosInstance.post(`/management/volinteers/upload-file/${data.unit_id}/`, data),

};

export default volinteerAPIs;
