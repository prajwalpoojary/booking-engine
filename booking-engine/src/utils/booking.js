export const calculateNights = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return 0;
    return Math.max(0, Math.floor(
        (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24)
    ));
};

export const generateBookingId = () => {
    return 'BK' + Date.now().toString(36).toUpperCase();
};

export const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
};