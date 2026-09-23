import { useEffect, useState } from 'react';
import { unitAPI, propertyAPI } from '../../services/api';
import { Edit, Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const emptyForm = {
  property: '',
  unitNumber: '',
  block: '',
  floor: '',
  bhk: '',
  area: '',
  price: '',
  facing: '',
  parking: '0',
  status: 'AVAILABLE'
};

const AdminUnits = () => {
  const [units, setUnits] = useState([]);
  const [properties, setProperties] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [editingUnit, setEditingUnit] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProperties();
  }, []);

  useEffect(() => {
    fetchUnits(formData.property);
  }, [formData.property]);

  const fetchProperties = async () => {
    try {
      const response = await propertyAPI.getProperties({ limit: 100 });
      setProperties(response.data.properties);
      if (response.data.properties.length > 0) {
        setFormData(previous => ({ ...previous, property: previous.property || response.data.properties[0]._id }));
      }
    } catch (error) {
      toast.error('Failed to fetch properties');
    }
  };

  const fetchUnits = async (propertyId) => {
    setLoading(true);
    try {
      const response = await unitAPI.getUnits(propertyId ? { property: propertyId } : undefined);
      setUnits(response.data);
    } catch (error) {
      toast.error('Failed to fetch units');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = (propertyId = formData.property) => {
    setFormData({ ...emptyForm, property: propertyId });
    setEditingUnit(null);
  };

  const openCreate = () => {
    resetForm();
    setShowModal(true);
  };

  const openEdit = (unit) => {
    setEditingUnit(unit);
    setFormData({
      property: unit.property?._id || unit.property,
      unitNumber: unit.unitNumber,
      block: unit.block || '',
      floor: unit.floor?.toString() || '',
      bhk: unit.bhk.toString(),
      area: unit.area.toString(),
      price: unit.price.toString(),
      facing: unit.facing || '',
      parking: unit.parking?.toString() || '0',
      status: unit.status
    });
    setShowModal(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const payload = {
      ...formData,
      floor: formData.floor === '' ? undefined : Number(formData.floor),
      bhk: Number(formData.bhk),
      area: Number(formData.area),
      price: Number(formData.price),
      parking: Number(formData.parking)
    };

    try {
      if (editingUnit) {
        await unitAPI.updateUnit(editingUnit._id, payload);
        toast.success('Unit updated successfully');
      } else {
        await unitAPI.createUnit(payload);
        toast.success('Unit created successfully');
      }
      setShowModal(false);
      resetForm(formData.property);
      await fetchUnits(formData.property);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save unit');
    }
  };

  const handleDelete = async (unitId) => {
    if (!window.confirm('Are you sure you want to delete this unit?')) return;
    try {
      await unitAPI.deleteUnit(unitId);
      toast.success('Unit deleted successfully');
      await fetchUnits(formData.property);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete unit');
    }
  };

  const formatPrice = (price) => `₹${Number(price).toLocaleString()}`;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manage Units</h1>
            <p className="mt-1 text-gray-600">Manage apartments within each property.</p>
          </div>
          <button onClick={openCreate} className="flex items-center rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
            <Plus className="mr-2 h-5 w-5" />
            Add Unit
          </button>
        </div>

        <div className="mb-6 flex items-center gap-3 rounded-xl bg-white p-6 shadow-lg">
          <label htmlFor="property-filter" className="font-medium text-gray-700">Property</label>
          <select
            id="property-filter"
            value={formData.property}
            onChange={(event) => setFormData(previous => ({ ...previous, property: event.target.value }))}
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2"
          >
            {properties.map(property => <option key={property._id} value={property._id}>{property.title}</option>)}
          </select>
        </div>

        <div className="overflow-hidden rounded-xl bg-white shadow-lg">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {['Unit', 'Block', 'Floor', 'BHK', 'Area', 'Price', 'Facing', 'Status', 'Actions'].map(label => (
                  <th key={label} className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">{label}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {!loading && units.map(unit => (
                <tr key={unit._id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 font-medium text-gray-900">{unit.unitNumber}</td>
                  <td className="px-4 py-4 text-gray-600">{unit.block || '-'}</td>
                  <td className="px-4 py-4 text-gray-600">{unit.floor ?? '-'}</td>
                  <td className="px-4 py-4 text-gray-600">{unit.bhk}</td>
                  <td className="px-4 py-4 text-gray-600">{unit.area} sqft</td>
                  <td className="px-4 py-4 text-gray-600">{formatPrice(unit.price)}</td>
                  <td className="px-4 py-4 text-gray-600">{unit.facing || '-'}</td>
                  <td className="px-4 py-4">
                    <span className={`rounded-full px-2 py-1 text-xs font-medium ${unit.status === 'AVAILABLE' ? 'bg-green-100 text-green-800' : unit.status === 'BOOKED' ? 'bg-red-100 text-red-800' : unit.status === 'SOLD' ? 'bg-gray-100 text-gray-800' : 'bg-yellow-100 text-yellow-800'}`}>{unit.status}</span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(unit)} className="text-blue-600 hover:text-blue-700" aria-label="Edit unit"><Edit className="h-5 w-5" /></button>
                      <button onClick={() => handleDelete(unit._id)} className="text-red-600 hover:text-red-700" aria-label="Delete unit"><Trash2 className="h-5 w-5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && units.length === 0 && <tr><td colSpan="9" className="px-6 py-10 text-center text-gray-500">No units for this property.</td></tr>}
            </tbody>
          </table>
        </div>

        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black bg-opacity-50 p-4">
            <div className="w-full max-w-3xl rounded-xl bg-white p-6">
              <h2 className="mb-6 text-2xl font-bold">{editingUnit ? 'Edit Unit' : 'Add Unit'}</h2>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <label className="text-sm font-medium text-gray-700">Property<select required value={formData.property} onChange={event => setFormData({ ...formData, property: event.target.value })} className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2">{properties.map(property => <option key={property._id} value={property._id}>{property.title}</option>)}</select></label>
                <label className="text-sm font-medium text-gray-700">Unit Number<input required value={formData.unitNumber} onChange={event => setFormData({ ...formData, unitNumber: event.target.value })} className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2" /></label>
                <label className="text-sm font-medium text-gray-700">Block<input value={formData.block} onChange={event => setFormData({ ...formData, block: event.target.value })} className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2" /></label>
                <label className="text-sm font-medium text-gray-700">Floor<input type="number" min="0" value={formData.floor} onChange={event => setFormData({ ...formData, floor: event.target.value })} className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2" /></label>
                <label className="text-sm font-medium text-gray-700">BHK<input required type="number" min="0" value={formData.bhk} onChange={event => setFormData({ ...formData, bhk: event.target.value })} className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2" /></label>
                <label className="text-sm font-medium text-gray-700">Area (sqft)<input required type="number" min="1" value={formData.area} onChange={event => setFormData({ ...formData, area: event.target.value })} className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2" /></label>
                <label className="text-sm font-medium text-gray-700">Price<input required type="number" min="1" value={formData.price} onChange={event => setFormData({ ...formData, price: event.target.value })} className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2" /></label>
                <label className="text-sm font-medium text-gray-700">Facing<input value={formData.facing} onChange={event => setFormData({ ...formData, facing: event.target.value })} className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2" /></label>
                <label className="text-sm font-medium text-gray-700">Parking<input type="number" min="0" value={formData.parking} onChange={event => setFormData({ ...formData, parking: event.target.value })} className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2" /></label>
                <label className="text-sm font-medium text-gray-700">Status<select value={formData.status} onChange={event => setFormData({ ...formData, status: event.target.value })} className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2"><option>AVAILABLE</option><option>RESERVED</option><option>BOOKED</option><option>SOLD</option></select></label>
                <div className="flex gap-3 md:col-span-2">
                  <button type="button" onClick={() => { setShowModal(false); resetForm(formData.property); }} className="flex-1 rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-50">Cancel</button>
                  <button type="submit" className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">{editingUnit ? 'Update' : 'Create'}</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUnits;
