import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import eventAPIs from '../Api/EventApi';

// Thunk to fetch all events
export const fetchAllEvents = createAsyncThunk(
  'events/fetchAll',
  async (_, thunkAPI) => {
    try {
      const response = await eventAPIs.getAllEvents();
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Thunk to add a new event
export const addEvent = createAsyncThunk(
  'events/addEvent',
  async (newEvent, thunkAPI) => {
    try {
      const response = await eventAPIs.addEvent(newEvent);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

const eventSlice = createSlice({
  name: 'events',
  initialState: {
    events: [],
    loading: false,
    error: null,
  },
  reducers: {
    // Add local reducers here if needed
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.events = action.payload;
      })
      .addCase(fetchAllEvents.rejected, (state, action) => {
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
        // state.events.push(action.payload); 
      })
      .addCase(addEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default eventSlice.reducer;
