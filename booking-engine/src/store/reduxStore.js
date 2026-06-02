import { configureStore } from '@reduxjs/toolkit';
import hotelsReducer from './hotelsSlice';

const reduxStore = configureStore({
    reducer: {
        hotels: hotelsReducer,
    },
});

export default reduxStore;