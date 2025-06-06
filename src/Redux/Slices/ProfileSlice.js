import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import ProfileAPI from '../Api/ProfileApi';

export const updateUserProfile = createAsyncThunk(
  'profile/updateUserProfile',
  async ({ userType, id, profileData }, { rejectWithValue }) => {
    try {
      const response = await ProfileAPI.updateProfile(userType, id, profileData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Update failed');
    }
  }
);

const profileSlice = createSlice({
  name: 'profile',
  initialState: {
    loading: false,
    error: null,
    user: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default profileSlice.reducer;
