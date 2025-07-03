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

export const updateUnit = createAsyncThunk(
  'units/updateUnit',
  async (data, thunkAPI) => {
    console.log("Data in updateUnit thunk:", data);
    try {
      const response = await unitAPIs.updateUnit(data); // Your API endpoint
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || 'Update failed');
    }
  }
);

export const addKhetra = createAsyncThunk(
  'units/addKhetra',
  async (data, thunkAPI) => {
    try {
      const response = await unitAPIs.addKhetra(data); // Your API endpoint
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || 'Add failed');
    }
  }
);

export const addNewKhetra = createAsyncThunk(
  'units/addNewKhetra',
  async (data, thunkAPI) => {
    try {
      const response = await unitAPIs.addNewKhetra(data); // Your API endpoint
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || 'Add failed');
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
      })
      // ----------------------------------------
      .addCase(updateUnit.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUnit.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.units.findIndex(unit => unit.unit_id === action.payload.unit_id);
        if (index !== -1) {
          state.units[index] = action.payload; // Update the existing unit
        }
      })
      .addCase(updateUnit.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ----------------------------------------
      .addCase(addKhetra.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addKhetra.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.units.findIndex(unit => unit.unit_id === action.payload.unit_id);
        if (index !== -1) {
          state.units[index] = action.payload; // Update the existing unit
        }
      })
      .addCase(addKhetra.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

       // ----------------------------------------
      .addCase(addNewKhetra.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addNewKhetra.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.units.findIndex(unit => unit.unit_id === action.payload.unit_id);
        if (index !== -1) {
          state.units[index] = action.payload; // Update the existing unit
        }
      })
      .addCase(addNewKhetra.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });



  },
});

export default unitSlice.reducer;
