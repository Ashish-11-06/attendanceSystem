import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchAllAttendanceReports } from "../Api/AttendanceReportApi";

export const getAllAttendanceReports = createAsyncThunk(
  "attendanceReport/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const data = await fetchAllAttendanceReports();
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const attendanceReportSlice = createSlice({
  name: "attendanceReport",
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearAttendanceReport: (state) => {
      state.data = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllAttendanceReports.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllAttendanceReports.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getAllAttendanceReports.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearAttendanceReport } = attendanceReportSlice.actions;
export default attendanceReportSlice.reducer;
