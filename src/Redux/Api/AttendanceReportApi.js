import axiosInstance from "../axiosInstance";

// Fetch a single report by event ID
export const fetchAttendanceReportById = async (event_id) => {
  if (!event_id) throw new Error("Event ID is required");
  try {
    const response = await axiosInstance.get(`/management/attendance-report/${event_id}/`);
    return {
      event_id,
      unit_summary: response.data.unit_summary || [],
    };
  } catch (error) {
    if (error.response?.status === 404) {
      console.log(`Event ID ${event_id} not found.`);
      return null;
    }
    throw error;
  }
};

// Fetch multiple reports (from event ID 1 to 22)
export const fetchAllAttendanceReports = async () => {
  const reports = [];
  const maxEventId = 22;

  for (let event_id = 1; event_id <= maxEventId; event_id++) {
    try {
      const report = await fetchAttendanceReportById(event_id);
      if (report && report.unit_summary.length > 0) {
        reports.push(report);
      }
    } catch (error) {
      console.warn(`Error at event ID ${event_id}: ${error.message}`);
    }
  }

  return reports;
};
