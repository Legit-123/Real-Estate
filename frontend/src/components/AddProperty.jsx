import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import usePropertyStore from '../stores/propertyStore';
import useUserStore from '../stores/userStore';

const AddProperty = () => {
  const navigate = useNavigate();
  const { addProperty } = usePropertyStore();
  const { user } = useUserStore();
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    country: '',
    state: '',
    city: '',
    type: 'sale',
    agent: user?.name || '',
    area: '',
    bedrooms: '',
    bathrooms: '',
    amenities: '',
    images: '',
    stateImage: '',
    stateFeatures: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newProperty = {
      title: form.title,
      description: form.description,
      price: Number(form.price) || 0,
      location: form.location,
      country: form.country,
      state: form.state,
      city: form.city,
      type: form.type,
      agent: form.agent,
      area: Number(form.area) || 0,
      bedrooms: Number(form.bedrooms) || 0,
      bathrooms: Number(form.bathrooms) || 0,
      amenities: form.amenities
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
      images: form.images
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
      stateImage: form.stateImage,
      stateFeatures: form.stateFeatures
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
    };

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/properties', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newProperty)
      });
      if (response.ok) {
        const addedProperty = await response.json();
        addProperty(addedProperty); // Update local store
        alert('Property added successfully!');
        setForm({
          title: '',
          description: '',
          price: '',
          location: '',
          type: 'sale',
          agent: user?.name || '',
          area: '',
          bedrooms: '',
          bathrooms: '',
          amenities: '',
          images: ''
        });
        navigate('/agent-dashboard');
      } else {
        alert('Failed to add property');
      }
    } catch {
      alert('Error adding property');
    }
  };

  if (!user || user.role !== 'agent') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
        <div className="bg-white rounded-3xl shadow-xl p-10 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-6">You need to be an agent to add a new property.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl w-full space-y-8">
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.84L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.84l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Add A New Listing</h2>
            <p className="text-gray-600 mt-2">Complete the details below to publish your property.</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4 lg:grid-cols-2">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Property Title</label>
                <input 
                  id="title"
                  name="title" 
                  placeholder="Enter property title" 
                  value={form.title} 
                  onChange={handleChange} 
                  required 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea 
                  id="description"
                  name="description" 
                  placeholder="Describe the property" 
                  value={form.description} 
                  onChange={handleChange} 
                  required 
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none"
                />
              </div>
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                <input 
                  id="price"
                  name="price" 
                  type="number" 
                  placeholder="Price" 
                  value={form.price} 
                  onChange={handleChange} 
                  required 
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select 
                  id="type"
                  name="type" 
                  value={form.type} 
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="sale">For Sale</option>
                  <option value="rent">For Rent</option>
                </select>
              </div>
              <div>
                <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                <input 
                  id="country"
                  name="country" 
                  placeholder="Country" 
                  value={form.country} 
                  onChange={handleChange} 
                  required 
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">State</label>
                <input 
                  id="state"
                  name="state" 
                  placeholder="State" 
                  value={form.state} 
                  onChange={handleChange} 
                  required 
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input 
                  id="city"
                  name="city" 
                  placeholder="City" 
                  value={form.city} 
                  onChange={handleChange} 
                  required 
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Full Location</label>
                <input 
                  id="location"
                  name="location" 
                  placeholder="Full address" 
                  value={form.location} 
                  onChange={handleChange} 
                  required 
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
                <input 
                  id="bedrooms"
                  name="bedrooms" 
                  type="number" 
                  placeholder="Bedrooms" 
                  value={form.bedrooms} 
                  onChange={handleChange} 
                  required 
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="bathrooms" className="block text-sm font-medium text-gray-700 mb-1">Bathrooms</label>
                <input 
                  id="bathrooms"
                  name="bathrooms" 
                  type="number" 
                  placeholder="Bathrooms" 
                  value={form.bathrooms} 
                  onChange={handleChange} 
                  required 
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="area" className="block text-sm font-medium text-gray-700 mb-1">Area (sq ft)</label>
                <input 
                  id="area"
                  name="area" 
                  type="number" 
                  placeholder="Area in square feet" 
                  value={form.area} 
                  onChange={handleChange} 
                  required 
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="agent" className="block text-sm font-medium text-gray-700 mb-1">Agent Name</label>
                <input 
                  id="agent"
                  name="agent" 
                  placeholder="Assign to agent" 
                  value={form.agent} 
                  onChange={handleChange} 
                  required 
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="grid gap-4 lg:grid-cols-2">
              <div>
                <label htmlFor="amenities" className="block text-sm font-medium text-gray-700 mb-1">Amenities</label>
                <input 
                  id="amenities"
                  name="amenities" 
                  placeholder="Pool, Garage, Pet Friendly" 
                  value={form.amenities} 
                  onChange={handleChange} 
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="images" className="block text-sm font-medium text-gray-700 mb-1">Image URLs</label>
                <input 
                  id="images"
                  name="images" 
                  placeholder="Enter comma-separated image URLs" 
                  value={form.images} 
                  onChange={handleChange} 
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="stateImage" className="block text-sm font-medium text-gray-700 mb-1">State Image URL</label>
                <input 
                  id="stateImage"
                  name="stateImage" 
                  placeholder="URL for state representative image" 
                  value={form.stateImage} 
                  onChange={handleChange} 
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="stateFeatures" className="block text-sm font-medium text-gray-700 mb-1">State Features</label>
                <input 
                  id="stateFeatures"
                  name="stateFeatures" 
                  placeholder="Comma-separated state features" 
                  value={form.stateFeatures} 
                  onChange={handleChange} 
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <button 
              type="submit" 
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            >
              Add Property
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProperty;