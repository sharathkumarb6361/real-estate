import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { propertyAPI, userAPI, amenityAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Plus, Edit, Trash2, Search, ImagePlus, X, Star } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminProperties = () => {
  const { user } = useAuth();
  const [properties, setProperties] = useState([]);
  const [agents, setAgents] = useState([]);
  const [amenities, setAmenities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const [imageFiles, setImageFiles] = useState([]);
  const [imageUrl, setImageUrl] = useState('');
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    city: '',
    state: '',
    price: '',
    propertyType: 'APARTMENT',
    bhk: '',
    area: '',
    bedrooms: '',
    bathrooms: '',
    floor: '',
    totalFloors: '',
    parking: '',
    status: 'AVAILABLE',
    agent: '',
    possessionDate: '',
    constructionYear: '',
    images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'],
    coverImage: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
    amenities: []
  });

  useEffect(() => {
    if (user) fetchData();
  }, [user]);

  useEffect(() => {
    if (searchParams.get('add') === 'true') {
      resetForm();
      setEditingProperty(null);
      setShowModal(true);
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const fetchData = async () => {
    try {
      const [propsRes, amenitiesRes] = await Promise.all([
        propertyAPI.getProperties({ limit: 100 }),
        amenityAPI.getAmenities()
      ]);
      setProperties(propsRes.data.properties);
      setAmenities(amenitiesRes.data);
      if (user?.role === 'ADMIN') {
        const agentsRes = await userAPI.getUsers({ role: 'AGENT' });
        setAgents(agentsRes.data);
      }
    } catch (error) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      let uploadedImages = [];
      if (imageFiles.length > 0) {
        const uploadResponse = await propertyAPI.uploadImages(imageFiles);
        uploadedImages = uploadResponse.data.images;
      }

      const images = [...formData.images, ...uploadedImages];
      const propertyData = {
        ...formData,
        images,
        coverImage: formData.coverImage || images[0],
        price: Number(formData.price),
        bhk: Number(formData.bhk),
        area: Number(formData.area),
        bedrooms: Number(formData.bedrooms),
        bathrooms: Number(formData.bathrooms),
        floor: formData.floor === '' ? undefined : Number(formData.floor),
        totalFloors: formData.totalFloors === '' ? undefined : Number(formData.totalFloors),
        parking: formData.parking === '' ? 0 : Number(formData.parking),
        constructionYear: formData.constructionYear === '' ? undefined : Number(formData.constructionYear),
        agent: formData.agent || undefined
      };

      const numericErrors = [];
      if (!Number.isFinite(propertyData.price) || propertyData.price <= 0) {
        numericErrors.push('Price must be greater than 0');
      }
      if (!Number.isFinite(propertyData.bhk) || propertyData.bhk < 0) {
        numericErrors.push('BHK cannot be negative');
      }
      if (!Number.isFinite(propertyData.area) || propertyData.area <= 0) {
        numericErrors.push('Area must be greater than 0');
      }
      if (!Number.isFinite(propertyData.bedrooms) || propertyData.bedrooms < 0) {
        numericErrors.push('Bedrooms cannot be negative');
      }
      if (!Number.isFinite(propertyData.bathrooms) || propertyData.bathrooms < 0) {
        numericErrors.push('Bathrooms cannot be negative');
      }
      if (numericErrors.length > 0) {
        toast.error(numericErrors[0]);
        return;
      }

      if (editingProperty) {
        await propertyAPI.updateProperty(editingProperty._id, propertyData);
        toast.success('Property updated successfully');
      } else {
        await propertyAPI.createProperty(propertyData);
        toast.success('Property created successfully');
      }
      setShowModal(false);
      setEditingProperty(null);
      resetForm();
      setImageFiles([]);
      await fetchData();
    } catch (error) {
      const validationMessage = error.response?.data?.errors?.[0]?.message;
      toast.error(validationMessage || error.response?.data?.message || 'Failed to save property');
    } finally {
      setSaving(false);
    }
  };

  const handleImageFiles = (event) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    const maxSize = 5 * 1024 * 1024;
    const selectedFiles = Array.from(event.target.files || []);
    const invalidFile = selectedFiles.find(file => !allowedTypes.includes(file.type) || file.size > maxSize);

    if (invalidFile) {
      toast.error('Use JPEG, PNG, WEBP, or GIF images smaller than 5MB');
      event.target.value = '';
      return;
    }

    setImageFiles(previousFiles => [...previousFiles, ...selectedFiles]);
    event.target.value = '';
  };

  const removeImage = (image) => {
    setFormData(previousData => {
      const images = previousData.images.filter(currentImage => currentImage !== image);
      return {
        ...previousData,
        images,
        coverImage: previousData.coverImage === image ? images[0] || '' : previousData.coverImage
      };
    });
  };

  const addImageUrl = () => {
    const value = imageUrl.trim();
    if (!value) return;
    setFormData(previousData => ({
      ...previousData,
      images: [...previousData.images, value],
      coverImage: previousData.coverImage || value
    }));
    setImageUrl('');
  };

  const handleEdit = (property) => {
    setEditingProperty(property);
    setFormData({
      ...property,
      price: property.price.toString(),
      bhk: property.bhk.toString(),
      area: property.area.toString(),
      bedrooms: property.bedrooms.toString(),
      bathrooms: property.bathrooms.toString(),
      floor: property.floor?.toString() || '',
      totalFloors: property.totalFloors?.toString() || '',
      parking: property.parking.toString(),
      agent: property.agent?._id || '',
      possessionDate: property.possessionDate ? property.possessionDate.split('T')[0] : '',
      constructionYear: property.constructionYear?.toString() || '',
      images: property.images || [],
      coverImage: property.coverImage || property.images?.[0] || '',
      amenities: property.amenities?.map(amenity => amenity._id || amenity) || []
    });
    setImageFiles([]);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      try {
        await propertyAPI.deleteProperty(id);
        toast.success('Property deleted successfully');
        fetchData();
      } catch (error) {
        toast.error('Failed to delete property');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      location: '',
      city: '',
      state: '',
      price: '',
      propertyType: 'APARTMENT',
      bhk: '',
      area: '',
      bedrooms: '',
      bathrooms: '',
      floor: '',
      totalFloors: '',
      parking: '',
      status: 'AVAILABLE',
      agent: '',
      possessionDate: '',
      constructionYear: '',
      images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'],
      coverImage: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
      amenities: []
    });
    setImageFiles([]);
    setImageUrl('');
  };

  const filteredProperties = properties.filter(p =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{user?.role === 'AGENT' ? 'Assigned Properties' : 'Manage Properties'}</h1>
          {user?.role === 'ADMIN' && <button
            onClick={() => {
              resetForm();
              setEditingProperty(null);
              setShowModal(true);
            }}
            className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Property
          </button>}
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center">
            <Search className="h-5 w-5 text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search properties..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Property</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Agent</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredProperties.map((property) => (
                <tr key={property._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <img
                        src={property.coverImage || property.images?.[0] || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'}
                        alt={property.title}
                        className="h-12 w-12 rounded object-cover mr-3"
                      />
                      <div>
                        <div className="font-medium text-gray-900">{property.title}</div>
                        <div className="text-sm text-gray-500">{property.bhk} BHK • {property.area} sqft</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{property.location}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{formatPrice(property.price)}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{property.propertyType}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      property.status === 'AVAILABLE' ? 'bg-green-100 text-green-800' :
                      property.status === 'BOOKED' ? 'bg-red-100 text-red-800' :
                      property.status === 'SOLD' ? 'bg-gray-100 text-gray-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {property.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{property.agent?.name || 'Unassigned'}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleEdit(property)}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      {user?.role === 'ADMIN' && <button
                        onClick={() => handleDelete(property._id)}
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
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
            <div className="bg-white rounded-xl p-6 max-w-4xl w-full mx-4 my-8">
              <h2 className="text-2xl font-bold mb-6">
                {editingProperty ? 'Edit Property' : 'Add New Property'}
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="md:col-span-2 mb-6 border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">Property Images</h3>
                      <p className="text-sm text-gray-500">Add up to 10 images. JPEG, PNG, WEBP, or GIF under 5MB each.</p>
                    </div>
                    <ImagePlus className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex flex-wrap gap-3 mb-4">
                    {formData.images.map((image) => (
                      <div key={image} className="relative w-28">
                        <img src={image} alt="Property" className="h-20 w-28 rounded object-cover" />
                        <button
                          type="button"
                          onClick={() => removeImage(image)}
                          className="absolute -right-2 -top-2 rounded-full bg-red-600 p-1 text-white"
                          aria-label="Remove image"
                        >
                          <X className="h-3 w-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormData(previousData => ({ ...previousData, coverImage: image }))}
                          className={`mt-1 flex w-full items-center justify-center text-xs ${formData.coverImage === image ? 'font-semibold text-blue-600' : 'text-gray-500'}`}
                        >
                          <Star className="mr-1 h-3 w-3" />
                          {formData.coverImage === image ? 'Cover image' : 'Make cover'}
                        </button>
                      </div>
                    ))}
                  </div>
                  {imageFiles.length > 0 && (
                    <p className="mb-3 text-sm text-gray-600">Ready to upload: {imageFiles.map(file => file.name).join(', ')}</p>
                  )}
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <label className="cursor-pointer rounded-lg border border-gray-300 px-4 py-2 text-center text-sm hover:bg-gray-50">
                      Choose image files
                      <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" multiple onChange={handleImageFiles} className="hidden" />
                    </label>
                    <div className="flex flex-1 gap-2">
                      <input
                        type="url"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        placeholder="Add an existing image URL"
                        className="min-w-0 flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm"
                      />
                      <button type="button" onClick={addImageUrl} className="rounded-lg bg-gray-100 px-3 py-2 text-sm hover:bg-gray-200">
                        Add URL
                      </button>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      required
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      rows="3"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <input
                      type="text"
                      required
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({...formData, city: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                    <input
                      type="text"
                      required
                      value={formData.state}
                      onChange={(e) => setFormData({...formData, state: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
                    <select
                      required
                      value={formData.propertyType}
                      onChange={(e) => setFormData({...formData, propertyType: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="APARTMENT">Apartment</option>
                      <option value="VILLA">Villa</option>
                      <option value="HOUSE">House</option>
                      <option value="COMMERCIAL">Commercial</option>
                      <option value="PLOT">Plot</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">BHK</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={formData.bhk}
                      onChange={(e) => setFormData({...formData, bhk: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Area (sqft)</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={formData.area}
                      onChange={(e) => setFormData({...formData, area: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={formData.bedrooms}
                      onChange={(e) => setFormData({...formData, bedrooms: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bathrooms</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={formData.bathrooms}
                      onChange={(e) => setFormData({...formData, bathrooms: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Floor</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.floor}
                      onChange={(e) => setFormData({...formData, floor: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Total Floors</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.totalFloors}
                      onChange={(e) => setFormData({...formData, totalFloors: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Parking</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.parking}
                      onChange={(e) => setFormData({...formData, parking: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      required
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="AVAILABLE">Available</option>
                      <option value="RESERVED">Reserved</option>
                      <option value="BOOKED">Booked</option>
                      <option value="SOLD">Sold</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Agent</label>
                    <select
                      value={formData.agent}
                      onChange={(e) => setFormData({...formData, agent: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Agent</option>
                      {agents.map(agent => (
                        <option key={agent._id} value={agent._id}>{agent.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Possession Date</label>
                    <input
                      type="date"
                      value={formData.possessionDate}
                      onChange={(e) => setFormData({...formData, possessionDate: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Construction Year</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.constructionYear}
                      onChange={(e) => setFormData({...formData, constructionYear: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Amenities</label>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
                      {amenities.map(amenity => (
                        <label key={amenity._id} className="flex items-center gap-2 rounded border border-gray-200 p-2 text-sm text-gray-700">
                          <input
                            type="checkbox"
                            checked={formData.amenities.includes(amenity._id)}
                            onChange={(event) => setFormData(previousData => ({
                              ...previousData,
                              amenities: event.target.checked
                                ? [...previousData.amenities, amenity._id]
                                : previousData.amenities.filter(id => id !== amenity._id)
                            }))}
                          />
                          {amenity.name}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditingProperty(null);
                      resetForm();
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    {saving ? 'Saving...' : editingProperty ? 'Update' : 'Create'}
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

export default AdminProperties;
