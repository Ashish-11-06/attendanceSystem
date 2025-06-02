import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import volinteerAPIs from '../Api/VolinteerApi';

// Thunk to fetch all volinteers
export const fetchAllVolinteer = createAsyncThunk(
  'volinteers/fetchAll',
  async (_, thunkAPI) => {
    try {
      const response = await volinteerAPIs.getAllVolinteers();
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Thunk to add a new event
export const addEvent = createAsyncThunk(
  'volinteers/addEvent',
  async (newEvent, thunkAPI) => {
    try {
      const response = await volinteerAPIs.addEvent(newEvent);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

const volineerSlice = createSlice({
  name: 'volinteers',
  initialState: {
    volinteers: [],
    loading: false,
    error: null,
  },
  reducers: {
    // Add local reducers here if needed
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllVolinteer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllVolinteer.fulfilled, (state, action) => {
        state.loading = false;
        state.volinteers = action.payload;
      })
      .addCase(fetchAllVolinteer.rejected, (state, action) => {
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
        state.volinteers.push(action.payload); 
      })
      .addCase(addEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default volineerSlice.reducer;
