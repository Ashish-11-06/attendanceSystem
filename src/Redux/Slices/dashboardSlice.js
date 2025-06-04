import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchTotalCounts } from '../Api/dashboardAPI';

export const getTotalCounts = createAsyncThunk(
  'dashboard/getTotalCounts',
  async (_, { rejectWithValue }) => {
    try {
      const data = await fetchTotalCounts();
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    counts: {
      events: 0,
      units: 0,
      volunteers: 0,
      locations: 0,
    },
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getTotalCounts.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTotalCounts.fulfilled, (state, action) => {
        state.loading = false;
        // Map API keys to state keys
        state.counts = {
          events: action.payload.total_events,
          units: action.payload.total_units,
          volunteers: action.payload.total_volunteers,
          locations: action.payload.total_locations,
        };
      })
      .addCase(getTotalCounts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default dashboardSlice.reducer;
