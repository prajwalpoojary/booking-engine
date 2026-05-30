import { create } from 'zustand';

const useBookingStore = create((set, get) => ({

    // ─── Step 1: Search ───────────────────────────────
    property: null,
    checkIn: '',
    checkOut: '',
    adults: 1,
    children: 0,
    childrenAges: [],
    promoCode: '',

    // ─── Step 2: Room ─────────────────────────────────
    selectedRoom: null,

    // ─── Step 3: Addons ───────────────────────────────
    selectedAddons: [],

    // ─── Step 4: Guest Details ────────────────────────
    guestDetails: {
        name: '',
        email: '',
        phone: '',
        message: '',
    },

    // ─── Step 5: Payment ──────────────────────────────
    paymentStatus: 'idle', // 'idle' | 'processing' | 'success' | 'failed'

    // ─── Flow Control ─────────────────────────────────
    currentStep: 1,

    // ─── Derived ──────────────────────────────────────
    get numberOfNights() {
        const { checkIn, checkOut } = get();
        if (!checkIn || !checkOut) return 0;
        const diff = new Date(checkOut) - new Date(checkIn);
        return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
    },

    get totalAmount() {
        const { selectedRoom, selectedAddons, numberOfNights } = get();
        if (!selectedRoom || numberOfNights === 0) return 0;
        const roomTotal = selectedRoom.pricePerNight * numberOfNights;
        const addonTotal = selectedAddons.reduce((sum, a) => sum + a.price, 0);
        return roomTotal + addonTotal;
    },

    // ─── Actions ──────────────────────────────────────
    setSearchDetails: (details) => set(details),

    setProperty: (property) => set({
        property,
        selectedRoom: null,
        selectedAddons: [],
    }),

    setChildren: (count) => {
        const currentAges = get().childrenAges;
        set({
            children: count,
            childrenAges: count > currentAges.length
                ? [...currentAges, ...Array(count - currentAges.length).fill('')]
                : currentAges.slice(0, count),
        });
    },

    setSelectedRoom: (room) => set({
        selectedRoom: room,
        selectedAddons: [],
    }),

    toggleAddon: (addon) => {
        const current = get().selectedAddons;
        const exists = current.find(a => a.id === addon.id);
        set({
            selectedAddons: exists
                ? current.filter(a => a.id !== addon.id)
                : [...current, addon],
        });
    },

    setGuestDetails: (details) => set({
        guestDetails: { ...get().guestDetails, ...details },
    }),

    setPaymentStatus: (status) => set({ paymentStatus: status }),

    nextStep: () => set(state => ({ currentStep: state.currentStep + 1 })),
    prevStep: () => set(state => ({ currentStep: state.currentStep - 1 })),
    goToStep: (step) => set({ currentStep: step }),

    resetBooking: () => set({
        property: null,
        checkIn: '',
        checkOut: '',
        adults: 1,
        children: 0,
        childrenAges: [],
        promoCode: '',
        selectedRoom: null,
        selectedAddons: [],
        guestDetails: { name: '', email: '', phone: '', message: '' },
        paymentStatus: 'idle',
        currentStep: 1,
    }),
}));

export default useBookingStore;