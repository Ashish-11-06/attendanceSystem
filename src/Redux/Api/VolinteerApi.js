import axiosInstance from "../axiosInstance";

const volinteerAPIs = {

  getAllVolinteers: () => axiosInstance.get("/management/volinteers/"),

  updateVolunteer: (id, updatedData) => axiosInstance.put(`/management/volinteers/${id}/`, updatedData),

};

export default volinteerAPIs;
