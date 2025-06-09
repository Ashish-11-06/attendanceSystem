import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchAttendanceReport } from "../Api/AttendanceReportApi";

// Async thunk
export const getAttendanceReport = createAsyncThunk(
  "attendanceReport/fetch",
  async (id=1, { rejectWithValue }) => {
    try {
      const data = await fetchAttendanceReport(id);
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
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAttendanceReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAttendanceReport.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(getAttendanceReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearAttendanceReport } = attendanceReportSlice.actions;
export default attendanceReportSlice.reducer;
