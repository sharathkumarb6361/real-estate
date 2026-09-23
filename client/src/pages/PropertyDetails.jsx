import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { propertyAPI, wishlistAPI, enquiryAPI, visitAPI, bookingAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { MapPin, Bed, Bath, Maximize, Car, Calendar, Phone, Mail, Heart, ArrowLeft, Send, Clock, Check } from 'lucide-react';
import toast from 'react-hot-toast';

const PropertyDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);
  const [showVisitModal, setShowVisitModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [inWishlist, setInWishlist] = useState(false);

  const [enquiryForm, setEnquiryForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const [visitForm, setVisitForm] = useState({
    date: '',
    time: '',
    name: '',
    phone: '',
    message: ''
  });

  const [bookingForm, setBookingForm] = useState({
    unit: '',
    bookingDate: '',
    amount: 0,
    notes: ''
  });

  useEffect(() => {
    fetchProperty();
    if (user) {
      checkWishlist();
    }
  }, [id, user]);

  const fetchProperty = async () => {
    try {
      const response = await propertyAPI.getPropertyById(id);
      setProperty(response.data);
      if (response.data.units && response.data.units.length > 0) {
        setBookingForm(prev => ({ ...prev, amount: response.data.units[0].price }));
      }
    } catch (error) {
      toast.error('Failed to fetch property details');
      navigate('/properties');
    } finally {
      setLoading(false);
    }
  };

  const checkWishlist = async () => {
    try {
      const response = await wishlistAPI.getWishlist();
      setInWishlist(response.data.properties.some(p => p._id === id));
    } catch (error) {
      console.error('Error checking wishlist:', error);
    }
  };

  const handleAddToWishlist = async () => {
    if (!user) {
      toast.error('Please login to add to wishlist');
      navigate('/login');
      return;
    }

    try {
      if (inWishlist) {
        await wishlistAPI.removeFromWishlist(id);
        setInWishlist(false);
        toast.success('Removed from wishlist');
      } else {
        await wishlistAPI.addToWishlist({ propertyId: id });
        setInWishlist(true);
        toast.success('Added to wishlist');
      }
    } catch (error) {
      toast.error('Failed to update wishlist');
    }
  };

  const handleEnquirySubmit = async (e) => {
    e.preventDefault();
    try {
      await enquiryAPI.createEnquiry({
        property: id,
        ...enquiryForm
      });
      toast.success('Enquiry submitted successfully');
      setShowEnquiryModal(false);
      setEnquiryForm({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
      toast.error('Failed to submit enquiry');
    }
  };

  const handleVisitSubmit = async (e) => {
    e.preventDefault();
    try {
      await visitAPI.createVisit({
        property: id,
        ...visitForm
      });
      toast.success('Visit scheduled successfully');
      setShowVisitModal(false);
      setVisitForm({ date: '', time: '', name: '', phone: '', message: '' });
    } catch (error) {
      toast.error('Failed to schedule visit');
    }
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    try {
      await bookingAPI.createBooking({
        property: id,
        unit: bookingForm.unit,
        bookingDate: bookingForm.bookingDate,
        notes: bookingForm.notes
      });
      toast.success('Booking request submitted successfully');
      setShowBookingModal(false);
      setBookingForm({ unit: '', bookingDate: '', amount: 0, notes: '' });
    } catch (error) {
      toast.error('Failed to submit booking request');
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

  if (!property) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Property not found.</p>
        <Link to="/properties" className="text-blue-600 hover:underline">Back to Properties</Link>
      </div>
    );
  }

  const displayImages = Array.from(new Set([property.coverImage, ...(property.images || [])].filter(Boolean)));

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/properties" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6">
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Properties
        </Link>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="relative">
            <img
              src={displayImages[currentImageIndex] || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'}
              alt={property.title}
              className="w-full h-96 object-cover"
            />
            {displayImages.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {displayImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-3 h-3 rounded-full ${index === currentImageIndex ? 'bg-white' : 'bg-white opacity-50'}`}
                  />
                ))}
              </div>
            )}
            <button
              onClick={handleAddToWishlist}
              className="absolute top-4 right-4 bg-white p-2 rounded-full shadow hover:bg-gray-100"
            >
              <Heart className={`h-6 w-6 ${inWishlist ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
            </button>
          </div>

          {displayImages.length > 1 && (
            <div className="p-4 grid grid-cols-4 gap-2">
              {displayImages.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`${property.title} ${index + 1}`}
                  className={`w-full h-20 object-cover rounded cursor-pointer ${index === currentImageIndex ? 'ring-2 ring-blue-500' : ''}`}
                  onClick={() => setCurrentImageIndex(index)}
                />
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{property.title}</h1>
              <div className="flex items-center text-gray-600 mb-4">
                <MapPin className="h-5 w-5 mr-2" />
                <span>{property.location}, {property.city}, {property.state}</span>
              </div>
              <p className="text-gray-700 mb-6">{property.description}</p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="flex items-center text-gray-600">
                  <Bed className="h-5 w-5 mr-2" />
                  <span>{property.bedrooms} Bedrooms</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Bath className="h-5 w-5 mr-2" />
                  <span>{property.bathrooms} Bathrooms</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Maximize className="h-5 w-5 mr-2" />
                  <span>{property.area} sqft</span>
                </div>
                {property.parking > 0 && (
                  <div className="flex items-center text-gray-600">
                    <Car className="h-5 w-5 mr-2" />
                    <span>{property.parking} Parking</span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between border-t pt-4">
                <div>
                  <span className="text-3xl font-bold text-blue-600">{formatPrice(property.price)}</span>
                  <span className="text-gray-500 ml-2">{property.propertyType}</span>
                </div>
                <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                  property.status === 'AVAILABLE' ? 'bg-green-100 text-green-800' :
                  property.status === 'BOOKED' ? 'bg-red-100 text-red-800' :
                  property.status === 'SOLD' ? 'bg-gray-100 text-gray-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {property.status}
                </span>
              </div>
            </div>

            {property.floorPlan && (
              <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Floor Plan</h2>
                <img
                  src={property.floorPlan}
                  alt="Floor Plan"
                  className="w-full h-auto rounded-lg"
                />
              </div>
            )}

            {property.amenities && property.amenities.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {property.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center text-gray-600">
                      <Check className="h-5 w-5 mr-2 text-green-500" />
                      <span>{amenity.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {property.units && property.units.filter(unit => unit.status === 'AVAILABLE').length > 0 && (
              <div className="mb-6 rounded-xl bg-white p-6 shadow-lg">
                <h2 className="mb-4 text-xl font-bold text-gray-900">Available Units</h2>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  {property.units.filter(unit => unit.status === 'AVAILABLE').map(unit => (
                    <div key={unit._id} className="rounded-lg border border-gray-200 p-4">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-gray-900">Unit {unit.unitNumber}</span>
                        <span className="text-sm font-medium text-green-600">AVAILABLE</span>
                      </div>
                      <p className="mt-2 text-sm text-gray-600">
                        {unit.bhk} BHK · {unit.area} sqft · {formatPrice(unit.price)}
                        {unit.block ? ` · Block ${unit.block}` : ''}
                        {unit.facing ? ` · ${unit.facing} facing` : ''}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {property.nearbyFacilities && (
              <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Nearby Facilities</h2>
                <div className="space-y-2">
                  {property.nearbyFacilities.school && (
                    <div className="flex items-center text-gray-600">
                      <Check className="h-5 w-5 mr-2 text-green-500" />
                      <span>School: {property.nearbyFacilities.school}</span>
                    </div>
                  )}
                  {property.nearbyFacilities.hospital && (
                    <div className="flex items-center text-gray-600">
                      <Check className="h-5 w-5 mr-2 text-green-500" />
                      <span>Hospital: {property.nearbyFacilities.hospital}</span>
                    </div>
                  )}
                  {property.nearbyFacilities.shopping && (
                    <div className="flex items-center text-gray-600">
                      <Check className="h-5 w-5 mr-2 text-green-500" />
                      <span>Shopping: {property.nearbyFacilities.shopping}</span>
                    </div>
                  )}
                  {property.nearbyFacilities.transportation && (
                    <div className="flex items-center text-gray-600">
                      <Check className="h-5 w-5 mr-2 text-green-500" />
                      <span>Transportation: {property.nearbyFacilities.transportation}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-20">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Contact Agent</h2>
              {property.agent ? (
                <div className="mb-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-blue-600 font-semibold">
                        {property.agent.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{property.agent.name}</h3>
                      <p className="text-sm text-gray-500">Agent</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-600">
                      <Phone className="h-4 w-4 mr-2" />
                      <span>{property.agent.phone}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Mail className="h-4 w-4 mr-2" />
                      <span>{property.agent.email}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 mb-6">No agent assigned</p>
              )}

              <div className="space-y-3">
                <button
                  onClick={() => {
                    if (!user) {
                      toast.error('Please login to send enquiry');
                      navigate('/login');
                      return;
                    }
                    setEnquiryForm({
                      name: user.name,
                      email: user.email,
                      phone: user.phone,
                      message: ''
                    });
                    setShowEnquiryModal(true);
                  }}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition flex items-center justify-center"
                >
                  <Send className="h-5 w-5 mr-2" />
                  Send Enquiry
                </button>
                <button
                  onClick={() => {
                    if (!user) {
                      toast.error('Please login to schedule visit');
                      navigate('/login');
                      return;
                    }
                    setVisitForm({
                      date: '',
                      time: '',
                      name: user.name,
                      phone: user.phone,
                      message: ''
                    });
                    setShowVisitModal(true);
                  }}
                  className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition flex items-center justify-center"
                >
                  <Calendar className="h-5 w-5 mr-2" />
                  Schedule Visit
                </button>
                {property.status === 'AVAILABLE' && (
                  <button
                    onClick={() => {
                      if (!user) {
                        toast.error('Please login to request booking');
                        navigate('/login');
                        return;
                      }
                      setShowBookingModal(true);
                    }}
                    className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition flex items-center justify-center"
                  >
                    <Clock className="h-5 w-5 mr-2" />
                    Request Booking
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {showEnquiryModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
              <h3 className="text-xl font-bold mb-4">Send Enquiry</h3>
              <form onSubmit={handleEnquirySubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      required
                      value={enquiryForm.name}
                      onChange={(e) => setEnquiryForm({...enquiryForm, name: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      required
                      value={enquiryForm.email}
                      onChange={(e) => setEnquiryForm({...enquiryForm, email: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      required
                      value={enquiryForm.phone}
                      onChange={(e) => setEnquiryForm({...enquiryForm, phone: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                    <textarea
                      required
                      value={enquiryForm.message}
                      onChange={(e) => setEnquiryForm({...enquiryForm, message: e.target.value})}
                      rows="3"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="flex space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowEnquiryModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showVisitModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
              <h3 className="text-xl font-bold mb-4">Schedule Visit</h3>
              <form onSubmit={handleVisitSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <input
                      type="date"
                      required
                      min={new Date().toISOString().split('T')[0]}
                      value={visitForm.date}
                      onChange={(e) => setVisitForm({...visitForm, date: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                    <input
                      type="time"
                      required
                      value={visitForm.time}
                      onChange={(e) => setVisitForm({...visitForm, time: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      required
                      value={visitForm.name}
                      onChange={(e) => setVisitForm({...visitForm, name: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      required
                      value={visitForm.phone}
                      onChange={(e) => setVisitForm({...visitForm, phone: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Message (Optional)</label>
                    <textarea
                      value={visitForm.message}
                      onChange={(e) => setVisitForm({...visitForm, message: e.target.value})}
                      rows="2"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="flex space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowVisitModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Schedule
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showBookingModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
              <h3 className="text-xl font-bold mb-4">Request Booking</h3>
              <form onSubmit={handleBookingSubmit}>
                <div className="space-y-4">
                  {property.units && property.units.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Select Unit</label>
                      <select
                        required
                        value={bookingForm.unit}
                        onChange={(e) => {
                          const unit = property.units.find(u => u._id === e.target.value);
                          setBookingForm({...bookingForm, unit: e.target.value, amount: unit?.price || 0});
                        }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select a unit</option>
                        {property.units.filter(u => u.status === 'AVAILABLE').map(unit => (
                          <option key={unit._id} value={unit._id}>
                            {unit.unitNumber} - {unit.bhk} BHK - {formatPrice(unit.price)}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Booking Date</label>
                    <input
                      type="date"
                      required
                      value={bookingForm.bookingDate}
                      onChange={(e) => setBookingForm({...bookingForm, bookingDate: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                    <input
                      type="text"
                      value={formatPrice(bookingForm.amount)}
                      readOnly
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Notes (Optional)</label>
                    <textarea
                      value={bookingForm.notes}
                      onChange={(e) => setBookingForm({...bookingForm, notes: e.target.value})}
                      rows="2"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-4">
                  <p className="text-sm text-yellow-800">
                    <strong>Note:</strong> This is a demonstration booking system. No actual payment will be processed.
                  </p>
                </div>
                <div className="flex space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowBookingModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                  >
                    Submit Request
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyDetails;
