import { create } from 'zustand';

const useRecentlyViewedStore = create((set, get) => ({
    hotels: [],

    addHotel: (hotel) => {
        const current = get().hotels;
        const filtered = current.filter(h => h.id !== hotel.id);
        set({ hotels: [hotel, ...filtered].slice(0, 5) });
    },

    clearAll: () => set({ hotels: [] }),
}));

export default useRecentlyViewedStore;