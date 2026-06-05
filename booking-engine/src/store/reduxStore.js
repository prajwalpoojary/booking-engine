import { configureStore } from '@reduxjs/toolkit';
import hotelsReducer from './hotelsSlice';
import bookingReducer from './bookingStore';

const reduxStore = configureStore({
    reducer: {
        hotels: hotelsReducer,
        booking: bookingReducer,
    },
});

export default reduxStore;