import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import volunteerReportAPI from "../Api/volunteerReportAPI";

// Async thunk
export const fetchVolunteerReportData = createAsyncThunk(
  "volunteerReport/fetchVolunteerReportData",
  async (_, thunkAPI) => {
    try {
      const data = await volunteerReportAPI.fetchVolunteerReport();
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || "Failed to fetch volunteer report data");
    }
  }
);

const volunteerReportSlice = createSlice({
  name: "volunteerReport",
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchVolunteerReportData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVolunteerReportData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchVolunteerReportData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.data = [];
      });
  },
});

export default volunteerReportSlice.reducer;
