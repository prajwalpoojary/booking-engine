import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import BookingPage from './features/booking/BookingPage';

function App() {
    return (
        <BrowserRouter>
            <Routes>
              <Route path="/" element={<BookingPage />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
