import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Building2, Home, MessageSquare, Calendar, ClipboardList, Bell } from 'lucide-react';
import toast from 'react-hot-toast';
import { propertyAPI, unitAPI, enquiryAPI, visitAPI, bookingAPI, notificationAPI } from '../../services/api';

const sections = [
  { key: 'properties', label: 'Assigned Properties', path: '/agent/properties', icon: Building2 },
  { key: 'units', label: 'Units', path: '/agent/units', icon: Home },
  { key: 'enquiries', label: 'Enquiries / Leads', path: '/agent/enquiries', icon: MessageSquare },
  { key: 'visits', label: 'Site Visits', path: '/agent/visits', icon: Calendar },
  { key: 'bookings', label: 'Bookings', path: '/agent/bookings', icon: ClipboardList }
];

const AgentDashboard = () => {
  const [data, setData] = useState({ properties: [], units: [], enquiries: [], visits: [], bookings: [], notifications: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const [properties, units, enquiries, visits, bookings, notifications] = await Promise.all([
        propertyAPI.getProperties({ limit: 100 }),
        unitAPI.getUnits(),
        enquiryAPI.getEnquiries(),
        visitAPI.getVisits(),
        bookingAPI.getBookings(),
        notificationAPI.getNotifications()
      ]);
      setData({
        properties: properties.data.properties,
        units: units.data,
        enquiries: enquiries.data,
        visits: visits.data,
        bookings: bookings.data,
        notifications: notifications.data.notifications
      });
    } catch (error) {
      toast.error('Failed to load agent dashboard');
    } finally {
      setLoading(false);
    }
  };

  const markNotificationsRead = async () => {
    try {
      await notificationAPI.markAsRead();
      setData(previous => ({ ...previous, notifications: previous.notifications.map(notification => ({ ...notification, isRead: true })) }));
    } catch (error) {
      toast.error('Failed to update notifications');
    }
  };

  if (loading) return <div className="flex min-h-screen items-center justify-center"><div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600" /></div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Agent Dashboard</h1>
            <p className="mt-1 text-gray-600">Your assigned properties and customer activity.</p>
          </div>
          <Link to="/agent/properties" className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">Manage Properties</Link>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
          {sections.map(({ key, label, path, icon: Icon }) => (
            <Link key={key} to={path} className="rounded-xl bg-white p-5 shadow-lg hover:shadow-xl">
              <Icon className="mb-3 h-7 w-7 text-blue-600" />
              <p className="text-sm text-gray-500">{label}</p>
              <p className="text-3xl font-bold text-gray-900">{data[key].length}</p>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <section className="rounded-xl bg-white p-6 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Notifications</h2>
              <button onClick={markNotificationsRead} className="text-sm text-blue-600 hover:text-blue-700">Mark all read</button>
            </div>
            {data.notifications.length === 0 ? <p className="text-gray-500">No notifications.</p> : (
              <div className="space-y-3">
                {data.notifications.slice(0, 6).map(notification => (
                  <div key={notification._id} className={`flex gap-3 rounded-lg p-3 ${notification.isRead ? 'bg-gray-50' : 'bg-blue-50'}`}>
                    <Bell className="mt-1 h-5 w-5 text-blue-600" />
                    <div><p className="font-medium text-gray-900">{notification.title}</p><p className="text-sm text-gray-600">{notification.message}</p></div>
                  </div>
                ))}
              </div>
            )}
          </section>
          <section className="rounded-xl bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-xl font-bold text-gray-900">Recent Assigned Properties</h2>
            {data.properties.length === 0 ? <p className="text-gray-500">No assigned properties.</p> : (
              <div className="space-y-3">
                {data.properties.slice(0, 6).map(property => (
                  <Link key={property._id} to={`/properties/${property._id}`} className="block rounded-lg border border-gray-200 p-3 hover:bg-gray-50">
                    <p className="font-medium text-gray-900">{property.title}</p>
                    <p className="text-sm text-gray-500">{property.location} · {property.status}</p>
                  </Link>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default AgentDashboard;
