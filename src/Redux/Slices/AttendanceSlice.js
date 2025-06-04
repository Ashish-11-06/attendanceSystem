import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import attendanceAPIs from '../Api/AttendanceApi';

export const fetchAttendance = createAsyncThunk(
  'attendance/fetchAttendance',
  async ({ eventId,unitId }, { rejectWithValue }) => {
    try {
      const response = await attendanceAPIs.fetchAttendance({eventId,unitId});
      return response.data;
    } catch (error) {
      console.error(error.response?.data);
      return rejectWithValue(error.response?.data || 'Error fetching attendance');
    }
  }
);

const attendanceSlice = createSlice({
  name: 'attendance',
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearAttendance: (state) => {
      state.data = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAttendance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.data = [];
      });
  },
});

export const { clearAttendance } = attendanceSlice.actions;

export default attendanceSlice.reducer;
