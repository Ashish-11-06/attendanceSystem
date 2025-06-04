import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import attendanceUploadApi from '../Api/attendanceUploadApi';

export const uploadAttendanceFile = createAsyncThunk(
  'attendanceUpload/uploadFile',
  async (formData, { rejectWithValue }) => {
    try {
      const data = await attendanceUploadApi.uploadAttendanceFileApi(formData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const attendanceUploadSlice = createSlice({
  name: 'attendanceUpload',
  initialState: {
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    clearUploadStatus: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadAttendanceFile.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(uploadAttendanceFile.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(uploadAttendanceFile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Upload failed';
      });
  },
});

export const { clearUploadStatus } = attendanceUploadSlice.actions;

export default attendanceUploadSlice.reducer;
