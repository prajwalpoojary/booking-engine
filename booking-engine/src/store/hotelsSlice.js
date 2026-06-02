import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk — fetch hotels from API
export const fetchHotels = createAsyncThunk(
    'hotels/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const res = await fetch(
                'https://jsonplaceholder.typicode.com/posts?_limit=8'
            );
            if (!res.ok) throw new Error('Failed to fetch');
            const data = await res.json();
            // Shape the data to look like hotels
            return data.map(item => ({
                id: item.id,
                name: item.title.slice(0, 30),
                city: ['Mumbai', 'Delhi', 'Bangalore', 'Chennai'][item.id % 4],
                stars: (item.id % 3) + 3,
                pricePerNight: (item.id * 500) + 2000,
            }));
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
        status: 'idle', // 'idle' | 'loading' | 'success' | 'error'
        error: null,
    },
    reducers: {
        // Synchronous actions go here
        clearHotels: (state) => {
            state.items = [];
            state.status = 'idle';
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        // Async action states go here
        builder
            .addCase(fetchHotels.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchHotels.fulfilled, (state, action) => {
                state.status = 'success';
                state.items = action.payload;
            })
            .addCase(fetchHotels.rejected, (state, action) => {
                state.status = 'error';
                state.error = action.payload;
            });
    },
});

export const { clearHotels } = hotelsSlice.actions;
export default hotelsSlice.reducer;