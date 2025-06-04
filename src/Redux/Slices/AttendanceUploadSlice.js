// Redux/Slices/AttendanceSlice.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const uploadAttendanceFile = createAsyncThunk(
  'attendance/uploadFile',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/management/attendance-files/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
