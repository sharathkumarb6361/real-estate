import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { propertyAPI } from '../services/api';
import { MapPin, Bed, Bath, Maximize, Car, X, ArrowLeft } from 'lucide-react';

const Compare = () => {
  const navigate = useNavigate();
  const [compareList, setCompareList] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('compareList');
    if (stored) {
      const list = JSON.parse(stored);
      if (list.length > 3) {
        setCompareList(list.slice(0, 3));
      } else {
        setCompareList(list);
      }
    }
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const stored = localStorage.getItem('compareList');
      if (stored) {
        const list = JSON.parse(stored).slice(0, 3);
        const propertyPromises = list.map(id => propertyAPI.getPropertyById(id));
        const responses = await Promise.all(propertyPromises);
        setProperties(responses.map(r => r.data));
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = (propertyId) => {
    const newList = compareList.filter(id => id !== propertyId);
    setCompareList(newList);
    localStorage.setItem('compareList', JSON.stringify(newList));
    setProperties(properties.filter(p => p._id !== propertyId));
  };

  const formatPrice = (price) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(2)} Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(2)} L`;
    }
    return `₹${price.toLocaleString()}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Link to="/properties" className="flex items-center text-blue-600 hover:text-blue-700 mr-4">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Properties
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Compare Properties</h1>
          </div>
          <span className="text-gray-500">
            {properties.length}/3 properties
          </span>
        </div>

        {properties.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No properties to compare</p>
            <Link
              to="/properties"
              className="inline-block mt-4 text-blue-600 hover:text-blue-700 font-medium"
            >
              Browse Properties
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 w-48">Feature</th>
                    {properties.map((property) => (
                      <th key={property._id} className="px-6 py-4 text-left text-sm font-semibold text-gray-900 min-w-64">
                        <div className="relative">
                          <img
                            src={property.coverImage || property.images?.[0] || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'}
                            alt={property.title}
                            className="w-full h-32 object-cover rounded-lg mb-2"
                          />
                          <button
                            onClick={() => handleRemove(property._id)}
                            className="absolute top-0 right-0 bg-white p-1 rounded-full shadow hover:bg-red-50"
                          >
                            <X className="h-4 w-4 text-red-500" />
                          </button>
                          <p className="font-semibold">{property.title}</p>
                        </div>
                      </th>
                    ))}
                    {properties.length < 3 && (
                      <th className="px-6 py-4 text-center text-sm text-gray-500 min-w-64">
                        <Link
                          to="/properties"
                          className="text-blue-600 hover:text-blue-700"
                        >
                          + Add Property
                        </Link>
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">Price</td>
                    {properties.map((property) => (
                      <td key={property._id} className="px-6 py-4 text-sm text-gray-700">
                        <span className="text-xl font-bold text-blue-600">{formatPrice(property.price)}</span>
                      </td>
                    ))}
                    {properties.length < 3 && <td className="px-6 py-4"></td>}
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">Location</td>
                    {properties.map((property) => (
                      <td key={property._id} className="px-6 py-4 text-sm text-gray-700">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                          {property.location}
                        </div>
                      </td>
                    ))}
                    {properties.length < 3 && <td className="px-6 py-4"></td>}
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">Property Type</td>
                    {properties.map((property) => (
                      <td key={property._id} className="px-6 py-4 text-sm text-gray-700">
                        {property.propertyType}
                      </td>
                    ))}
                    {properties.length < 3 && <td className="px-6 py-4"></td>}
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">BHK</td>
                    {properties.map((property) => (
                      <td key={property._id} className="px-6 py-4 text-sm text-gray-700">
                        {property.bhk} BHK
                      </td>
                    ))}
                    {properties.length < 3 && <td className="px-6 py-4"></td>}
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">Area</td>
                    {properties.map((property) => (
                      <td key={property._id} className="px-6 py-4 text-sm text-gray-700">
                        {property.area} sqft
                      </td>
                    ))}
                    {properties.length < 3 && <td className="px-6 py-4"></td>}
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">Bedrooms</td>
                    {properties.map((property) => (
                      <td key={property._id} className="px-6 py-4 text-sm text-gray-700">
                        <div className="flex items-center">
                          <Bed className="h-4 w-4 mr-1 text-gray-400" />
                          {property.bedrooms}
                        </div>
                      </td>
                    ))}
                    {properties.length < 3 && <td className="px-6 py-4"></td>}
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">Bathrooms</td>
                    {properties.map((property) => (
                      <td key={property._id} className="px-6 py-4 text-sm text-gray-700">
                        <div className="flex items-center">
                          <Bath className="h-4 w-4 mr-1 text-gray-400" />
                          {property.bathrooms}
                        </div>
                      </td>
                    ))}
                    {properties.length < 3 && <td className="px-6 py-4"></td>}
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">Parking</td>
                    {properties.map((property) => (
                      <td key={property._id} className="px-6 py-4 text-sm text-gray-700">
                        <div className="flex items-center">
                          <Car className="h-4 w-4 mr-1 text-gray-400" />
                          {property.parking > 0 ? property.parking : 'N/A'}
                        </div>
                      </td>
                    ))}
                    {properties.length < 3 && <td className="px-6 py-4"></td>}
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">Status</td>
                    {properties.map((property) => (
                      <td key={property._id} className="px-6 py-4 text-sm">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          property.status === 'AVAILABLE' ? 'bg-green-100 text-green-800' :
                          property.status === 'BOOKED' ? 'bg-red-100 text-red-800' :
                          property.status === 'SOLD' ? 'bg-gray-100 text-gray-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {property.status}
                        </span>
                      </td>
                    ))}
                    {properties.length < 3 && <td className="px-6 py-4"></td>}
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">Possession Date</td>
                    {properties.map((property) => (
                      <td key={property._id} className="px-6 py-4 text-sm text-gray-700">
                        {property.possessionDate ? new Date(property.possessionDate).toLocaleDateString() : 'N/A'}
                      </td>
                    ))}
                    {properties.length < 3 && <td className="px-6 py-4"></td>}
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">Action</td>
                    {properties.map((property) => (
                      <td key={property._id} className="px-6 py-4 text-sm">
                        <Link
                          to={`/properties/${property._id}`}
                          className="text-blue-600 hover:text-blue-700 font-medium"
                        >
                          View Details
                        </Link>
                      </td>
                    ))}
                    {properties.length < 3 && <td className="px-6 py-4"></td>}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Compare;
