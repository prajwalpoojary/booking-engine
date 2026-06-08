import { Outlet, Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { properties } from '../../data/properties';

export const PropertyDetailsLayout = () => {
  const { id } = useParams();
  const property = properties.find(p => p.id === parseInt(id));

  if (!property) {
    return <div>Property not found</div>;
  }

  return (
    <div>
      <h1>{property.name}</h1>
      <nav className="border-b border-gray-200 pb-2">
        <Link to={`/property/${id}`} className="mr-4 hover:text-indigo-600">
          Overview
        </Link>
        <Link to={`/property/${id}/photos`} className="mr-4 hover:text-indigo-600">
          Photos
        </Link>
        <Link to={`/property/${id}/reviews`} className="hover:text-indigo-600">
          Reviews
        </Link>
      </nav>

      <Outlet />
    </div>
  );
};