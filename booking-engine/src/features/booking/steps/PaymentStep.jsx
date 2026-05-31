import { useState } from 'react';
import useBookingStore from '../../../store/bookingStore';

function PaymentStep() {
    const property = useBookingStore(state => state.property);
    const selectedRoom = useBookingStore(state => state.selectedRoom);
    const checkIn = useBookingStore(state => state.checkIn);
    const checkOut = useBookingStore(state => state.checkOut);
    const guestDetails = useBookingStore(state => state.guestDetails);
    const getTotalAmount = useBookingStore(state => state.getTotalAmount);
    const setPaymentStatus = useBookingStore(state => state.setPaymentStatus);
    const nextStep = useBookingStore(state => state.nextStep);
    const prevStep = useBookingStore(state => state.prevStep);

    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvv, setCvv] = useState('');
    const [nameOnCard, setNameOnCard] = useState('');
    const [errors, setErrors] = useState({});
    const [isProcessing, setIsProcessing] = useState(false);

    const totalAmount = getTotalAmount();

    const numberOfNights = checkIn && checkOut
        ? Math.max(0, Math.floor(
            (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24)
          ))
        : 0;

    const formatCardNumber = (value) => {
        const digits = value.replace(/\D/g, '').slice(0, 16);
        return digits.replace(/(.{4})/g, '$1 ').trim();
    };

    const formatExpiry = (value) => {
        const digits = value.replace(/\D/g, '').slice(0, 4);
        if (digits.length >= 2) {
            return digits.slice(0, 2) + '/' + digits.slice(2);
        }
        return digits;
    };

    const validate = () => {
        const newErrors = {};
        if (!nameOnCard.trim())
            newErrors.nameOnCard = 'Name on card is required';
        if (cardNumber.replace(/\s/g, '').length !== 16)
            newErrors.cardNumber = 'Enter a valid 16-digit card number';
        if (!/^\d{2}\/\d{2}$/.test(expiry))
            newErrors.expiry = 'Enter a valid expiry (MM/YY)';
        if (!/^\d{3}$/.test(cvv))
            newErrors.cvv = 'Enter a valid 3-digit CVV';
        return newErrors;
    };

    const handlePayment = async () => {
        const newErrors = validate();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setIsProcessing(true);
        setPaymentStatus('processing');

        // Simulated payment — replace with real gateway later
        await new Promise(resolve => setTimeout(resolve, 2000));

        setIsProcessing(false);
        setPaymentStatus('success');
        nextStep();
    };

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800">
                Payment
            </h2>

            {/* Order Summary */}
            <div className="bg-blue-50 rounded-xl p-4 space-y-2 text-sm">
                <p className="font-medium text-blue-800">{property?.name}</p>
                <p className="text-blue-600">
                    {selectedRoom?.name} · {numberOfNights} night{numberOfNights > 1 ? 's' : ''}
                </p>
                <p className="text-blue-600">Guest: {guestDetails.name}</p>
                <div className="border-t border-blue-200 pt-2 flex justify-between">
                    <span className="font-medium text-blue-800">Total</span>
                    <span className="font-bold text-blue-900">
                        ₹{totalAmount.toLocaleString()}
                    </span>
                </div>
            </div>

            {/* Card Form */}
            <div className="space-y-4">
                {/* Name on Card */}
                <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                        Name on Card
                    </label>
                    <input
                        type="text"
                        placeholder="John Doe"
                        value={nameOnCard}
                        onChange={e => {
                            setNameOnCard(e.target.value);
                            setErrors(prev => ({ ...prev, nameOnCard: '' }));
                        }}
                        className={`
                            w-full border rounded-lg px-3 py-2 text-sm
                            focus:outline-none focus:ring-2 focus:ring-blue-500
                            ${errors.nameOnCard ? 'border-red-400' : 'border-gray-300'}
                        `}
                    />
                    {errors.nameOnCard && (
                        <p className="text-red-500 text-xs">{errors.nameOnCard}</p>
                    )}
                </div>

                {/* Card Number */}
                <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                        Card Number
                    </label>
                    <input
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        value={cardNumber}
                        onChange={e => {
                            setCardNumber(formatCardNumber(e.target.value));
                            setErrors(prev => ({ ...prev, cardNumber: '' }));
                        }}
                        className={`
                            w-full border rounded-lg px-3 py-2 text-sm
                            focus:outline-none focus:ring-2 focus:ring-blue-500
                            ${errors.cardNumber ? 'border-red-400' : 'border-gray-300'}
                        `}
                    />
                    {errors.cardNumber && (
                        <p className="text-red-500 text-xs">{errors.cardNumber}</p>
                    )}
                </div>

                {/* Expiry and CVV */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700">
                            Expiry
                        </label>
                        <input
                            type="text"
                            placeholder="MM/YY"
                            value={expiry}
                            onChange={e => {
                                setExpiry(formatExpiry(e.target.value));
                                setErrors(prev => ({ ...prev, expiry: '' }));
                            }}
                            className={`
                                w-full border rounded-lg px-3 py-2 text-sm
                                focus:outline-none focus:ring-2 focus:ring-blue-500
                                ${errors.expiry ? 'border-red-400' : 'border-gray-300'}
                            `}
                        />
                        {errors.expiry && (
                            <p className="text-red-500 text-xs">{errors.expiry}</p>
                        )}
                    </div>
                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700">
                            CVV
                        </label>
                        <input
                            type="password"
                            placeholder="123"
                            maxLength={3}
                            value={cvv}
                            onChange={e => {
                                setCvv(e.target.value.replace(/\D/g, ''));
                                setErrors(prev => ({ ...prev, cvv: '' }));
                            }}
                            className={`
                                w-full border rounded-lg px-3 py-2 text-sm
                                focus:outline-none focus:ring-2 focus:ring-blue-500
                                ${errors.cvv ? 'border-red-400' : 'border-gray-300'}
                            `}
                        />
                        {errors.cvv && (
                            <p className="text-red-500 text-xs">{errors.cvv}</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <div className="flex gap-3 pt-2">
                <button
                    onClick={prevStep}
                    disabled={isProcessing}
                    className="flex-1 border border-gray-300 text-gray-700 font-semibold py-3 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                    ← Back
                </button>
                <button
                    onClick={handlePayment}
                    disabled={isProcessing}
                    className={`
                        flex-grow font-semibold py-3 rounded-xl transition-colors
                        ${isProcessing
                            ? 'bg-blue-400 text-white cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700 text-white'}
                    `}
                >
                    {isProcessing ? 'Processing...' : `Pay ₹${totalAmount.toLocaleString()}`}
                </button>
            </div>

            <p className="text-xs text-gray-400 text-center">
                This is a demo payment. No real transaction will occur.
            </p>
        </div>
    );
}

export default PaymentStep;