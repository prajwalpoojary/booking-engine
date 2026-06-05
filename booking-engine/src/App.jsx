import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import BookingPage from './features/booking/BookingPage';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/booking" replace />} />
                <Route path="/booking" element={<BookingPage />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
