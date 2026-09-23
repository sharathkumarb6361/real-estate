import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { enquiryAPI, visitAPI, bookingAPI, wishlistAPI } from '../services/api';
import { LayoutDashboard, Heart, MessageSquare, Calendar, Clock, User, MapPin, Phone, Mail, Edit } from 'lucide-react';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [enquiries, setEnquiries] = useState([]);
  const [visits, setVisits] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: '',
    phone: '',
    email: ''
  });

  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name,
        phone: user.phone,
        email: user.email
      });
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      const [enqRes, visitRes, bookingRes, wishRes] = await Promise.all([
        enquiryAPI.getEnquiries(),
        visitAPI.getVisits(),
        bookingAPI.getBookings(),
        wishlistAPI.getWishlist()
      ]);
      setEnquiries(enqRes.data);
      setVisits(visitRes.data);
      setBookings(bookingRes.data);
      setWishlist(wishRes.data.properties || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    toast.success('Profile updated successfully');
    setEditingProfile(false);
  };

  const handleCancelVisit = async (visitId) => {
    try {
      await visitAPI.updateVisit(visitId, { status: 'CANCELLED' });
      setVisits(previousVisits => previousVisits.map(visit => visit._id === visitId ? { ...visit, status: 'CANCELLED' } : visit));
      toast.success('Visit cancelled');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel visit');
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

  const getStatusColor = (status) => {
    const colors = {
      'NEW': 'bg-blue-100 text-blue-800',
      'CONTACTED': 'bg-yellow-100 text-yellow-800',
      'INTERESTED': 'bg-purple-100 text-purple-800',
      'SITE_VISIT': 'bg-indigo-100 text-indigo-800',
      'NEGOTIATION': 'bg-orange-100 text-orange-800',
      'CONVERTED': 'bg-green-100 text-green-800',
      'FOLLOW_UP': 'bg-purple-100 text-purple-800',
      'CLOSED': 'bg-gray-100 text-gray-800',
      'PENDING': 'bg-yellow-100 text-yellow-800',
      'CONFIRMED': 'bg-green-100 text-green-800',
      'RESCHEDULED': 'bg-orange-100 text-orange-800',
      'COMPLETED': 'bg-green-100 text-green-800',
      'CANCELLED': 'bg-red-100 text-red-800',
      'REJECTED': 'bg-red-100 text-red-800',
      'APPROVED': 'bg-green-100 text-green-800',
      'REJECTED': 'bg-red-100 text-red-800',
      'AVAILABLE': 'bg-green-100 text-green-800',
      'BOOKED': 'bg-red-100 text-red-800',
      'SOLD': 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
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
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Wishlist</p>
                <p className="text-3xl font-bold text-gray-900">{wishlist.length}</p>
              </div>
              <Heart className="h-8 w-8 text-red-500" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Enquiries</p>
                <p className="text-3xl font-bold text-gray-900">{enquiries.length}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Upcoming Visits</p>
                <p className="text-3xl font-bold text-gray-900">
                  {visits.filter(v => v.status === 'CONFIRMED' || v.status === 'PENDING').length}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-green-500" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Bookings</p>
                <p className="text-3xl font-bold text-gray-900">{bookings.length}</p>
              </div>
              <Clock className="h-8 w-8 text-purple-500" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg mb-8">
          <div className="border-b">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'overview' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Profile
              </button>
              <button
                onClick={() => setActiveTab('enquiries')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'enquiries' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Enquiries ({enquiries.length})
              </button>
              <button
                onClick={() => setActiveTab('visits')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'visits' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Visits ({visits.length})
              </button>
              <button
                onClick={() => setActiveTab('bookings')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'bookings' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Bookings ({bookings.length})
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Profile Information</h2>
                  {!editingProfile && (
                    <button
                      onClick={() => setEditingProfile(true)}
                      className="flex items-center text-blue-600 hover:text-blue-700"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </button>
                  )}
                </div>

                {editingProfile ? (
                  <form onSubmit={handleProfileUpdate} className="max-w-2xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                        <input
                          type="text"
                          value={profileForm.name}
                          onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                        <input
                          type="tel"
                          value={profileForm.phone}
                          onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                          type="email"
                          value={profileForm.email}
                          onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                    <div className="flex space-x-3 mt-4">
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        Save Changes
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingProfile(false)}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center">
                      <User className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Name</p>
                        <p className="font-medium">{user.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Mail className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <p className="font-medium">{user.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <LayoutDashboard className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Role</p>
                        <p className="font-medium">{user.role}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'enquiries' && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">My Enquiries</h2>
                {enquiries.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No enquiries yet</p>
                ) : (
                  <div className="space-y-4">
                    {enquiries.map((enquiry) => (
                      <div key={enquiry._id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-gray-900">{enquiry.property?.title}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(enquiry.status)}`}>
                            {enquiry.status}
                          </span>
                        </div>
                        <div className="flex items-center text-gray-600 text-sm mb-2">
                          <MapPin className="h-4 w-4 mr-1" />
                          {enquiry.property?.location}
                        </div>
                        <p className="text-gray-600 text-sm mb-2">{enquiry.message}</p>
                        <p className="text-xs text-gray-400">
                          Submitted on {new Date(enquiry.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'visits' && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">My Visits</h2>
                {visits.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No visits scheduled</p>
                ) : (
                  <div className="space-y-4">
                    {visits.map((visit) => (
                      <div key={visit._id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-gray-900">{visit.property?.title}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(visit.status)}`}>
                            {visit.status}
                          </span>
                        </div>
                        <div className="flex items-center text-gray-600 text-sm mb-2">
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date(visit.date).toLocaleDateString()} at {visit.time}
                        </div>
                        {visit.message && (
                          <p className="text-gray-600 text-sm mb-2">{visit.message}</p>
                        )}
                        <p className="text-xs text-gray-400">
                          Scheduled on {new Date(visit.createdAt).toLocaleDateString()}
                        </p>
                        {['PENDING', 'CONFIRMED', 'RESCHEDULED'].includes(visit.status) && (
                          <button onClick={() => handleCancelVisit(visit._id)} className="mt-3 rounded-lg border border-red-200 px-3 py-1 text-sm text-red-600 hover:bg-red-50">
                            Cancel visit
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'bookings' && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">My Bookings</h2>
                {bookings.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No bookings yet</p>
                ) : (
                  <div className="space-y-4">
                    {bookings.map((booking) => (
                      <div key={booking._id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-gray-900">{booking.property?.title}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                            {booking.status}
                          </span>
                        </div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center text-gray-600 text-sm">
                            <Clock className="h-4 w-4 mr-1" />
                            {new Date(booking.bookingDate).toLocaleDateString()}
                          </div>
                          <div className="text-lg font-bold text-blue-600">
                            {formatPrice(booking.amount)}
                          </div>
                        </div>
                        {booking.notes && (
                          <p className="text-gray-600 text-sm mb-2">{booking.notes}</p>
                        )}
                        <p className="text-xs text-gray-400">
                          Booked on {new Date(booking.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
