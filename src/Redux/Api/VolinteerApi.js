import axiosInstance from "../axiosInstance";

const volinteerAPIs = {

  getAllVolinteers: () => axiosInstance.get("/management/volinteers/"),

  updateVolunteer: (id, updatedData) => axiosInstance.put(`/management/volinteers/${id}/`, updatedData),

  addVolunteer: (formData) => {
    // formData should contain both 'file' and 'unit_id'
    const unit_id = formData.get('unit_id');
    return axiosInstance.post(
      `/management/volinteers/upload-file/${unit_id}/`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );
  },

    getVolunteerByUnitId: (id) => axiosInstance.post(`/management/volunteers-by-unit/`, id),

};

export default volinteerAPIs;
