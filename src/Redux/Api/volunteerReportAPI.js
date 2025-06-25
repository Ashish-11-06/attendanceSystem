import axiosInstance from "../axiosInstance";

const volunteerReportAPI = {
  fetchVolunteerReport: async () => {
    try {
      const response = await axiosInstance.get("/management/volunteer-report/");

      let data = response.data;

      // Normalize the data shape based on common API patterns
      if (data.results && Array.isArray(data.results)) {
        data = data.results;
      } else if (data.data && Array.isArray(data.data)) {
        data = data.data;
      }

      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error("API fetchVolunteerReport error:", error);
      throw error;
    }
  }
};

export default volunteerReportAPI;
