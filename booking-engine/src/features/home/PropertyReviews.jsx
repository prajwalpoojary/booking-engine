import { useParams } from 'react-router-dom';
import { properties } from '../../data/properties';

export const PropertyReviews = () => {
  const { id } = useParams();
  const property = properties.find(p => p.id === parseInt(id));

  if (!property) {
    return <div>Property not found</div>;
  }

  // Mock reviews
  const reviews = [
    {
      id: 1,
      user: 'John Doe',
      rating: 5,
      comment: 'Amazing stay! Highly recommend.',
    },
    {
      id: 2,
      user: 'Jane Smith',
      rating: 4,
      comment: 'Great location and clean rooms.',
    },
    {
      id: 3,
      user: 'Bob Wilson',
      rating: 3,
      comment: 'Decent, but could be better.',
    },
  ];

  return (
    <div>
      <h2>Reviews</h2>
      {reviews.length === 0 ? (
        <p>No reviews yet.</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="border p-4 rounded-lg">
              <div className="flex justify-between">
                <h3 className="font-semibold">{review.user}</h3>
                <div className="text-yellow-400">
                  {'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}
                </div>
              </div>
              <p className="mt-2 text-gray-600">{review.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};