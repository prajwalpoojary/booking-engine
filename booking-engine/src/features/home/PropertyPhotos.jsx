import { useParams } from 'react-router-dom';
import { properties } from '../../data/properties';

export const PropertyPhotos = () => {
  const { id } = useParams();
  const property = properties.find(p => p.id === parseInt(id));

  if (!property) {
    return <div>Property not found</div>;
  }

  // Mock photo URLs
  const photos = [
    property.image,
    'https://placehold.co/600x400/e2e8f0/1e293b?text=Photo+2',
    'https://placehold.co/600x400/e2e8f0/1e293b?text=Photo+3',
  ];

  return (
    <div>
      <h2>Photos</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {photos.map((photo, index) => (
          <img
            key={index}
            src={photo}
            alt={`${property.name} photo ${index + 1}`}
            className="w-full h-48 object-cover rounded-lg"
          />
        ))}
      </div>
    </div>
  );
};