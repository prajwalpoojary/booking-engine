import { useQuery } from '@tanstack/react-query';

const fetchHotelById = async (hotelId) => {
    const res = await fetch(
        `https://jsonplaceholder.typicode.com/posts/${hotelId}`
    );
    if (!res.ok) throw new Error('Failed to fetch hotel');
    const data = await res.json();
    return {
        id: data.id,
        name: data.title.slice(0, 40),
        description: data.body,
        city: ['Mumbai', 'Delhi', 'Bangalore', 'Chennai'][data.id % 4],
        stars: (data.id % 3) + 3,
        pricePerNight: (data.id * 500) + 2000,
    };
};

export function useHotel(hotelId) {
    return useQuery({
        queryKey: ['hotel', hotelId],
        queryFn: () => fetchHotelById(hotelId),
        enabled: !!hotelId,
    });
}