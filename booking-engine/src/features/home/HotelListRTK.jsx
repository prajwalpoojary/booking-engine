import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchHotels, clearHotels } from '../../store/hotelsSlice';

function HotelListRTK() {
    const dispatch = useDispatch();
    const { items, status, error, hasMore } = useSelector(state => state.hotels);

    // Load initial hotels
    useEffect(() => {
        dispatch(fetchHotels());
        return () => dispatch(clearHotels());
    }, [dispatch]);

    // Load more when near bottom (simple scroll detection)
    useEffect(() => {
        if (status === 'success' && hasMore) {
            const handleScroll = () => {
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                const windowHeight = window.innerHeight;
                const bodyHeight = document.body.offsetHeight;

                // Trigger load more when within 200px of bottom
                if (scrollTop + windowHeight >= bodyHeight - 200) {
                    dispatch(fetchHotels());
                }
            };

            window.addEventListener('scroll', handleScroll);
            return () => window.removeEventListener('scroll', handleScroll);
        }
    }, [status, hasMore, dispatch]);

    if (status === 'loading' && items.length === 0) return <p>Loading hotels...</p>;
    if (status === 'error') return <p>Error: {error}</p>;

    return (
        <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">
                Hotels (via Redux)
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {items.map(hotel => (
                    <div
                        key={hotel.id}
                        className="bg-white rounded-xl p-4 border border-gray-200"
                    >
                        <p className="font-medium text-gray-800">{hotel.name}</p>
                        <p className="text-sm text-gray-500">{hotel.city}</p>
                        <p className="text-sm text-green-600">
                            {hotel.stars} stars
                        </p>
                        <p className="text-blue-600 font-medium mt-1">
                            ₹{hotel.pricePerNight.toLocaleString()}/night
                        </p>
                    </div>
                ))}
            </div>
            {hasMore && status === 'success' && (
                <div className="text-center py-4">
                    <p className="text-sm text-gray-500">
                        Scroll down to load more hotels...
                    </p>
                </div>
            )}
        </div>
    );
}

export default HotelListRTK;