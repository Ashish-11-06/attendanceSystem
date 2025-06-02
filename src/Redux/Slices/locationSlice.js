import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import locationAPIs from '../Api/LocationApi';

// Thunk to fetch all locations
export const fetchAllLocations = createAsyncThunk(
  'locations/fetchAll',
  async (_, thunkAPI) => {
    try {
      const response = await locationAPIs.getAllLocations();
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Thunk to add a new event
export const addEvent = createAsyncThunk(
  'locations/addEvent',
  async (newEvent, thunkAPI) => {
    try {
      const response = await locationAPIs.addEvent(newEvent);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

const locationSlice = createSlice({
  name: 'locations',
  initialState: {
    locations: [],
    loading: false,
    error: null,
  },
  reducers: {
    // Add local reducers here if needed
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllLocations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllLocations.fulfilled, (state, action) => {
        state.loading = false;
        state.locations = action.payload;
      })
      .addCase(fetchAllLocations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
    //   ----------------------------------------
       .addCase(addEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.locations.push(action.payload); 
      })
      .addCase(addEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default locationSlice.reducer;
