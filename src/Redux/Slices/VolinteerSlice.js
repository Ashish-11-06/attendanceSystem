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
export const addVolinteer = createAsyncThunk(
  'volinteers/addvolinteer',
  async (formData, thunkAPI) => {
    try {
      const response = await volinteerAPIs.addVolunteer(formData);
      console.log('addVolinteer response:', response);
      
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Update a volunteer
export const updateVolinteer = createAsyncThunk(
  'volinteers/updateVolinteer',
  async ({ id, data }, thunkAPI) => {
    try {
      const response = await volinteerAPIs.updateVolunteer(id, data);
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
       .addCase(addVolinteer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addVolinteer.fulfilled, (state, action) => {
        state.loading = false;
        // state.volinteers.push(action.payload); 
      })
      .addCase(addVolinteer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      //   ----------------------------------------
       .addCase(updateVolinteer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateVolinteer.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.volinteers.findIndex(v => v.id === action.payload.id);
        if (index !== -1) {
          state.volinteers[index] = action.payload;
        }
      })
      .addCase(updateVolinteer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default volineerSlice.reducer;
