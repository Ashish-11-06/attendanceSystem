import axiosInstance from "../axiosInstance";

const locationAPIs = {

  getAllLocations: () => axiosInstance.get("/management/locations/"),

  addLocation: (newLocation) => axiosInstance.post("/management/locations/", newLocation),

};

export default locationAPIs;
