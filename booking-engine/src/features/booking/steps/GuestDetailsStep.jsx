import { useState } from 'react';
import useBookingStore from '../../../store/bookingStore';

function GuestDetailsStep() {
    const property = useBookingStore(state => state.property);
    const selectedRoom = useBookingStore(state => state.selectedRoom);
    const selectedAddons = useBookingStore(state => state.selectedAddons);
    const checkIn = useBookingStore(state => state.checkIn);
    const checkOut = useBookingStore(state => state.checkOut);
    const adults = useBookingStore(state => state.adults);
    const children = useBookingStore(state => state.children);
    const guestDetails = useBookingStore(state => state.guestDetails);
    const setGuestDetails = useBookingStore(state => state.setGuestDetails);
    const getTotalAmount = useBookingStore(state => state.getTotalAmount);
    const nextStep = useBookingStore(state => state.nextStep);
    const prevStep = useBookingStore(state => state.prevStep);

    const [errors, setErrors] = useState({});

    const numberOfNights = checkIn && checkOut
        ? Math.max(0, Math.floor(
            (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24)
          ))
        : 0;

    const totalAmount = getTotalAmount();

    const validate = () => {
        const newErrors = {};
        if (!guestDetails.name.trim())
            newErrors.name = 'Name is required';
        if (!guestDetails.email.trim())
            newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(guestDetails.email))
            newErrors.email = 'Enter a valid email';
        if (!guestDetails.phone.trim())
            newErrors.phone = 'Phone is required';
        else if (!/^\d{10}$/.test(guestDetails.phone.replace(/\s/g, '')))
            newErrors.phone = 'Enter a valid 10-digit phone number';
        return newErrors;
    };

    const handleNext = () => {
        const newErrors = validate();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        nextStep();
    };

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800">
                Your Details
            </h2>

            {/* Booking Summary */}
            <div className="bg-blue-50 rounded-xl p-4 space-y-2 text-sm">
                <p className="font-medium text-blue-800">{property?.name}</p>
                <div className="text-blue-600 space-y-1">
                    <p>{selectedRoom?.name} · {numberOfNights} night{numberOfNights > 1 ? 's' : ''}</p>
                    <p>
                        {checkIn} → {checkOut} ·
                        {adults} adult{adults > 1 ? 's' : ''}
                        {children > 0 ? ` · ${children} child${children > 1 ? 'ren' : ''}` : ''}
                    </p>
                    {selectedAddons.length > 0 && (
                        <p>{selectedAddons.map(a => a.name).join(', ')}</p>
                    )}
                </div>
                <div className="border-t border-blue-200 pt-2 flex justify-between">
                    <span className="font-medium text-blue-800">Total Amount</span>
                    <span className="font-bold text-blue-900">
                        ₹{totalAmount.toLocaleString()}
                    </span>
                </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
                {/* Name */}
                <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                        Full Name
                    </label>
                    <input
                        type="text"
                        placeholder="John Doe"
                        value={guestDetails.name}
                        onChange={e => {
                            setGuestDetails({ name: e.target.value });
                            setErrors(prev => ({ ...prev, name: '' }));
                        }}
                        className={`
                            w-full border rounded-lg px-3 py-2 text-sm
                            focus:outline-none focus:ring-2 focus:ring-blue-500
                            ${errors.name ? 'border-red-400' : 'border-gray-300'}
                        `}
                    />
                    {errors.name && (
                        <p className="text-red-500 text-xs">{errors.name}</p>
                    )}
                </div>

                {/* Email */}
                <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                        Email Address
                    </label>
                    <input
                        type="email"
                        placeholder="john@example.com"
                        value={guestDetails.email}
                        onChange={e => {
                            setGuestDetails({ email: e.target.value });
                            setErrors(prev => ({ ...prev, email: '' }));
                        }}
                        className={`
                            w-full border rounded-lg px-3 py-2 text-sm
                            focus:outline-none focus:ring-2 focus:ring-blue-500
                            ${errors.email ? 'border-red-400' : 'border-gray-300'}
                        `}
                    />
                    {errors.email && (
                        <p className="text-red-500 text-xs">{errors.email}</p>
                    )}
                </div>

                {/* Phone */}
                <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                        Phone Number
                    </label>
                    <input
                        type="tel"
                        placeholder="9876543210"
                        value={guestDetails.phone}
                        onChange={e => {
                            setGuestDetails({ phone: e.target.value });
                            setErrors(prev => ({ ...prev, phone: '' }));
                        }}
                        className={`
                            w-full border rounded-lg px-3 py-2 text-sm
                            focus:outline-none focus:ring-2 focus:ring-blue-500
                            ${errors.phone ? 'border-red-400' : 'border-gray-300'}
                        `}
                    />
                    {errors.phone && (
                        <p className="text-red-500 text-xs">{errors.phone}</p>
                    )}
                </div>

                {/* Message */}
                <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                        Special Requests
                        <span className="text-gray-400 font-normal ml-1">(optional)</span>
                    </label>
                    <textarea
                        placeholder="Any special requests or notes..."
                        value={guestDetails.message}
                        onChange={e => setGuestDetails({ message: e.target.value })}
                        rows={3}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                </div>
            </div>

            {/* Navigation */}
            <div className="flex gap-3 pt-2">
                <button
                    onClick={prevStep}
                    className="flex-1 border border-gray-300 text-gray-700 font-semibold py-3 rounded-xl hover:bg-gray-50 transition-colors"
                >
                    ← Back
                </button>
                <button
                    onClick={handleNext}
                    className="flex-grow bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors"
                >
                    Continue to Payment →
                </button>
            </div>
        </div>
    );
}

export default GuestDetailsStep;