import { configureStore } from '@reduxjs/toolkit';
import eventReducer from './Slices/EventSlice';
import locationReducer from './Slices/locationSlice';
import unitReducer from './Slices/UnitSlice';
import volinteerReducer from './Slices/VolinteerSlice';
import attendanceReducer from './Slices/AttendanceSlice';
import dashboardReducer from './Slices/dashboardSlice';
import profileReducer from './Slices/ProfileSlice';

export const store = configureStore({
  reducer: {
    events: eventReducer,
    locations: locationReducer, 
    units: unitReducer,
    volinteers: volinteerReducer,
    dashboard: dashboardReducer,
    attendance: attendanceReducer,
     profile: profileReducer,
  },
});
