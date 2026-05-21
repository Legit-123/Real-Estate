import { create } from 'zustand';

const usePropertyStore = create((set, get) => ({
  properties: [],
  loading: false,
  error: null,

  // Fetch properties from API with optional query params
  fetchProperties: async (params = {}) => {
    set({ loading: true, error: null });
    try {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          searchParams.append(key, value);
        }
      });
      const query = searchParams.toString();
      const response = await fetch(`/api/properties${query ? `?${query}` : ''}`);
      if (!response.ok) throw new Error('Failed to fetch properties');
      const properties = await response.json();
      set({ properties, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  // Add property
  addProperty: async (propertyData) => {
    try {
      const response = await fetch('/api/properties', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(propertyData)
      });
      if (!response.ok) throw new Error('Failed to add property');
      const newProperty = await response.json();
      set(state => ({ properties: [...state.properties, newProperty] }));
      return newProperty;
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  // Update property
  updateProperty: async (id, propertyData) => {
    try {
      const response = await fetch(`/api/properties/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(propertyData)
      });
      if (!response.ok) throw new Error('Failed to update property');
      const updatedProperty = await response.json();
      set(state => ({
        properties: state.properties.map(prop =>
          prop._id === id ? updatedProperty : prop
        )
      }));
      return updatedProperty;
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  // Delete property
  deleteProperty: async (id) => {
    try {
      const response = await fetch(`/api/properties/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) throw new Error('Failed to delete property');
      set(state => ({
        properties: state.properties.filter(prop => prop._id !== id)
      }));
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  // Fetch a single property by id and store it
  fetchPropertyById: async (id) => {
    try {
      const response = await fetch(`/api/properties/${id}`);
      if (!response.ok) throw new Error('Failed to fetch property');
      const property = await response.json();
      set((state) => ({
        properties: state.properties.some((prop) => prop._id === id)
          ? state.properties.map((prop) => (prop._id === id ? property : prop))
          : [...state.properties, property]
      }));
      return property;
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  // Increment view count for a property and refresh it locally
  incrementView: async (id) => {
    return await get().fetchPropertyById(id);
  }
}));

export default usePropertyStore;