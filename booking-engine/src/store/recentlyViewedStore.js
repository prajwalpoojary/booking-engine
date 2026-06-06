import { create } from 'zustand';

const useRecentlyViewedStore = create((set) => ({
    hotels: [],
    addHotel: (hotel) =>
        set((state) => {
            const exists = state.hotels.some(h => h.id === hotel.id);
            if (exists) return state;
            return { hotels: [hotel, ...state.hotels].slice(0, 10) };
        }),
    clearHotels: () => set({ hotels: [] }),
}));

export default useRecentlyViewedStore;
