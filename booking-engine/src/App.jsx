import { BrowserRouter, Routes, Route } from 'react-router-dom';
import BookingPage from './features/booking/BookingPage';
import HomePage from './features/home/HomePage';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/booking" element={<BookingPage />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
