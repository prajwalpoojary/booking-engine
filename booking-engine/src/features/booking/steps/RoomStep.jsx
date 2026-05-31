import useBookingStore from '../../../store/bookingStore';
import { rooms } from '../../../data/rooms';
import { calculateNights } from '../../../utils/booking';

function RoomStep() {
    const property = useBookingStore(state => state.property);
    const adults = useBookingStore(state => state.adults);
    const children = useBookingStore(state => state.children);
    const checkIn = useBookingStore(state => state.checkIn);
    const checkOut = useBookingStore(state => state.checkOut);
    const selectedRoom = useBookingStore(state => state.selectedRoom);
    const setSelectedRoom = useBookingStore(state => state.setSelectedRoom);
    const nextStep = useBookingStore(state => state.nextStep);
    const prevStep = useBookingStore(state => state.prevStep);

    const numberOfNights = calculateNights(checkIn, checkOut);

    const availableRooms = rooms.filter(r =>
        r.propertyId === property?.id &&
        r.maxAdults >= adults &&
        r.maxChildren >= children
    );

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800">
                Select Your Room
            </h2>

            {/* Stay Summary */}
            <div className="bg-blue-50 rounded-xl p-4 text-sm text-blue-800">
                <p className="font-medium">{property?.name}</p>
                <p className="text-blue-600">
                    {numberOfNights} night{numberOfNights > 1 ? 's' : ''} ·
                    {adults} adult{adults > 1 ? 's' : ''}
                    {children > 0 ? ` · ${children} child${children > 1 ? 'ren' : ''}` : ''}
                </p>
            </div>

            {/* Room List */}
            {availableRooms.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    <p>No rooms available for your guest count.</p>
                    <button
                        onClick={prevStep}
                        className="mt-4 text-blue-600 underline text-sm"
                    >
                        Go back and adjust guests
                    </button>
                </div>
            ) : (
                <div className="space-y-4">
                    {availableRooms.map(room => {
                        const isSelected = selectedRoom?.id === room.id;
                        return (
                            <div
                                key={room.id}
                                onClick={() => setSelectedRoom(room)}
                                className={`
                                    border-2 rounded-xl overflow-hidden cursor-pointer
                                    transition-all duration-200
                                    ${isSelected
                                        ? 'border-blue-500'
                                        : 'border-gray-200 hover:border-gray-300'}
                                `}
                            >
                                <img
                                    src={room.image}
                                    alt={room.name}
                                    className="w-full h-40 object-cover"
                                />
                                <div className="p-4 space-y-3">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className="font-semibold text-gray-800">
                                                {room.name}
                                            </h3>
                                            <p className="text-sm text-gray-500 mt-1">
                                                Up to {room.maxAdults} adults
                                                {room.maxChildren > 0
                                                    ? `, ${room.maxChildren} children`
                                                    : ''}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-gray-900">
                                                ₹{room.pricePerNight.toLocaleString()}
                                            </p>
                                            <p className="text-xs text-gray-500">per night</p>
                                        </div>
                                    </div>

                                    {/* Amenities */}
                                    <div className="flex flex-wrap gap-2">
                                        {room.amenities.map(amenity => (
                                            <span
                                                key={amenity}
                                                className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
                                            >
                                                {amenity}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Total for stay */}
                                    <div className="pt-2 border-t border-gray-100 flex justify-between items-center">
                                        <span className="text-sm text-gray-500">
                                            Total for {numberOfNights} night{numberOfNights > 1 ? 's' : ''}
                                        </span>
                                        <span className="font-semibold text-blue-600">
                                            ₹{(room.pricePerNight * numberOfNights).toLocaleString()}
                                        </span>
                                    </div>

                                    {isSelected && (
                                        <div className="bg-blue-50 text-blue-700 text-sm text-center py-2 rounded-lg font-medium">
                                            ✓ Selected
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Navigation */}
            <div className="flex gap-3 pt-2">
                <button
                    onClick={prevStep}
                    className="flex-1 border border-gray-300 text-gray-700 font-semibold py-3 rounded-xl hover:bg-gray-50 transition-colors"
                >
                    ← Back
                </button>
                <button
                    onClick={nextStep}
                    disabled={!selectedRoom}
                    className={`
                        flex-2 flex-grow font-semibold py-3 rounded-xl transition-colors
                        ${selectedRoom
                            ? 'bg-blue-600 hover:bg-blue-700 text-white'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'}
                    `}
                >
                    Continue →
                </button>
            </div>
        </div>
    );
}

export default RoomStep;