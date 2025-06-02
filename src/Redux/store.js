import { configureStore } from '@reduxjs/toolkit';
import eventReducer from './Slices/EventSlice';
import locationReducer from './Slices/locationSlice';

export const store = configureStore({
  reducer: {
    events: eventReducer,
    locations: locationReducer, 
  },
});
