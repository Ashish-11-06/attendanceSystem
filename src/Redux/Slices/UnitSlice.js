import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import unitAPIs from '../Api/UnitApi';

// Thunk to fetch all units
export const fetchAllUnits = createAsyncThunk(
  'units/fetchAll',
  async (_, thunkAPI) => {
    try {
      const response = await unitAPIs.getAllUnits();
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Thunk to add a new event
export const addUnit = createAsyncThunk(
  'units/addUnit',
  async (newUnit, thunkAPI) => {
    try {
      const response = await unitAPIs.addUnit(newUnit);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

const unitSlice = createSlice({
  name: 'units',
  initialState: {
    units: [],
    loading: false,
    error: null,
  },
  reducers: {
    // Add local reducers here if needed
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllUnits.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllUnits.fulfilled, (state, action) => {
        state.loading = false;
        state.units = action.payload;
      })
      .addCase(fetchAllUnits.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
    //   ----------------------------------------
       .addCase(addUnit.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addUnit.fulfilled, (state, action) => {
        state.loading = false;
        state.units.push(action.payload); 
      })
      .addCase(addUnit.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default unitSlice.reducer;
