import { useEffect, useState } from 'react';
import useBookingStore from '../../../store/bookingStore';
import { calculateNights, generateBookingId, formatDate } from '../../../utils/booking';

function ConfirmationStep() {
    const property = useBookingStore(state => state.property);
    const selectedRoom = useBookingStore(state => state.selectedRoom);
    const selectedAddons = useBookingStore(state => state.selectedAddons);
    const checkIn = useBookingStore(state => state.checkIn);
    const checkOut = useBookingStore(state => state.checkOut);
    const adults = useBookingStore(state => state.adults);
    const children = useBookingStore(state => state.children);
    const guestDetails = useBookingStore(state => state.guestDetails);
    const getTotalAmount = useBookingStore(state => state.getTotalAmount);
    const resetBooking = useBookingStore(state => state.resetBooking);

    const [bookingId] = useState(() => generateBookingId());

    const numberOfNights = calculateNights(checkIn, checkOut);
    const totalAmount = getTotalAmount();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="space-y-6">
            {/* Success Header */}
            <div className="text-center space-y-3 py-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-3xl">✓</span>
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                        Booking Confirmed!
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">
                        A confirmation will be sent to {guestDetails.email}
                    </p>
                </div>
                <div className="inline-block bg-blue-50 text-blue-700 px-4 py-2 rounded-xl font-mono font-semibold text-sm">
                    Booking ID: {bookingId}
                </div>
            </div>

            {/* Booking Details */}
            <div className="border border-gray-200 rounded-xl overflow-hidden">
                {/* Property */}
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Property
                    </p>
                    <p className="font-semibold text-gray-800 mt-1">{property?.name}</p>
                    <p className="text-sm text-gray-500">{property?.location}</p>
                </div>

                {/* Stay Details */}
                <div className="px-4 py-3 border-b border-gray-200">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                        Stay Details
                    </p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="text-gray-500">Check-in</p>
                            <p className="font-medium text-gray-800">{formatDate(checkIn)}</p>
                        </div>
                        <div>
                            <p className="text-gray-500">Check-out</p>
                            <p className="font-medium text-gray-800">{formatDate(checkOut)}</p>
                        </div>
                        <div>
                            <p className="text-gray-500">Duration</p>
                            <p className="font-medium text-gray-800">
                                {numberOfNights} night{numberOfNights > 1 ? 's' : ''}
                            </p>
                        </div>
                        <div>
                            <p className="text-gray-500">Guests</p>
                            <p className="font-medium text-gray-800">
                                {adults} adult{adults > 1 ? 's' : ''}
                                {children > 0 ? `, ${children} child${children > 1 ? 'ren' : ''}` : ''}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Room */}
                <div className="px-4 py-3 border-b border-gray-200">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                        Room
                    </p>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-800">{selectedRoom?.name}</span>
                        <span className="text-gray-600">
                            ₹{selectedRoom?.pricePerNight.toLocaleString()} × {numberOfNights} nights
                        </span>
                    </div>
                    <div className="flex justify-between text-sm mt-1">
                        <span></span>
                        <span className="font-medium">
                            ₹{((selectedRoom?.pricePerNight || 0) * numberOfNights).toLocaleString()}
                        </span>
                    </div>
                </div>

                {/* Addons */}
                {selectedAddons.length > 0 && (
                    <div className="px-4 py-3 border-b border-gray-200">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                            Add-ons
                        </p>
                        {selectedAddons.map(addon => (
                            <div key={addon.id} className="flex justify-between text-sm py-1">
                                <span className="text-gray-800">{addon.name}</span>
                                <span className="text-gray-600">
                                    ₹{addon.price.toLocaleString()}
                                </span>
                            </div>
                        ))}
                    </div>
                )}

                {/* Guest Details */}
                <div className="px-4 py-3 border-b border-gray-200">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                        Guest
                    </p>
                    <div className="text-sm space-y-1">
                        <p className="font-medium text-gray-800">{guestDetails.name}</p>
                        <p className="text-gray-500">{guestDetails.email}</p>
                        <p className="text-gray-500">{guestDetails.phone}</p>
                        {guestDetails.message && (
                            <p className="text-gray-500 italic">"{guestDetails.message}"</p>
                        )}
                    </div>
                </div>

                {/* Total */}
                <div className="px-4 py-3 bg-blue-50">
                    <div className="flex justify-between items-center">
                        <span className="font-bold text-gray-800">Total Paid</span>
                        <span className="text-xl font-bold text-blue-600">
                            ₹{totalAmount.toLocaleString()}
                        </span>
                    </div>
                </div>
            </div>

            {/* New Booking Button */}
            <button
                onClick={resetBooking}
                className="w-full border-2 border-blue-600 text-blue-600 font-semibold py-3 rounded-xl hover:bg-blue-50 transition-colors"
            >
                Make Another Booking
            </button>
        </div>
    );
}

export default ConfirmationStep;