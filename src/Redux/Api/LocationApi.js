import axiosInstance from "../axiosInstance";

const locationAPIs = {

  getAllLocations: () => axiosInstance.get("/management/locations/"),

};

export default locationAPIs;
