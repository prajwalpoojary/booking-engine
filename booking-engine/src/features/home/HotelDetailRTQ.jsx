import { useState } from 'react';
import { useHotel } from '../../hooks/useHotelQuery';

function HotelDetailRTQ() {
    const [hotelId, setHotelId] = useState(1);
    const { data: hotel, isLoading, error, isFetching } = useHotel(hotelId);

    return (
        <div className="bg-white rounded-2xl p-6 space-y-4 border border-gray-200">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Hotel Detail (TanStack Query)</h2>
                {isFetching && !isLoading && (
                    <span className="text-xs text-blue-500">Refreshing...</span>
                )}
            </div>

            {/* Hotel ID Selector */}
            <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(id => (
                    <button
                        key={id}
                        onClick={() => setHotelId(id)}
                        className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors
                            ${hotelId === id
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        Hotel {id}
                    </button>
                ))}
            </div>

            {isLoading && <p className="text-gray-500">Loading...</p>}
            {error && <p className="text-red-500">Error: {error.message}</p>}
            {hotel && (
                <div className="space-y-2">
                    <h3 className="font-semibold text-gray-800">{hotel.name}</h3>
                    <p className="text-sm text-gray-500">{hotel.city} · {hotel.stars} Stars</p>
                    <p className="text-blue-600 font-medium">
                        ₹{hotel.pricePerNight.toLocaleString()}/night
                    </p>
                    <p className="text-sm text-gray-600">{hotel.description}</p>
                </div>
            )}
        </div>
    );
}

export default HotelDetailRTQ;