import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchAttendanceReportById } from "../Api/AttendanceReportApi";

export const getAttendanceReportById = createAsyncThunk(
  "attendanceReport/fetchByEventId",
  async (event_id, thunkAPI) => {
    try {
      return await fetchAttendanceReportById(event_id);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

const attendanceReportSlice = createSlice({
  name: "attendanceReport",
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAttendanceReportById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAttendanceReportById.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getAttendanceReportById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default attendanceReportSlice.reducer;
