const hotelData = [
    { id: 1, name: "Hotel Sunshine", city: "New York", stars: 4, pricePerNight: 150 },
    { id: 2, name: "Ocean View Resort", city: "Miami", stars: 5, pricePerNight: 250 },
    { id: 3, name: "Mountain Lodge", city: "Denver", stars: 3, pricePerNight: 100 },
    { id: 4, name: "City Center Inn", city: "Chicago", stars: 4, pricePerNight: 120 },
    { id: 5, name: "Desert Palms Inn", city: "Las Vegas", stars: 4, pricePerNight: 180 },
    { id: 6, name: "Forest Retreat", city: "Seattle", stars: 4, pricePerNight: 160 },
    { id: 7, name: "Lakeside Hotel", city: "Minneapolis", stars: 3, pricePerNight: 110 },
];

function useHotelSearch() {
    const [city, setCity] = useState('');
    const [rating, setRating] = useState('All');
    
    const filteredHotels = hotelData
        .filter(h => h.city.toLowerCase().includes(city.toLowerCase()))
        .filter(h => rating === 'All' || h.stars === Number(rating));

    return { city, setCity, rating, setRating, filteredHotels };
}



// where this should go now depends on the overall app structure - it could be part of a larger search page, or a sidebar filter component, etc.
// should i create a separate SearchFilters component that contains the input and select, and then pass the city and rating state up to the parent component? or should i keep it all in one component for simplicity?
// ? if we want to keep the search logic and UI together, we can keep it all in one component. However, if we want to separate concerns and make the code more modular, we can create a SearchFilters component that handles the input and select, and then pass the city and rating state up to the parent component (HotelSearch) which can then use that state to filter the hotels. This would also make it easier to reuse the SearchFilters component in other parts of the app if needed.
// lets do it with a separate SearchFilters component for better separation of concerns and reusability.
function SearchFilters({ city, setCity, rating, setRating }) {
    return (
        <div>
            <input
                value={city}
                onChange={e => setCity(e.target.value)}
                placeholder="Search by city"
            />
            <select value={rating} onChange={e => setRating(e.target.value)}>
                <option value="All">All</option>
                <option value="3">3 Stars</option>
                <option value="4">4 Stars</option>
                <option value="5">5 Stars</option>
            </select>
        </div>
    );
}
            // <input
            //     value={city}
            //     onChange={e => setCity(e.target.value)}
            //     placeholder="Search by city"
            // />
            // <select value={rating} onChange={e => setRating(e.target.value)}>
            //     <option value="All">All</option>
            //     <option value="3">3 Stars</option>
            //     <option value="4">4 Stars</option>
            //     <option value="5">5 Stars</option>
            // </select>

function ResultsCount({ count }) {
    return <p>{count} hotels found</p>;
} 

function HotelSearch({  }) {
    const { city, setCity, rating, setRating, filteredHotels } = useHotelSearch();

    return (
        <>
            <ResultsCount count={filteredHotels.length} />
            <HotelList hotels={filteredHotels} city={city} />
        </>
    );
}
  

function HotelList({ hotels, city }) {
    if (!hotels.length) return <p>No hotels found</p>;

    return (
        <ul>
            {hotels.map(hotel => (
                <HotelCard key={hotel.id} hotel={hotel} city={city} />
            ))}
        </ul>
    );
}

function HotelCard({ hotel, city }) {
    return (
        <li>
            <strong>{hotel.name}</strong> — {hotel.city} — {hotel.stars} Stars — ${hotel.pricePerNight}/night
        </li>
    );
}


function useFetch(url, options = {}) {
    // flag to control whether to fetch or not (useful for conditional fetching)
    const { enabled = true } = options;

    const [hotel, setHotel] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(null);

    useEffect(() => {
        if (!enabled) return;

        // if (!url) return;

        setIsLoading(true);
        setHotel(null);
        setIsError(null);
        
        const controller = new AbortController();

        fetch(url, {
            signal: controller.signal
        })
            .then(res => {
                if (!res.ok) throw new Error('Failed to fetch hotel');
                return res.json();
            })
            .then(data => {
                setHotel(data);
                setIsLoading(false);
            })
            .catch(err => {
                if (err.name === "AbortError") return;
                setIsError(err.message);
                setIsLoading(false);
            });

        return () => controller.abort();
    }, [url, enabled]);

    return { data, isLoading, isError};
}

// domain-specific hook for fetching hotel details
// function useHotel({ hotelId }) {
//     const { data, isLoading, isError } = useFetch(`https://jsonplaceholder.typicode.com/posts/${hotelId}`);
//     return { hotel: data, isLoading, isError };
// }

