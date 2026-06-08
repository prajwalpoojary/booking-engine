import { useParams } from 'react-router-dom';
import { properties } from '../../data/properties';

export const PropertyOverview = () => {
  const { id } = useParams();
  const property = properties.find(p => p.id === parseInt(id));

  if (!property) {
    return <div>Property not found</div>;
  }

  return (
    <div>
      <h2>Overview</h2>
      <p>{property.location}</p>
      <p>This is a beautiful property with great amenities.</p>
    </div>
  );
};