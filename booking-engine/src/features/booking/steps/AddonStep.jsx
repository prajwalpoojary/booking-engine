import useBookingStore from '../../../store/bookingStore';
import { addons } from '../../../data/rooms';

function AddonStep() {
    const property = useBookingStore(state => state.property);
    const selectedAddons = useBookingStore(state => state.selectedAddons);
    const toggleAddon = useBookingStore(state => state.toggleAddon);
    const nextStep = useBookingStore(state => state.nextStep);
    const prevStep = useBookingStore(state => state.prevStep);

    const availableAddons = addons.filter(a => a.propertyId === property?.id);

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-semibold text-gray-800">
                    Extra Services
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                    Optional add-ons for your stay
                </p>
            </div>

            {availableAddons.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                    No add-ons available for this property.
                </p>
            ) : (
                <div className="space-y-3">
                    {availableAddons.map(addon => {
                        const isSelected = selectedAddons.some(a => a.id === addon.id);
                        return (
                            <div
                                key={addon.id}
                                onClick={() => toggleAddon(addon)}
                                className={`
                                    flex items-center justify-between p-4 rounded-xl border-2 
                                    cursor-pointer transition-all duration-200
                                    ${isSelected
                                        ? 'border-blue-500 bg-blue-50'
                                        : 'border-gray-200 hover:border-gray-300'}
                                `}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`
                                        w-5 h-5 rounded-full border-2 flex items-center 
                                        justify-center flex-shrink-0
                                        ${isSelected
                                            ? 'border-blue-500 bg-blue-500'
                                            : 'border-gray-300'}
                                    `}>
                                        {isSelected && (
                                            <span className="text-white text-xs">✓</span>
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-800">
                                            {addon.name}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {addon.description}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right ml-4 flex-shrink-0">
                                    <p className="font-semibold text-gray-900">
                                        ₹{addon.price.toLocaleString()}
                                    </p>
                                    <p className="text-xs text-gray-500">per booking</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Selected summary */}
            {selectedAddons.length > 0 && (
                <div className="bg-green-50 rounded-xl p-4">
                    <p className="text-sm font-medium text-green-800">
                        {selectedAddons.length} add-on{selectedAddons.length > 1 ? 's' : ''} selected
                        · ₹{selectedAddons.reduce((sum, a) => sum + a.price, 0).toLocaleString()} extra
                    </p>
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
                    className="flex-grow bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors"
                >
                    Continue →
                </button>
            </div>
        </div>
    );
}

export default AddonStep;