import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { propertyAPI } from '../services/api';
import { MapPin, Bed, Bath, Maximize, Car, Heart, ArrowUpDown, Grid, List } from 'lucide-react';
import toast from 'react-hot-toast';

const Properties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [filters, setFilters] = useState({
    location: '',
    propertyType: '',
    bhk: '',
    minPrice: '',
    maxPrice: '',
    minArea: '',
    maxArea: '',
    bedrooms: '',
    bathrooms: '',
    parking: '',
    status: '',
    sortBy: 'createdAt',
    order: 'desc'
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchProperties();
  }, [filters, page]);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const response = await propertyAPI.getProperties({ ...filters, page });
      setProperties(response.data.properties);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      toast.error('Failed to fetch properties');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setPage(1);
  };

  const handleSort = (sortBy) => {
    setFilters(prev => ({
      ...prev,
      sortBy,
      order: prev.sortBy === sortBy && prev.order === 'desc' ? 'asc' : 'desc'
    }));
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">All Properties</h1>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input
                type="text"
                name="location"
                value={filters.location}
                onChange={handleFilterChange}
                placeholder="Search location"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
              <select
                name="propertyType"
                value={filters.propertyType}
                onChange={handleFilterChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
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
              <select
                name="bhk"
                value={filters.bhk}
                onChange={handleFilterChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Any</option>
                <option value="1">1 BHK</option>
                <option value="2">2 BHK</option>
                <option value="3">3 BHK</option>
                <option value="4">4 BHK</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Status</option>
                <option value="AVAILABLE">Available</option>
                <option value="RESERVED">Reserved</option>
                <option value="BOOKED">Booked</option>
                <option value="SOLD">Sold</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Min Price (₹)</label>
              <input
                type="number"
                name="minPrice"
                value={filters.minPrice}
                onChange={handleFilterChange}
                placeholder="Min price"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Price (₹)</label>
              <input
                type="number"
                name="maxPrice"
                value={filters.maxPrice}
                onChange={handleFilterChange}
                placeholder="Max price"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Min Area (sqft)</label>
              <input
                type="number"
                name="minArea"
                value={filters.minArea}
                onChange={handleFilterChange}
                placeholder="Min area"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Area (sqft)</label>
              <input
                type="number"
                name="maxArea"
                value={filters.maxArea}
                onChange={handleFilterChange}
                placeholder="Max area"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-2">
            <button
              onClick={() => handleSort('price')}
              className="flex items-center px-4 py-2 bg-white rounded-lg shadow hover:bg-gray-50"
            >
              <ArrowUpDown className="h-4 w-4 mr-2" />
              Price
            </button>
            <button
              onClick={() => handleSort('area')}
              className="flex items-center px-4 py-2 bg-white rounded-lg shadow hover:bg-gray-50"
            >
              <ArrowUpDown className="h-4 w-4 mr-2" />
              Area
            </button>
            <button
              onClick={() => handleSort('createdAt')}
              className="flex items-center px-4 py-2 bg-white rounded-lg shadow hover:bg-gray-50"
            >
              <ArrowUpDown className="h-4 w-4 mr-2" />
              Newest
            </button>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-white'}`}
            >
              <Grid className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-white'}`}
            >
              <List className="h-5 w-5" />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No properties found matching your criteria.</p>
          </div>
        ) : (
          <>
            <div className={viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
              : 'space-y-4'
            }>
              {properties.map((property) => (
                <div key={property._id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition">
                  <div className="relative">
                    <img
                      src={property.coverImage || property.images?.[0] || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'}
                      alt={property.title}
                      className="w-full h-48 object-cover"
                    />
                    <span className={`absolute top-4 left-4 px-3 py-1 rounded-full text-sm ${
                      property.status === 'AVAILABLE' ? 'bg-green-500' :
                      property.status === 'BOOKED' ? 'bg-red-500' :
                      property.status === 'SOLD' ? 'bg-gray-500' : 'bg-yellow-500'
                    } text-white`}>
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
                      {property.parking > 0 && (
                        <div className="flex items-center">
                          <Car className="h-4 w-4 mr-1" />
                          <span>{property.parking}</span>
                        </div>
                      )}
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

            {totalPages > 1 && (
              <div className="flex justify-center mt-8 space-x-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 bg-white rounded-lg shadow hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`px-4 py-2 rounded-lg shadow ${page === p ? 'bg-blue-600 text-white' : 'bg-white hover:bg-gray-50'}`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 bg-white rounded-lg shadow hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Properties;
