import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { wishlistAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Heart, MapPin, Bed, Bath, Maximize, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const Wishlist = () => {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchWishlist();
    }
  }, [user]);

  const fetchWishlist = async () => {
    try {
      const response = await wishlistAPI.getWishlist();
      setWishlist(response.data.properties || []);
    } catch (error) {
      toast.error('Failed to fetch wishlist');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromWishlist = async (propertyId) => {
    try {
      await wishlistAPI.removeFromWishlist(propertyId);
      setWishlist(wishlist.filter(p => p._id !== propertyId));
      toast.success('Removed from wishlist');
    } catch (error) {
      toast.error('Failed to remove from wishlist');
    }
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
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Wishlist</h1>

        {wishlist.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Your wishlist is empty</p>
            <Link
              to="/properties"
              className="inline-block mt-4 text-blue-600 hover:text-blue-700 font-medium"
            >
              Browse Properties
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlist.map((property) => (
              <div key={property._id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition">
                <div className="relative">
                  <img
                    src={property.coverImage || property.images?.[0] || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'}
                    alt={property.title}
                    className="w-full h-48 object-cover"
                  />
                  <button
                    onClick={() => handleRemoveFromWishlist(property._id)}
                    className="absolute top-4 right-4 bg-white p-2 rounded-full shadow hover:bg-red-50"
                  >
                    <Trash2 className="h-5 w-5 text-red-500" />
                  </button>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{property.title}</h3>
                  <div className="flex items-center text-gray-600 mb-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span className="text-sm">{property.location}</span>
                  </div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl font-bold text-blue-600">{formatPrice(property.price)}</span>
                    <span className="text-sm text-gray-500">{property.propertyType}</span>
                  </div>
                  <div className="flex items-center justify-between text-gray-600 text-sm mb-4">
                    <div className="flex items-center">
                      <Bed className="h-4 w-4 mr-1" />
                      <span>{property.bedrooms} Beds</span>
                    </div>
                    <div className="flex items-center">
                      <Bath className="h-4 w-4 mr-1" />
                      <span>{property.bathrooms} Baths</span>
                    </div>
                    <div className="flex items-center">
                      <Maximize className="h-4 w-4 mr-1" />
                      <span>{property.area} sqft</span>
                    </div>
                  </div>
                  <Link
                    to={`/properties/${property._id}`}
                    className="block w-full bg-blue-600 text-white text-center py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
