import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setProperty, setSearchDetails, setChildren, nextStep } from '../../../store/bookingStore';
import { properties } from '../../../data/properties';

interface Property {
  id: number;
  name: string;
  location: string;
  image: string;
  hasAddons: boolean;
}

interface BookingStateSlice {
  property: Property | null;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  childrenAges: string[];
  promoCode: string;
}

function SearchStep() {
  const dispatch = useDispatch();
  // Using individual selectors with type assertions
  const property = useSelector((state: any) => state.booking.property) as Property | null;
  const checkIn = useSelector((state: any) => state.booking.checkIn) as string;
  const checkOut = useSelector((state: any) => state.booking.checkOut) as string;
  const adults = useSelector((state: any) => state.booking.adults) as number;
  const children = useSelector((state: any) => state.booking.children) as number;
  const childrenAges = useSelector((state: any) => state.booking.childrenAges) as string[];
  const promoCode = useSelector((state: any) => state.booking.promoCode) as string;

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!property) newErrors.property = 'Please select a property';
    if (!checkIn) newErrors.checkIn = 'Please select check-in date';
    if (!checkOut) newErrors.checkOut = 'Please select check-out date';
    if (checkIn && checkOut && new Date(checkIn) >= new Date(checkOut))
      newErrors.checkOut = 'Check-out must be after check-in';
    return newErrors;
  };

  const handleNext = () => {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    dispatch(nextStep());
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">Find Your Stay</h2>

      {/* Property Selection */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Select Property</label>
        <div className="grid grid-cols-1 gap-3">
          {properties.map((p) => (
            <div
              key={p.id}
              onClick={() => dispatch(setProperty(p))}
              className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200
                  ${property?.id === p.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'}`}
            >
              <img src={p.image} alt={p.name} className="w-16 h-16 rounded-lg object-cover" />
              <div>
                <p className="font-medium text-gray-800">{p.name}</p>
                <p className="text-sm text-gray-500">{p.location}</p>
              </div>
              {property?.id === p.id && (
                <div className="ml-auto w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
              )}
            </div>
          ))}
        </div>
        {errors.property && <p className="text-red-500 text-sm">{errors.property}</p>}
      </div>

      {/* Dates */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Check-in</label>
          <input
            type="date"
            min={today}
            value={checkIn}
            onChange={(e) => dispatch(setSearchDetails({ checkIn: e.target.value }))}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.checkIn && <p className="text-red-500 text-sm">{errors.checkIn}</p>}
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Check-out</label>
          <input
            type="date"
            min={checkIn || today}
            value={checkOut}
            onChange={(e) => dispatch(setSearchDetails({ checkOut: e.target.value }))}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.checkOut && <p className="text-red-500 text-sm">{errors.checkOut}</p>}
        </div>
      </div>

      {/* Guests */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Adults</label>
          <select
            value={adults}
            onChange={(e) => dispatch(setSearchDetails({ adults: Number(e.target.value) }))}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {[1, 2, 3, 4].map((n) => (
              <option key={n} value={n}>{n} Adult{n > 1 ? 's' : ''}</option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Children</label>
          <select
            value={children}
            onChange={(e) => dispatch(setChildren(Number(e.target.value)))}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {[0, 1, 2, 3].map((n) => (
              <option key={n} value={n}>
                {n === 0 ? 'No children' : `${n} Child${n > 1 ? 'ren' : ''}`}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Children Ages */}
      {children > 0 && (
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">Children Ages</label>
          <div className="grid grid-cols-3 gap-3">
            {childrenAges.map((age, index) => (
              <div key={index} className="space-y-1">
                <label className="text-xs text-gray-500">Child {index + 1}</label>
                <select
                  value={age}
                  onChange={(e) => {
                    const updated = [...childrenAges];
                    updated[index] = e.target.value;
                    dispatch(setSearchDetails({ childrenAges: updated }));
                  }}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {/* Options as string values from '1' to '17' to match the string array */}
                  {[...Array(17)].map((_, i) => {
                    const val = (i + 1).toString();
                    return (
                      <option key={val} value={val}>
                        {val} yr{val !== '1' ? 's' : ''}
                      </option>
                    );
                  })}
                </select>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Promo Code */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Promo Code (optional)</label>
        <input
          type="text"
          placeholder="Enter promo code"
          value={promoCode}
          onChange={(e) => dispatch(setSearchDetails({ promoCode: e.target.value.toUpperCase() }))}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Next Button */}
      <button
        onClick={handleNext}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors duration-200"
      >
        Continue to Room Selection →
      </button>
    </div>
  );
}

export default SearchStep;