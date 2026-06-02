import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './features/home/HomePage';
import BookingPage from './features/booking/BookingPage';

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
