import axiosInstance from "../axiosInstance";

const volinteerAPIs = {

  getAllVolinteers: () => axiosInstance.get("/management/volinteers/"),

};

export default volinteerAPIs;
