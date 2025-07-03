import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import attendanceAPIs from '../Api/AttendanceApi';

export const fetchAttendance = createAsyncThunk(
  'attendance/fetchAttendance',
  async (values, { rejectWithValue }) => {
    try {
      const response = await attendanceAPIs.fetchAttendance(values);
      return response.data;
    } catch (error) {
      console.error(error.response?.data);
      return rejectWithValue(error.response?.data || 'Error fetching attendance');
    }
  }
);

export const addAttendance = createAsyncThunk(
  'attendance/addAttendance',
  async (values, { rejectWithValue }) => {
    try {
      const response = await attendanceAPIs.addAttendance(values);
      return response.data;
    } catch (error) {
      console.error(error.response?.data);
      return rejectWithValue(error.response?.data || 'Error fetching attendance');
    }
  }
);

export const addAttendanceFile = createAsyncThunk(
  'attendance/addAttendanceFile',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await attendanceAPIs.addAttendanceFile(formData);
      return response.data;
    } catch (error) {
      console.error(error.response?.data);
      return rejectWithValue(error.response?.data || 'Error fetching attendance');
    }
  }
);

export const updateAttendance = createAsyncThunk(
  'attendance/updateAttendance',
  async ({ attendance_id, updatedAttendance }, thunkAPI) => {
    try {
      console.log('id', attendance_id);
      
      console.log('slice payload', updatedAttendance);
      
      const response = await attendanceAPIs.updateAttendance( updatedAttendance);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
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
      })
      .addCase(addAttendanceFile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addAttendanceFile.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(addAttendanceFile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.data = [];
      })
      .addCase(updateAttendance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAttendance.fulfilled, (state, action) => {
        state.loading = false;
        // Optionally update attendance state here if needed
      })
      .addCase(updateAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearAttendance } = attendanceSlice.actions;

export default attendanceSlice.reducer;
