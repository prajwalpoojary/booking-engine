import useBookingStore from '../../store/bookingStore';
import SearchStep from './steps/SearchStep';
import RoomStep from './steps/RoomStep';
import AddonStep from './steps/AddonStep';
import GuestDetailsStep from './steps/GuestDetailsStep';
import PaymentStep from './steps/PaymentStep';
import ConfirmationStep from './steps/ConfirmationStep';

const steps = [
    { id: 1, label: 'Search' },
    { id: 2, label: 'Rooms' },
    { id: 3, label: 'Addons' },
    { id: 4, label: 'Details' },
    { id: 5, label: 'Payment' },
    { id: 6, label: 'Confirmation' },
];

function StepIndicator() {
    const currentStep = useBookingStore(state => state.currentStep);
    const property = useBookingStore(state => state.property);

    // Step 3 is conditional — skip it in indicator if no addons
    const visibleSteps = steps.filter(s =>
        s.id !== 3 || property?.hasAddons
    );

    return (
        <div className="flex items-center justify-center gap-2 py-6 px-4">
            {visibleSteps.map((step, index) => (
                <div key={step.id} className="flex items-center gap-2">
                    <div className={`
                        flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold
                        ${currentStep === step.id
                            ? 'bg-blue-600 text-white'
                            : currentStep > step.id
                                ? 'bg-green-500 text-white'
                                : 'bg-gray-200 text-gray-500'}
                    `}>
                        {currentStep > step.id ? '✓' : index + 1}
                    </div>
                    <span className={`text-sm hidden sm:block
                        ${currentStep === step.id ? 'text-blue-600 font-medium' : 'text-gray-400'}
                    `}>
                        {step.label}
                    </span>
                    {index < visibleSteps.length - 1 && (
                        <div className={`w-8 h-0.5 
                            ${currentStep > step.id ? 'bg-green-500' : 'bg-gray-200'}
                        `} />
                    )}
                </div>
            ))}
        </div>
    );
}

function BookingPage() {
    const currentStep = useBookingStore(state => state.currentStep);
    const property = useBookingStore(state => state.property);

    const renderStep = () => {
        switch (currentStep) {
            case 1: return <SearchStep />;
            case 2: return <RoomStep />;
            case 3: return property?.hasAddons ? <AddonStep /> : <GuestDetailsStep />;
            case 4: return <GuestDetailsStep />;
            case 5: return <PaymentStep />;
            case 6: return <ConfirmationStep />;
            default: return <SearchStep />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow-sm">
                <div className="max-w-3xl mx-auto px-4 py-4">
                    <h1 className="text-2xl font-bold text-blue-600">StayFinder</h1>
                </div>
            </header>

            <main className="max-w-3xl mx-auto px-4 py-6">
                <StepIndicator />
                <div className="bg-white rounded-2xl shadow-sm p-6 mt-2">
                    {renderStep()}
                </div>
            </main>
        </div>
    );
}

export default BookingPage;