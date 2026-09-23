import { useEffect, useState } from 'react';
import { amenityAPI } from '../../services/api';
import { Edit, Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const emptyForm = { name: '', icon: '', description: '' };

const AdminAmenities = () => {
  const [amenities, setAmenities] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [editingAmenity, setEditingAmenity] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchAmenities = async () => {
    try {
      const response = await amenityAPI.getAmenities();
      setAmenities(response.data);
    } catch (error) {
      toast.error('Failed to fetch amenities');
    }
  };

  useEffect(() => { fetchAmenities(); }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (editingAmenity) {
        await amenityAPI.updateAmenity(editingAmenity._id, formData);
        toast.success('Amenity updated successfully');
      } else {
        await amenityAPI.createAmenity(formData);
        toast.success('Amenity created successfully');
      }
      setShowModal(false);
      setEditingAmenity(null);
      setFormData(emptyForm);
      fetchAmenities();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save amenity');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this amenity? Existing property references will be removed from future responses.')) return;
    try {
      await amenityAPI.deleteAmenity(id);
      toast.success('Amenity deleted successfully');
      fetchAmenities();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete amenity');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Manage Amenities</h1>
          <button onClick={() => { setFormData(emptyForm); setEditingAmenity(null); setShowModal(true); }} className="flex items-center rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"><Plus className="mr-2 h-5 w-5" />Add Amenity</button>
        </div>
        <div className="overflow-hidden rounded-xl bg-white shadow-lg">
          <table className="w-full"><thead className="bg-gray-50"><tr><th className="px-6 py-3 text-left text-xs uppercase text-gray-500">Name</th><th className="px-6 py-3 text-left text-xs uppercase text-gray-500">Icon</th><th className="px-6 py-3 text-left text-xs uppercase text-gray-500">Description</th><th className="px-6 py-3 text-right text-xs uppercase text-gray-500">Actions</th></tr></thead>
            <tbody className="divide-y divide-gray-200">{amenities.map(amenity => <tr key={amenity._id}><td className="px-6 py-4 font-medium">{amenity.name}</td><td className="px-6 py-4 text-gray-600">{amenity.icon || '-'}</td><td className="px-6 py-4 text-gray-600">{amenity.description || '-'}</td><td className="px-6 py-4 text-right"><button onClick={() => { setEditingAmenity(amenity); setFormData({ name: amenity.name, icon: amenity.icon || '', description: amenity.description || '' }); setShowModal(true); }} className="mr-3 text-blue-600"><Edit className="h-5 w-5" /></button><button onClick={() => handleDelete(amenity._id)} className="text-red-600"><Trash2 className="h-5 w-5" /></button></td></tr>)}</tbody>
          </table>
        </div>
        {showModal && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"><form onSubmit={handleSubmit} className="w-full max-w-md space-y-4 rounded-xl bg-white p-6"><h2 className="text-2xl font-bold">{editingAmenity ? 'Edit Amenity' : 'Add Amenity'}</h2><input required placeholder="Name" value={formData.name} onChange={event => setFormData({ ...formData, name: event.target.value })} className="w-full rounded-lg border px-4 py-2" /><input placeholder="Icon" value={formData.icon} onChange={event => setFormData({ ...formData, icon: event.target.value })} className="w-full rounded-lg border px-4 py-2" /><textarea placeholder="Description" value={formData.description} onChange={event => setFormData({ ...formData, description: event.target.value })} className="w-full rounded-lg border px-4 py-2" /><div className="flex gap-3"><button type="button" onClick={() => setShowModal(false)} className="flex-1 rounded-lg border px-4 py-2">Cancel</button><button type="submit" className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-white">Save</button></div></form></div>}
      </div>
    </div>
  );
};

export default AdminAmenities;