function HotelDetails({ hotelId }) {
    const { hotel:data, isLoading, isError } = useFetch(`https://jsonplaceholder.typicode.com/posts/${hotelId}`);

    // guard clauses
    if (isLoading) return <p>Loading...</p>;
    if (isError) return `<p>Error: ${error}</p>`;
    if (!hotel) return null;

    return (
        <div>
            <h2>{hotel.title}</h2>
            <p>{hotel.body}</p>
        </div>
    );
}



// BookingPage
//         -- selectedRoom, checkIn, checkOut, guestCount
//   - HotelGallery
//         -- currentImageIndex
//   - PriceSummary
//         -- selectedRoom, checkIn, checkOut - props
//         -- totalPrice, numberOfNights - computed during render
//   - RoomSelector
//         -- selectedRoom, onRoomChange - props
//         -- calls onRoomChange when user selects room
//   - BookingForm
//         -- selectedRoom, checkIn, checkOut - props
//         -- name, email, phone - form-local state
//         -- uses passed data when submitting


function BookingPage({ hotelId }) {
    const [hotel, setHotel] = useState(null);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [checkIn, setCheckIn] = useState(null);
    const [checkOut, setCheckOut] = useState(null);
    const [status, setStatus] = useState('loading'); // 'loading', 'error', 'ready' 

    const numberOfNights = checkIn && checkOut ? (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24) : 0;

    const totalPrice = selectedRoom && numberOfNights ? selectedRoom.pricePerNight * numberOfNights : 0;
    
    useEffect(() => {
        setStatus('loading');
        fetch(`https://jsonplaceholder.typicode.com/posts/${hotelId}`)
            .then(res => {
                if (!res.ok) throw new Error('Failed to fetch hotel');
                return res.json();
            })
            .then(data => {
                setHotel(data);
                setStatus('ready');
            })
            .catch(err => {
                setStatus('error');
            });
    }, [hotelId]);

    if (status === 'loading') return <p>Loading...</p>;
    if (status === 'error') return <p>Error loading hotel details.</p>;
    if (!hotel) return null;

    return (
        <div>
            <HotelGallery images={hotel.images} />
            <RoomSelector 
                rooms={hotel.room} 
                selectedRoom={selectedRoom} 
                onRoomChange={setSelectedRoom} 
            />
            <AvailabilityCalendar 
                checkIn={checkIn} 
                checkOut={checkOut} 
                onDateChange={(checkIn, checkOut) => { 
                    setCheckIn(checkIn); 
                    setCheckOut(checkOut);
                }}
            />
            <PriceSummary 
                totalPrice={totalPrice} 
                numberOfNights={numberOfNights}
                selectedRoom={selectedRoom} 
            />
            <BookingForm 
                selectedRoom={selectedRoom} 
                checkIn={checkIn} 
                checkOut={checkOut} 
            />
        </div>
    );
}


function RoomSelector({ rooms, selectedRoom, onRoomChange }) {
    if (!rooms.length) return <p>No rooms available.</p>;

    return (
        <div>
            <h3>Select a Room</h3>
            <ul>
                {rooms.map(room => {
                    const isSelected = selectedRoom && selectedRoom.id === room.id;
                    return (
                        <li 
                            key={room.id} 
                            onClick={() => onRoomChange(room)} 
                            style={{ 
                                fontWeight: isSelected ? 'bold' : 'normal' ,
                                cursor: 'pointer',
                            }}
                        >
                            {room.name} - ${room.pricePerNight}/night
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}   

function PriceSummary({ totalPrice, numberOfNights, selectedRoom }) {
    if (!selectedRoom) return <p>Select a room to see pricing</p>;
    if (numberOfNights === 0) return `<p>${selectedRoom.name} - Select dates to see total</p>`;

    return (
        <div>
            <h3>Price Summary</h3>
            <p>Room Name: {selectedRoom.name}</p>
            <p>Number of Nights: {numberOfNights}</p>
            <p>Price per Night: ${selectedRoom.pricePerNight.toFixed(2)}/night</p>
            <p>Total Price: ${totalPrice.toFixed(2)}</p>
        </div>
    );
}


function BookingDetail({ selectedRoom, checkIn, checkOut }) {
    const isReady = !!selectedRoom && !!checkIn && !!checkOut;

    const { data: pricing, isLoading} = useFetch(`/api/pricing?room=${selectedRoom?.id}&checkIn=${checkIn}&checkOut=${checkOut}`, 
        { enabled: isReady }
    );

    // const { data } = useFetch(selectedRoom ? `api/rooms/${selectedRoom?.id}/availability` : null);

    if (!isReady) return <p>Select a room, and dates to see pricing.</p>;
    if(isLoading) return <p>Loading pricing...</p>;

    return <PriceSummary pricing={pricing} />
}