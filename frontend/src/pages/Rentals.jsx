import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import usePropertyStore from '../stores/propertyStore';
import useUserStore from '../stores/userStore';

const Rentals = () => {
  const { properties } = usePropertyStore();
  const { user, toggleFavorite, isFavorite } = useUserStore();
  const [search, setSearch] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isOnlineLoading, setIsOnlineLoading] = useState(false);

  useEffect(() => {
    if (!search.trim()) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsOnlineLoading(true);
      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=5&q=${encodeURIComponent(search)}`);
        const data = await response.json();
        setSuggestions(data);
      } catch {
        setSuggestions([]);
      } finally {
        setIsOnlineLoading(false);
      }
    }, 450);

    return () => clearTimeout(timer);
  }, [search]);

  const selectSuggestion = (place) => {
    setSearch(place.display_name);
    setLocationFilter(place.display_name);
    setSuggestions([]);
  };

  const rentals = properties.filter(prop => prop.type === 'rent');
  const filteredRentals = rentals.filter(prop =>
    prop.title.toLowerCase().includes(search.toLowerCase()) ||
    prop.location.toLowerCase().includes(search.toLowerCase())
  ).filter(prop =>
    prop.location.toLowerCase().includes(locationFilter.toLowerCase())
  );

  const mapUrl = (location) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;
  const totalRentals = rentals.length;
  const averageRent = Math.round(rentals.reduce((sum, prop) => sum + prop.price, 0) / Math.max(totalRentals, 1));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Rental Properties</h1>
          <p className="text-gray-600 text-lg">Find the perfect rental home for your needs</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-sm font-semibold uppercase text-green-600 mb-2">Total Rentals</h3>
            <p className="text-4xl font-bold text-gray-800">{totalRentals}</p>
            <p className="text-gray-500 mt-2">Current rental listings</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-sm font-semibold uppercase text-green-600 mb-2">Average Rent</h3>
            <p className="text-4xl font-bold text-gray-800">${averageRent}</p>
            <p className="text-gray-500 mt-2">Approximate monthly rent</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-sm font-semibold uppercase text-green-600 mb-2">Why Rent With Us</h3>
            <p className="text-gray-500">Trusted agents, flexible leases, and hand-picked rental homes.</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Search rentals by title or location..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-lg"
              />
              {suggestions.length > 0 && (
                <div className="absolute z-20 left-0 right-0 mt-2 rounded-2xl border border-gray-200 bg-white shadow-xl overflow-hidden">
                  {isOnlineLoading ? (
                    <div className="p-3 text-sm text-gray-500">Searching online for locations...</div>
                  ) : (
                    suggestions.map((place) => (
                      <button
                        key={place.place_id}
                        type="button"
                        onClick={() => selectSuggestion(place)}
                        className="w-full text-left px-4 py-3 hover:bg-green-50 transition"
                      >
                        <span className="block text-sm font-medium text-gray-900">{place.display_name}</span>
                        <span className="block text-xs text-gray-500">Online location result</span>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
            <input
              type="text"
              placeholder="Filter by city or state"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-lg"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredRentals.map(prop => (
            <div key={prop._id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1">
              {prop.images && prop.images.length > 0 && (
                <div className="relative">
                  <img src={prop.images[0]} alt={prop.title} className="w-full h-48 object-cover" />
                  <div className="absolute top-3 right-3 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    For Rent
                  </div>
                </div>
              )}
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">{prop.title}</h2>
                <p className="text-gray-600 mb-3 line-clamp-3">{prop.description}</p>
                <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500 mb-4">
                  <span>{prop.bedrooms > 0 ? `${prop.bedrooms} bed` : 'Studio'}</span>
                  <span>·</span>
                  <span>{prop.bathrooms} bath</span>
                  <span>·</span>
                  <span>{prop.area} sq ft</span>
                </div>
                <div className="flex items-center mb-2">
                  <span className="text-2xl font-bold text-green-600">${prop.price.toLocaleString()}</span>
                  <span className="text-gray-500 ml-1">/month</span>
                </div>
                <div className="flex items-center text-gray-500 mb-4">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  {prop.location}
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {prop.amenities?.slice(0, 3).map((amenity) => (
                    <span key={amenity} className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                      {amenity}
                    </span>
                  ))}
                </div>
                <div className="text-sm text-gray-500 mb-4">Agent: <span className="font-semibold text-gray-800">{prop.agent}</span></div>
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      if (!user) {
                        alert('Login to save favorites.');
                        return;
                      }
                      toggleFavorite(prop._id);
                    }}
                    className={`rounded-lg px-4 py-2 font-semibold transition ${isFavorite(prop._id) ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
                  >
                    {isFavorite(prop._id) ? 'Saved' : 'Save'}
                  </button>
                  <Link
                    to={`/property/${prop._id}`}
                    className="rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 transition-colors duration-200"
                  >
                    View Details
                  </Link>
                  <a
                    href={mapUrl(prop.location)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 px-4 transition-colors duration-200"
                  >
                    Open Map
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {filteredRentals.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.84L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.84l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No rental properties available</h3>
            <p className="text-gray-500">Check back later for new listings</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Rentals;