import { BrowserRouter, Routes, Route } from 'react-router-dom';
import BookingPage from './features/booking/BookingPage';
import HomePage from './features/home/HomePage.tsx';
import { ProtectedRoute } from './features/auth/ProtectedRoute';
import { LoginPage } from './features/auth/LoginPage.tsx';
import { PropertyDetailsLayout } from './features/home/PropertyDetailsLayout';
import { PropertyOverview } from './features/home/PropertyOverview';
import { PropertyPhotos } from './features/home/PropertyPhotos';
import { PropertyReviews } from './features/home/PropertyReviews';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route
                    path="/booking"
                    element={
                        <ProtectedRoute>
                            <BookingPage />
                        </ProtectedRoute>
                    }
                />
                {/* Property details with nested routes */}
                <Route
                    path="/property/:id"
                    element={
                        <PropertyDetailsLayout />
                    }
                >
                    <Route index element={<PropertyOverview />} />
                    <Route path="photos" element={<PropertyPhotos />} />
                    <Route path="reviews" element={<PropertyReviews />} />
                </Route>
                {/* Add a catch-all 404 page maybe later */}
            </Routes>
        </BrowserRouter>
    );
}

export default App;
