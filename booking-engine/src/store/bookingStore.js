import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// ─── Async Thunk ──────────────────────────────────
export const submitBooking = createAsyncThunk(
    'booking/submit',
    async (bookingData, { rejectWithValue }) => {
        try {
            const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bookingData),
            });
            if (!response.ok) throw new Error('Submission failed');
            const data = await response.json();
            return data;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

// ─── Initial State ────────────────────────────────
const initialState = {
    // Step 1: Search
    property: null,
    checkIn: '',
    checkOut: '',
    adults: 1,
    children: 0,
    childrenAges: [],
    promoCode: '',

    // Step 2: Room
    selectedRoom: null,

    // Step 3: Addons
    selectedAddons: [],

    // Step 4: Guest Details
    guestDetails: {
        name: '',
        email: '',
        phone: '',
        message: '',
    },

    // Step 5: Payment
    paymentStatus: 'idle',

    // Flow
    currentStep: 1,

    // Submission
    submissionStatus: 'idle',
    submissionError: null,
    bookingId: null,
};

// ─── Slice ────────────────────────────────────────
const bookingSlice = createSlice({
    name: 'booking',
    initialState,
    reducers: {
        setProperty: (state, action) => {
            state.property = action.payload;
            state.selectedRoom = null;
            state.selectedAddons = [];
        },

        setSearchDetails: (state, action) => {
            Object.assign(state, action.payload);
        },

        setChildren: (state, action) => {
            const count = action.payload;
            const currentAges = state.childrenAges;
            state.children = count;
            state.childrenAges =
                count > currentAges.length
                    ? [...currentAges, ...Array(count - currentAges.length).fill('')]
                    : currentAges.slice(0, count);
        },

        setSelectedRoom: (state, action) => {
            state.selectedRoom = action.payload;
            state.selectedAddons = [];
        },

        toggleAddon: (state, action) => {
            const addon = action.payload;
            const exists = state.selectedAddons.find((a) => a.id === addon.id);
            if (exists) {
                state.selectedAddons = state.selectedAddons.filter((a) => a.id !== addon.id);
            } else {
                state.selectedAddons.push(addon);
            }
        },

        setGuestDetails: (state, action) => {
            state.guestDetails = { ...state.guestDetails, ...action.payload };
        },

        setPaymentStatus: (state, action) => {
            state.paymentStatus = action.payload;
        },

        nextStep: (state) => {
            const hasAddons = state.property?.hasAddons;
            // Skip addon step if no addons
            if (state.currentStep === 2 && !hasAddons) {
                state.currentStep = 4;
                return;
            }
            state.currentStep += 1;
        },

        prevStep: (state) => {
            const hasAddons = state.property?.hasAddons;
            // Skip addon step backwards if no addons
            if (state.currentStep === 4 && !hasAddons) {
                state.currentStep = 2;
                return;
            }
            state.currentStep -= 1;
        },

        goToStep: (state, action) => {
            state.currentStep = action.payload;
        },

        resetBooking: () => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(submitBooking.pending, (state) => {
                state.submissionStatus = 'loading';
                state.submissionError = null;
                state.bookingId = null;
            })
            .addCase(submitBooking.fulfilled, (state, action) => {
                state.submissionStatus = 'success';
                state.bookingId = action.payload.id;
            })
            .addCase(submitBooking.rejected, (state, action) => {
                state.submissionStatus = 'error';
                state.submissionError = action.payload;
            });
    },
});

// ─── Exports ──────────────────────────────────────
export const {
    setProperty,
    setSearchDetails,
    setChildren,
    setSelectedRoom,
    toggleAddon,
    setGuestDetails,
    setPaymentStatus,
    nextStep,
    prevStep,
    goToStep,
    resetBooking,
} = bookingSlice.actions;

// ═══ Selectors ═════════════════════════════════════
export const selectBooking = (state) => state.booking;

export const selectNumberOfNights = (state) => {
    const { checkIn, checkOut } = state.booking;
    if (!checkIn || !checkOut) return 0;
    return Math.max(0, Math.floor(
        (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24)
    ));
};

export const selectTotalAmount = (state) => {
    const { selectedRoom, selectedAddons } = state.booking;
    const nights = selectNumberOfNights(state);
    if (!selectedRoom || nights === 0) return 0;
    const roomTotal = selectedRoom.pricePerNight * nights;
    const addonTotal = selectedAddons.reduce((sum, a) => sum + (a.price || 0), 0);
    return roomTotal + addonTotal;
};

export default bookingSlice.reducer;
