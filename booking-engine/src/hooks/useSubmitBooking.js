import { useMutation } from "@tanstack/react-query";

const submitBooking = async (bookingData) => {
    const res = await fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(bookingData)
    });
    if (!res.ok) throw new Error('Failed to submit booking');
    return res.json();
}

export const useSubmitBooking = () => {
    return useMutation({ mutationFn: submitBooking });
}