import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { properties } from '../../data/properties';
import { rooms } from '../../data/rooms';
import useBookingStore from '../../store/bookingStore';
import useRecentlyViewedStore from '../../store/recentlyViewedStore';
import HotelListRTK from './HotelListRTK';
import HotelDetailRTQ from './HotelDetailRTQ';

// ─── Search Store (local — only used on this page) ────────────────
function useHotelFilter() {
    const [city, setCity] = useState('');
    const [stars, setStars] = useState('All');

    const filteredProperties = properties.filter(p => {
        const matchesCity = p.location.toLowerCase().includes(city.toLowerCase());
        const propertyRooms = rooms.filter(r => r.propertyId === p.id);
        const minPrice = Math.min(...propertyRooms.map(r => r.pricePerNight));
        const matchesStars = stars === 'All' || minPrice <= Number(stars);
        return matchesCity;
    });

    return { city, setCity, stars, setStars, filteredProperties };
}

// ─── Property Card ─────────────────────────────────────────────────
function PropertyCard({ property }) {
    const navigate = useNavigate();
    const setProperty = useBookingStore(state => state.setProperty);
    const addHotel = useRecentlyViewedStore(state => state.addHotel);

    const propertyRooms = rooms.filter(r => r.propertyId === property.id);
    const minPrice = propertyRooms.length
        ? Math.min(...propertyRooms.map(r => r.pricePerNight))
        : null;

    const handleClick = () => {
        addHotel(property);
        setProperty(property);
        navigate('/booking');
    };

    return (
        <div
            onClick={handleClick}
            className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-shadow duration-200"
        >
            <img
                src={property.image}
                alt={property.name}
                className="w-full h-48 object-cover"
            />
            <div className="p-4 space-y-2">
                <h3 className="font-semibold text-gray-800">{property.name}</h3>
                <p className="text-sm text-gray-500">{property.location}</p>
                {minPrice && (
                    <p className="text-blue-600 font-medium text-sm">
                        From ₹{minPrice.toLocaleString()}/night
                    </p>
                )}
                {property.hasAddons && (
                    <span className="inline-block text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                        Extras available
                    </span>
                )}
            </div>
        </div>
    );
}

// ─── Recently Viewed ───────────────────────────────────────────────
function RecentlyViewed() {
    const hotels = useRecentlyViewedStore(state => state.hotels);
    const navigate = useNavigate();
    const setProperty = useBookingStore(state => state.setProperty);
    const addHotel = useRecentlyViewedStore(state => state.addHotel);

    if (hotels.length === 0) return null;

    const handleClick = (hotel) => {
        addHotel(hotel);
        setProperty(hotel);
        navigate('/booking');
    };

    return (
        <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">
                Recently Viewed
            </h2>
            <div className="flex gap-3 overflow-x-auto pb-2">
                {hotels.map(hotel => (
                    <div
                        key={hotel.id}
                        onClick={() => handleClick(hotel)}
                        className="flex-shrink-0 w-48 bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-shadow"
                    >
                        <img
                            src={hotel.image}
                            alt={hotel.name}
                            className="w-full h-28 object-cover"
                        />
                        <div className="p-3">
                            <p className="font-medium text-sm text-gray-800 truncate">
                                {hotel.name}
                            </p>
                            <p className="text-xs text-gray-500">{hotel.location}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ─── Home Page ─────────────────────────────────────────────────────
function HomePage() {
    const { city, setCity, stars, setStars, filteredProperties } = useHotelFilter();

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="max-w-5xl mx-auto px-4 py-4">
                    <h1 className="text-2xl font-bold text-blue-600">StayFinder</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Find and book your perfect stay
                    </p>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-4 py-8 space-y-8">
                {/* Search and Filter */}
                <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
                    <h2 className="text-lg font-semibold text-gray-800">
                        Search Properties
                    </h2>
                    <div className="flex flex-wrap gap-4">
                        <input
                            type="text"
                            placeholder="Search by city..."
                            value={city}
                            onChange={e => setCity(e.target.value)}
                            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <select
                            value={stars}
                            onChange={e => setStars(e.target.value)}
                            className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="All">All Prices</option>
                            <option value="4000">Under ₹4,000</option>
                            <option value="6000">Under ₹6,000</option>
                            <option value="10000">Under ₹10,000</option>
                        </select>
                    </div>
                </div>

                {/* Recently Viewed */}
                <RecentlyViewed />

                {/* Property Grid */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-gray-800">
                            Available Properties
                        </h2>
                        <p className="text-sm text-gray-500">
                            {filteredProperties.length} found
                        </p>
                    </div>

                    {filteredProperties.length === 0 ? (
                        <div className="bg-white rounded-2xl p-12 text-center text-gray-500">
                            <p>No properties found for "{city}"</p>
                            <button
                                onClick={() => setCity('')}
                                className="mt-3 text-blue-600 text-sm underline"
                            >
                                Clear search
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredProperties.map(property => (
                                <PropertyCard key={property.id} property={property} />
                            ))}
                        </div>
                    )}
                </div>
                {/* Hotels via Redux */}
                <HotelListRTK />
                {/* Hotel Detail via TanStack Query */}
                <HotelDetailRTQ />
            </main>
        </div>
    );
}

export default HomePage;