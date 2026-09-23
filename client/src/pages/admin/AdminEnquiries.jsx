import { useState, useEffect } from 'react';
import { enquiryAPI, propertyAPI, userAPI } from '../../services/api';
import { Edit, Trash2, Search, MessageSquare, Clock, User, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

const AdminEnquiries = () => {
  const { user } = useAuth();
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingEnquiry, setEditingEnquiry] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ property: '', agent: '', status: '' });
  const [properties, setProperties] = useState([]);
  const [agents, setAgents] = useState([]);

  const [formData, setFormData] = useState({
    status: 'NEW'
  });

  useEffect(() => {
    fetchEnquiries();
    if (user?.role === 'ADMIN') fetchFilters();
  }, [user]);

  useEffect(() => {
    if (user?.role === 'ADMIN') fetchEnquiries();
  }, [filters]);

  const fetchEnquiries = async () => {
    try {
      const response = await enquiryAPI.getEnquiries(user?.role === 'ADMIN' ? filters : undefined);
      setEnquiries(response.data);
    } catch (error) {
      toast.error('Failed to fetch enquiries');
    } finally {
      setLoading(false);
    }
  };

  const fetchFilters = async () => {
    try {
      const [propertiesResponse, agentsResponse] = await Promise.all([
        propertyAPI.getProperties({ limit: 100 }),
        userAPI.getUsers({ role: 'AGENT' })
      ]);
      setProperties(propertiesResponse.data.properties);
      setAgents(agentsResponse.data);
    } catch (error) {
      toast.error('Failed to load enquiry filters');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await enquiryAPI.updateEnquiry(editingEnquiry._id, { ...formData, ...(user?.role === 'ADMIN' ? { agent: formData.agent } : {}) });
      toast.success('Enquiry updated successfully');
      setShowModal(false);
      setEditingEnquiry(null);
      fetchEnquiries();
    } catch (error) {
      toast.error('Failed to update enquiry');
    }
  };

  const handleEdit = (enquiry) => {
    setEditingEnquiry(enquiry);
    setFormData({ status: enquiry.status, agent: enquiry.agent?._id || '' });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this enquiry?')) {
      try {
        await enquiryAPI.deleteEnquiry(id);
        toast.success('Enquiry deleted successfully');
        fetchEnquiries();
      } catch (error) {
        toast.error('Failed to delete enquiry');
      }
    }
  };

  const filteredEnquiries = enquiries.filter(e =>
    e.property?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.user?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    const colors = {
      'NEW': 'bg-blue-100 text-blue-800',
      'CONTACTED': 'bg-yellow-100 text-yellow-800',
      'INTERESTED': 'bg-purple-100 text-purple-800',
      'SITE_VISIT': 'bg-indigo-100 text-indigo-800',
      'NEGOTIATION': 'bg-orange-100 text-orange-800',
      'CONVERTED': 'bg-green-100 text-green-800',
      'CLOSED': 'bg-gray-100 text-gray-800'
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
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Manage Enquiries</h1>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center">
            <Search className="h-5 w-5 text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search enquiries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {user?.role === 'ADMIN' && <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
            <select value={filters.property} onChange={event => setFilters({ ...filters, property: event.target.value })} className="rounded-lg border border-gray-300 px-3 py-2"><option value="">All properties</option>{properties.map(property => <option key={property._id} value={property._id}>{property.title}</option>)}</select>
            <select value={filters.agent} onChange={event => setFilters({ ...filters, agent: event.target.value })} className="rounded-lg border border-gray-300 px-3 py-2"><option value="">All agents</option>{agents.map(agent => <option key={agent._id} value={agent._id}>{agent.name}</option>)}</select>
            <select value={filters.status} onChange={event => setFilters({ ...filters, status: event.target.value })} className="rounded-lg border border-gray-300 px-3 py-2"><option value="">All statuses</option>{['NEW', 'CONTACTED', 'INTERESTED', 'SITE_VISIT', 'NEGOTIATION', 'CONVERTED', 'CLOSED'].map(status => <option key={status}>{status}</option>)}</select>
          </div>}
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Property</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredEnquiries.map((enquiry) => (
                <tr key={enquiry._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{enquiry.property?.title}</div>
                    <div className="text-sm text-gray-500 flex items-center">
                      <MapPin className="h-3 w-3 mr-1" />
                      {enquiry.property?.location}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                        <span className="text-blue-600 font-semibold text-sm">{enquiry.user?.name?.charAt(0)}</span>
                      </div>
                      <div className="font-medium text-gray-900">{enquiry.user?.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <div>{enquiry.email}</div>
                    <div>{enquiry.phone}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(enquiry.status)}`}>
                      {enquiry.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(enquiry.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleEdit(enquiry)}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      {user?.role === 'ADMIN' && <button
                        onClick={() => handleDelete(enquiry._id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
              <h2 className="text-2xl font-bold mb-6">Update Enquiry Status</h2>
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      required
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="NEW">New</option>
                      <option value="CONTACTED">Contacted</option>
                      <option value="INTERESTED">Interested</option>
                      <option value="SITE_VISIT">Site Visit</option>
                      <option value="NEGOTIATION">Negotiation</option>
                      <option value="CONVERTED">Converted</option>
                      <option value="CLOSED">Closed</option>
                    </select>
                  </div>
                  {user?.role === 'ADMIN' && <div><label className="block text-sm font-medium text-gray-700 mb-1">Assign Agent</label><select value={formData.agent || ''} onChange={event => setFormData({ ...formData, agent: event.target.value })} className="w-full rounded-lg border border-gray-300 px-4 py-2"><option value="">Unassigned</option>{agents.map(agent => <option key={agent._id} value={agent._id}>{agent.name}</option>)}</select></div>}
                </div>
                <div className="flex space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditingEnquiry(null);
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Update
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

export default AdminEnquiries;
