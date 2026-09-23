import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dashboardAPI } from '../../services/api';
import { LayoutDashboard, Building2, Users, MessageSquare, Calendar, Clock, Plus, Home } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, analyticsRes] = await Promise.all([
        dashboardAPI.getStats(),
        dashboardAPI.getAnalytics()
      ]);
      setStats(statsRes.data);
      setAnalytics(analyticsRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

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
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

        <div className="bg-white rounded-xl shadow-lg p-4 mb-8">
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/admin/dashboard"
              className="flex items-center px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
            >
              <LayoutDashboard className="h-5 w-5 mr-2" />
              Dashboard
            </Link>
            <Link
              to="/admin/properties"
              className="flex items-center px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100"
            >
              <Building2 className="h-5 w-5 mr-2" />
              Manage Properties
            </Link>
            <Link
              to="/admin/properties?add=true"
              className="flex items-center px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Property
            </Link>
            <Link to="/admin/users" className="flex items-center px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100">
              <Users className="h-5 w-5 mr-2" />
              Users
            </Link>
            <Link to="/admin/enquiries" className="flex items-center px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100">
              <MessageSquare className="h-5 w-5 mr-2" />
              Enquiries
            </Link>
            <Link to="/admin/visits" className="flex items-center px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100">
              <Calendar className="h-5 w-5 mr-2" />
              Visits
            </Link>
            <Link to="/admin/bookings" className="flex items-center px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100">
              <Clock className="h-5 w-5 mr-2" />
              Bookings
            </Link>
            <Link to="/admin/units" className="flex items-center px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100">
              <Home className="h-5 w-5 mr-2" />
              Units
            </Link>
            <Link to="/admin/amenities" className="flex items-center px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100">
              <Home className="h-5 w-5 mr-2" />
              Amenities
            </Link>
          </div>
        </div>

        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Total Properties</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalProperties}</p>
                  <p className="text-sm text-green-600 mt-1">
                    {stats.availableUnits} Available Units
                  </p>
                </div>
                <Building2 className="h-10 w-10 text-blue-500" />
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Total Users</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {stats.totalAgents} Agents
                  </p>
                </div>
                <Users className="h-10 w-10 text-green-500" />
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Total Enquiries</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalEnquiries}</p>
                  <p className="text-sm text-yellow-600 mt-1">
                    {stats.totalVisits} Total Visits
                  </p>
                </div>
                <MessageSquare className="h-10 w-10 text-yellow-500" />
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Bookings</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalBookings}</p>
                  <p className="text-sm text-purple-600 mt-1">
                    {stats.pendingBookings} Pending
                  </p>
                </div>
                <Clock className="h-10 w-10 text-purple-500" />
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <p className="text-gray-500 text-sm">Unit Availability</p>
              <div className="mt-3 space-y-1 text-sm">
                <p className="text-green-700">Available: {stats.availableUnits}</p>
                <p className="text-yellow-700">Reserved: {stats.reservedUnits}</p>
                <p className="text-red-700">Booked: {stats.bookedUnits}</p>
                <p className="text-gray-700">Sold: {stats.soldUnits}</p>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <p className="text-gray-500 text-sm">Verified Revenue</p>
              <p className="mt-2 text-3xl font-bold text-green-600">{formatPrice(stats.verifiedRevenue)}</p>
              <p className="mt-1 text-sm text-gray-500">Paid approved/completed bookings</p>
            </div>
          </div>
        )}

        {analytics && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Properties by Type</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={analytics.propertiesByType}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {analytics.propertiesByType.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Unit Availability</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analytics.unitAvailability}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="_id" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Monthly Enquiries</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analytics.monthlyEnquiries}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="label" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="count" stroke="#3B82F6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Monthly Bookings</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analytics.monthlyBookings}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="label" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="count" stroke="#10B981" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Revenue Over Time</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analytics.revenueOverTime}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="label" />
                  <YAxis tickFormatter={formatPrice} />
                  <Tooltip formatter={(value) => formatPrice(value)} />
                  <Line type="monotone" dataKey="revenue" stroke="#16A34A" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
