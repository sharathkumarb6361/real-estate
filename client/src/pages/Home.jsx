import { Link } from 'react-router-dom';
import { Search, Shield, Users, Star, ArrowRight, MapPin, Bath, Bed, Maximize } from 'lucide-react';
import { useState, useEffect } from 'react';
import { propertyAPI } from '../services/api';
import logo from '../assets/logo.png';

const Home = () => {
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFeaturedProperties();
  }, []);

  const fetchFeaturedProperties = async () => {
    try {
      const response = await propertyAPI.getProperties({ limit: 6, status: 'AVAILABLE' });
      setFeaturedProperties(response.data.properties || []);
      setError(null);
    } catch (error) {
      console.error('Error fetching properties:', error);
      setError('Failed to load properties');
      setFeaturedProperties([]);
    } finally {
      setLoading(false);
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

  return (
    <div className="bg-gray-50">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mx-4 mt-4">
          {error}
        </div>
      )}
      <section className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <img src={logo} alt="EstateHub Logo" className="h-20 w-auto mx-auto mb-6" />
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Find Your Dream Property</h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Discover premium homes, apartments and investment properties in the locations you love.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/properties"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition"
              >
                Explore Properties
              </Link>
              <Link
                to="/contact"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition"
              >
                List Your Property
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 -mt-8 relative z-10">
        <div className="bg-white rounded-xl shadow-xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input
                type="text"
                placeholder="Enter location"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="">All Types</option>
                <option value="APARTMENT">Apartment</option>
                <option value="VILLA">Villa</option>
                <option value="HOUSE">House</option>
                <option value="COMMERCIAL">Commercial</option>
                <option value="PLOT">Plot</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">BHK</label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="">Any</option>
                <option value="1">1 BHK</option>
                <option value="2">2 BHK</option>
                <option value="3">3 BHK</option>
                <option value="4">4 BHK</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="">Any</option>
                <option value="0-5000000">Under ₹50L</option>
                <option value="5000000-10000000">₹50L - ₹1Cr</option>
                <option value="10000000-20000000">₹1Cr - ₹2Cr</option>
                <option value="20000000-999999999">Above ₹2Cr</option>
              </select>
            </div>
            <div className="flex items-end">
              <Link
                to="/properties"
                className="w-full bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition flex items-center justify-center"
              >
                <Search className="h-5 w-5 mr-2" />
                Search
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Featured Properties</h2>
        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProperties.map((property) => (
              <div key={property._id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition">
                <div className="relative">
                  <img
                      src={property.coverImage || property.images?.[0] || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'}
                    alt={property.title}
                    className="w-full h-48 object-cover"
                  />
                  <span className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
                    {property.status}
                  </span>
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
        <div className="text-center mt-8">
          <Link
            to="/properties"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold"
          >
            View All Properties <ArrowRight className="h-5 w-5 ml-2" />
          </Link>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Why Choose EstateHub</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Verified Properties</h3>
              <p className="text-gray-600">All properties are verified for authenticity and legal compliance.</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Trusted Agents</h3>
              <p className="text-gray-600">Work with experienced and certified real estate professionals.</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Easy Search</h3>
              <p className="text-gray-600">Advanced filters to find your perfect property quickly.</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Secure Booking</h3>
              <p className="text-gray-600">Safe and transparent booking process with full documentation.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Popular Locations</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['Mangalore', 'Bangalore', 'Mysore', 'Hubli'].map((location) => (
            <div key={location} className="relative rounded-xl overflow-hidden h-40 cursor-pointer group">
              <img
                src={`https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop`}
                alt={location}
                className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <span className="text-white text-xl font-semibold">{location}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Find a place you'll love to call home</h2>
          <p className="text-xl mb-8 text-blue-100">Join thousands of happy homeowners who found their dream property with EstateHub</p>
          <Link
            to="/properties"
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition"
          >
            Start Your Search
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
