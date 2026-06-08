import {useParams} from 'react-router-dom';
import { properties } from '../../data/properties';

function PropertyDetailsPage() {
    const { id } = useParams();
    const property = properties.find(p => p.id === parseInt(id));
    if (!property) {
        return (
            <div>
                <h1>Property Not Found</h1>
                <p>The property you are looking for does not exist.</p>
            </div>
        );
    }

    return (
        <div>
            <h1>Property Details</h1>
            <h2>{property.name}</h2>
            <p>{property.location}</p>
            <img
                src={property.image}
                alt={property.name}
                className="w-full h-64 object-cover rounded-lg"
                onError={(e) => {
                    e.target.src = 'https://placehold.co/600x400/e2e8f0/6b7280?text=Image+Not+Available';
                    e.target.alt = 'Image not available';
                }}
            />
        </div>
    );
}

export default PropertyDetailsPage;