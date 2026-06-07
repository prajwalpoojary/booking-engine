import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk — fetch hotels from API with pagination
export const fetchHotels = createAsyncThunk(
    'hotels/fetchAll',
    async (_, { getState, rejectWithValue }) => {
        const state = getState();
        const currentPage = state.hotels.page;
        const limit = 8;
        try {
            const res = await fetch(
                `https://jsonplaceholder.typicode.com/posts?_page=${currentPage}&_limit=${limit}`
            );
            if (!res.ok) throw new Error('Failed to fetch');
            const data = await res.json();
            // Shape the data to look like hotels
            const formattedData = data.map(item => ({
                id: item.id,
                name: item.title.slice(0, 30),
                city: ['Mumbai', 'Delhi', 'Bangalore', 'Chennai'][item.id % 4],
                stars: (item.id % 3) + 3,
                pricePerNight: (item.id * 500) + 2000,
            }));
            return formattedData;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

// Slice — state + reducers + actions in one place
const hotelsSlice = createSlice({
    name: 'hotels',
    initialState: {
        items: [],
        page: 1,
        status: 'idle', // 'idle' | 'loading' | 'success' | 'error'
        error: null,
        hasMore: true, // Assume we have more until we see a short response
    },
    reducers: {
        // Synchronous actions go here
        clearHotels: (state) => {
            state.items = [];
            state.page = 1;
            state.status = 'idle';
            state.error = null;
            state.hasMore = true;
        },
    },
    extraReducers: (builder) => {
        // Async action states go here
        builder
            .addCase(fetchHotels.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchHotels.fulfilled, (state, action) => {
                state.status = 'success';
                state.items = [...state.items, ...action.payload];
                state.page += 1;
                // If we got fewer items than the limit, we assume no more pages
                state.hasMore = action.payload.length === 8;
            })
            .addCase(fetchHotels.rejected, (state, action) => {
                state.status = 'error';
                state.error = action.payload;
            });
    },
});

export const { clearHotels } = hotelsSlice.actions;
export default hotelsSlice.reducer;