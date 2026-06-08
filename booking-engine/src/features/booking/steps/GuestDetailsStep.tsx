import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setGuestDetails, nextStep, prevStep, selectTotalAmount } from '../../../store/bookingStore';
import { calculateNights } from '../../../utils/booking';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// Define the guest details interface based on the Redux state
interface GuestDetails {
  name: string;
  email: string;
  phone: string;
  message: string;
}

// Zod schema for guest details validation
const guestDetailsSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Enter a valid email'),
  phone: z.string().regex(/^\d{10}$/, 'Enter a valid 10-digit phone number'),
  message: z.string().optional(), // optional field
});

function GuestDetailsStep() {
  const dispatch = useDispatch();
  const property = useSelector((state: any) => state.booking.property);
  const selectedRoom = useSelector((state: any) => state.booking.selectedRoom);
  const selectedAddons = useSelector((state: any) => state.booking.selectedAddons);
  const checkIn = useSelector((state: any) => state.booking.checkIn);
  const checkOut = useSelector((state: any) => state.booking.checkOut);
  const adults = useSelector((state: any) => state.booking.adults);
  const children = useSelector((state: any) => state.booking.children);
  const guestDetailsFromRedux = useSelector((state: any) => state.booking.guestDetails);
  const totalAmount = useSelector(selectTotalAmount);

  const numberOfNights = calculateNights(checkIn, checkOut);

  // Initialize react-hook-form with Zod resolver and default values from Redux
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<GuestDetails>({
    resolver: zodResolver(guestDetailsSchema),
    defaultValues: {
      name: guestDetailsFromRedux.name || '',
      email: guestDetailsFromRedux.email || '',
      phone: guestDetailsFromRedux.phone || '',
      message: guestDetailsFromRedux.message || '',
    },
    mode: 'onChange', // validate on every change to keep errors updated
  });

  // Watch for form value changes to keep Redux state in sync
  useEffect(() => {
    const unwatch = watch((value) => {
      // Dispatch the updated guest details to Redux
      dispatch(setGuestDetails(value));
    });
    return () => unwatch();
  }, [watch, dispatch]);

  const onSubmit = () => {
    // The data is already validated by Zod and we have been updating Redux via watch
    // So we can just move to the next step
    dispatch(nextStep());
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">Your Details</h2>

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
            <p>{selectedAddons.map((a) => a.name).join(', ')}</p>
          )}
        </div>
        <div className="border-t border-blue-200 pt-2 flex justify-between">
          <span className="font-medium text-blue-800">Total Amount</span>
          <span className="font-bold text-blue-900">₹{totalAmount.toLocaleString()}</span>
        </div>
      </div>

      {/* Form Fields */}
      <div className="space-y-4">
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">Full Name</label>
          <input
            type="text"
            placeholder="John Doe"
            {...register('name')}
            className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500
                ${errors.name ? 'border-red-400' : 'border-gray-300'}`}
          />
          {errors.name && <p className="text-red-500 text-xs">{errors.name?.message}</p>}
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">Email Address</label>
          <input
            type="email"
            placeholder="john@example.com"
            {...register('email')}
            className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500
                ${errors.email ? 'border-red-400' : 'border-gray-300'}`}
          />
          {errors.email && <p className="text-red-500 text-xs">{errors.email?.message}</p>}
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">Phone Number</label>
          <input
            type="tel"
            placeholder="9876543210"
            {...register('phone')}
            className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500
                ${errors.phone ? 'border-red-400' : 'border-gray-300'}`}
          />
          {errors.phone && <p className="text-red-500 text-xs">{errors.phone?.message}</p>}
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Special Requests <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <textarea
            placeholder="Any special requests or notes..."
            {...register('message')}
            rows={3}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>
      </div>

      {/* Navigation */}
      <div className="flex gap-3 pt-2">
        <button
          onClick={() => dispatch(prevStep())}
          className="flex-1 border border-gray-300 text-gray-700 font-semibold py-3 rounded-xl hover:bg-gray-50 transition-colors"
        >
          ← Back
        </button>
        <button
          onClick={handleSubmit(onSubmit)}
          className="flex-grow bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors"
        >
          Continue to Payment →
        </button>
      </div>
    </div>
  );
}

export default GuestDetailsStep;