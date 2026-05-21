import { create } from 'zustand';

const storedUser = JSON.parse(localStorage.getItem('user')) || null;
const storedToken = localStorage.getItem('token') || null;
const storedFavorites = storedUser ? JSON.parse(localStorage.getItem(`favorites_${storedUser._id}`)) || [] : [];
const storedSavedSearches = storedUser ? JSON.parse(localStorage.getItem(`savedSearches_${storedUser._id}`)) || [] : [];

const useUserStore = create((set, get) => ({
  users: [
    { _id: '1', name: 'John Doe', email: 'john@example.com', password: 'pass', role: 'agent' },
    { _id: '2', name: 'Jane Smith', email: 'jane@example.com', password: 'pass', role: 'agent' }
  ],
  user: storedUser,
  token: storedToken,
  favorites: storedFavorites,
  savedSearches: storedSavedSearches,
  login: (user, token) => {
    const savedFavorites = JSON.parse(localStorage.getItem(`favorites_${user._id}`)) || [];
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
    set({ user, token, favorites: savedFavorites });
  },
  logout: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    set({ user: null, token: null, favorites: [], savedSearches: [] });
  },
  register: (newUser) => set((state) => ({ users: [...state.users, { _id: Date.now().toString(), ...newUser }] })),
  toggleFavorite: (propertyId) => {
    const user = get().user;
    if (!user) return;
    const favorites = get().favorites;
    const updatedFavorites = favorites.includes(propertyId)
      ? favorites.filter((id) => id !== propertyId)
      : [...favorites, propertyId];
    localStorage.setItem(`favorites_${user._id}`, JSON.stringify(updatedFavorites));
    set({ favorites: updatedFavorites });
  },
  isFavorite: (propertyId) => get().favorites.includes(propertyId),
  saveSearch: (searchName, filters) => {
    const user = get().user;
    if (!user) return;
    const savedSearches = get().savedSearches;
    const newSearch = { id: Date.now().toString(), name: searchName, filters };
    const updatedSearches = [...savedSearches, newSearch];
    localStorage.setItem(`savedSearches_${user._id}`, JSON.stringify(updatedSearches));
    set({ savedSearches: updatedSearches });
  },
  deleteSearch: (searchId) => {
    const user = get().user;
    if (!user) return;
    const savedSearches = get().savedSearches.filter(s => s.id !== searchId);
    localStorage.setItem(`savedSearches_${user._id}`, JSON.stringify(savedSearches));
    set({ savedSearches });
  },
}));

export default useUserStore;