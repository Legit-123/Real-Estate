import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import usePropertyStore from '../stores/propertyStore';
import useUserStore from '../stores/userStore';

const Properties = () => {
  const { properties, loading, error, fetchProperties } = usePropertyStore();
  const { user, savedSearches, toggleFavorite, isFavorite, saveSearch, deleteSearch } = useUserStore();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('');
  const [onlineQuery, setOnlineQuery] = useState('');
  const [onlineLocation, setOnlineLocation] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minBedrooms, setMinBedrooms] = useState('');
  const [maxBedrooms, setMaxBedrooms] = useState('');
  const [minArea, setMinArea] = useState('');
  const [maxArea, setMaxArea] = useState('');
  const [showFavorites, setShowFavorites] = useState(false);
  const [searchName, setSearchName] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [propertiesPerPage] = useState(20); // Show 20 properties per page
  const [sortOption, setSortOption] = useState('default');
  const [compareIds, setCompareIds] = useState([]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const resetPage = () => setCurrentPage(1);
  const googleSearchUrl = (query) => `https://www.google.com/search?q=${encodeURIComponent(query + ' available property')}`;
  const googleMapsUrl = (location) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;

  const handleClearFilters = () => {
    setSearch('');
    setTypeFilter('all');
    setLocationFilter('');
    setMinPrice('');
    setMaxPrice('');
    setMinBedrooms('');
    setMaxBedrooms('');
    setMinArea('');
    setMaxArea('');
    setShowFavorites(false);
    setSortOption('default');
    resetPage();
  };

  const handleToggleCompare = (id) => {
    setCompareIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id].slice(-4)
    );
  };

  const filteredProperties = properties.filter(prop => {
    const matchesSearch = prop.title.toLowerCase().includes(search.toLowerCase()) || prop.location.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'all' || prop.type === typeFilter;
    const matchesLocation = prop.location.toLowerCase().includes(locationFilter.toLowerCase());
    const matchesPrice = (minPrice === '' || prop.price >= parseInt(minPrice)) && (maxPrice === '' || prop.price <= parseInt(maxPrice));
    const matchesBedrooms = (minBedrooms === '' || prop.bedrooms >= parseInt(minBedrooms)) && (maxBedrooms === '' || prop.bedrooms <= parseInt(maxBedrooms));
    const matchesArea = (minArea === '' || prop.area >= parseInt(minArea)) && (maxArea === '' || prop.area <= parseInt(maxArea));
    const matchesFavorites = !showFavorites || (user && isFavorite(prop._id));
    return matchesSearch && matchesType && matchesLocation && matchesPrice && matchesBedrooms && matchesArea && matchesFavorites;
  });

  const sortedProperties = [...filteredProperties].sort((a, b) => {
    switch (sortOption) {
      case 'priceLowHigh':
        return a.price - b.price;
      case 'priceHighLow':
        return b.price - a.price;
      case 'newest':
        return new Date(b.createdAt) - new Date(a.createdAt);
      case 'bedrooms':
        return b.bedrooms - a.bedrooms;
      default:
        return 0;
    }
  });

  const compareProperties = sortedProperties.filter((prop) => compareIds.includes(prop._id));

  // Pagination logic
  const totalPages = Math.ceil(sortedProperties.length / propertiesPerPage);
  const startIndex = (currentPage - 1) * propertiesPerPage;
  const endIndex = startIndex + propertiesPerPage;
  const currentProperties = sortedProperties.slice(startIndex, endIndex);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveSearch = () => {
    if (!user) {
      alert('Login to save searches.');
      return;
    }
    if (!searchName.trim()) {
      alert('Enter a name for the search.');
      return;
    }
    const filters = {
      search,
      typeFilter,
      locationFilter,
      minPrice,
      maxPrice,
      minBedrooms,
      maxBedrooms,
      minArea,
      maxArea,
      showFavorites,
      sortOption
    };
    saveSearch(searchName, filters);
    setSearchName('');
    alert('Search saved!');
  };
  const averagePrice = properties.reduce((sum, prop) => sum + prop.price, 0) / Math.max(properties.length, 1);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto p-8">
        {loading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Loading properties...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-200 px-4 py-3 rounded mb-8">
            <strong>Error:</strong> {error}
            <button
              onClick={fetchProperties}
              className="ml-4 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200 mb-2">Find Your Dream Property</h1>
              <p className="text-gray-600 dark:text-gray-400 text-lg">Browse our extensive collection of properties for sale</p>
            </div>
            
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center justify-between mb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                  <h3 className="text-sm font-semibold uppercase text-blue-600 dark:text-blue-400 mb-2">Total Listings</h3>
                  <p className="text-4xl font-bold text-gray-800 dark:text-gray-200">{properties.length}</p>
                  <p className="text-gray-500 dark:text-gray-400 mt-2">Active homes for sale and rent</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                  <h3 className="text-sm font-semibold uppercase text-blue-600 dark:text-blue-400 mb-2">Filtered Results</h3>
                  <p className="text-4xl font-bold text-gray-800 dark:text-gray-200">{sortedProperties.length}</p>
                  <p className="text-gray-500 dark:text-gray-400 mt-2">Matching your search criteria</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                  <h3 className="text-sm font-semibold uppercase text-blue-600 dark:text-blue-400 mb-2">Average Price</h3>
                  <p className="text-4xl font-bold text-gray-800 dark:text-gray-200">${Math.round(averagePrice).toLocaleString()}</p>
                  <p className="text-gray-500 dark:text-gray-400 mt-2">Price across all listings</p>
                </div>
              </div>
              <div className="flex flex-col gap-3 w-full lg:w-auto">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                  <label className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2">Sort results</label>
                  <select
                    value={sortOption}
                    onChange={(e) => {
                      setSortOption(e.target.value);
                      resetPage();
                    }}
                    className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="default">Best match</option>
                    <option value="priceLowHigh">Price: Low to High</option>
                    <option value="priceHighLow">Price: High to Low</option>
                    <option value="newest">Newest Listings</option>
                    <option value="bedrooms">Most Bedrooms</option>
                  </select>
                </div>
                <button
                  onClick={handleClearFilters}
                  className="rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-5 py-4 font-semibold hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  Clear Filters
                </button>
              </div>
            </div>
            
            {compareProperties.length >= 2 && (
              <div className="bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 p-6 rounded-xl mb-8 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-100">Compare Properties</h2>
                    <p className="text-sm text-blue-700 dark:text-blue-200 mt-1">Comparing {compareProperties.length} selected listings.</p>
                  </div>
                  <button
                    onClick={() => setCompareIds([])}
                    className="rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 font-semibold"
                  >
                    Clear Compare
                  </button>
                </div>
                <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {compareProperties.map((prop) => (
                    <div key={prop._id} className="bg-white dark:bg-gray-800 p-4 rounded-3xl shadow-sm">
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">{prop.title}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{prop.location}</p>
                      <div className="mt-3 text-lg font-bold text-blue-600 dark:text-blue-300">${prop.price.toLocaleString()}</div>
                      <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">{prop.bedrooms} bed · {prop.bathrooms} bath · {prop.area} sq ft</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                <h3 className="text-sm font-semibold uppercase text-blue-600 dark:text-blue-400 mb-2">Total Listings</h3>
                <p className="text-4xl font-bold text-gray-800 dark:text-gray-200">{properties.length}</p>
                <p className="text-gray-500 dark:text-gray-400 mt-2">Active homes for sale and rent</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                <h3 className="text-sm font-semibold uppercase text-blue-600 dark:text-blue-400 mb-2">Filtered Results</h3>
                <p className="text-4xl font-bold text-gray-800 dark:text-gray-200">{sortedProperties.length}</p>
                <p className="text-gray-500 dark:text-gray-400 mt-2">Matching your search criteria</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                <h3 className="text-sm font-semibold uppercase text-blue-600 dark:text-blue-400 mb-2">Average Price</h3>
                <p className="text-4xl font-bold text-gray-800 dark:text-gray-200">${Math.round(averagePrice).toLocaleString()}</p>
                <p className="text-gray-500 dark:text-gray-400 mt-2">Price across all listings</p>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8">
          <div className="grid gap-4 lg:grid-cols-3 mb-4">
            <input
              type="text"
              placeholder="Search by title or location..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                resetPage();
              }}
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-lg"
            />
            <input
              type="text"
              placeholder="Filter by city or state"
              value={locationFilter}
              onChange={(e) => {
                setLocationFilter(e.target.value);
                resetPage();
              }}
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-lg"
            />
            <select
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value);
                resetPage();
              }}
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-lg"
            >
              <option value="all">All Types</option>
              <option value="sale">For Sale</option>
              <option value="rent">For Rent</option>
            </select>
          </div>
          <div className="grid gap-4 lg:grid-cols-4 mb-4">
            <input
              type="number"
              placeholder="Min Price"
              value={minPrice}
              onChange={(e) => {
                setMinPrice(e.target.value);
                resetPage();
              }}
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-lg"
            />
            <input
              type="number"
              placeholder="Max Price"
              value={maxPrice}
              onChange={(e) => {
                setMaxPrice(e.target.value);
                resetPage();
              }}
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-lg"
            />
            <input
              type="number"
              placeholder="Min Bedrooms"
              value={minBedrooms}
              onChange={(e) => {
                setMinBedrooms(e.target.value);
                resetPage();
              }}
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-lg"
            />
            <input
              type="number"
              placeholder="Max Bedrooms"
              value={maxBedrooms}
              onChange={(e) => {
                setMaxBedrooms(e.target.value);
                resetPage();
              }}
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-lg"
            />
          </div>
          <div className="grid gap-4 lg:grid-cols-3 mb-4">
            <input
              type="number"
              placeholder="Min Area (sq ft)"
              value={minArea}
              onChange={(e) => {
                setMinArea(e.target.value);
                resetPage();
              }}
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-lg"
            />
            <input
              type="number"
              placeholder="Max Area (sq ft)"
              value={maxArea}
              onChange={(e) => {
                setMaxArea(e.target.value);
                resetPage();
              }}
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-lg"
            />
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={showFavorites}
                onChange={(e) => {
                  setShowFavorites(e.target.checked);
                  resetPage();
                }}
                className="mr-2"
              />
              Show only favorites
            </label>
          </div>
          {user && (
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Name your search"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleSaveSearch}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg font-semibold transition"
              >
                Save Search
              </button>
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8 border border-dashed border-blue-200 dark:border-blue-700">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Search Online Properties</h2>
            <p className="text-gray-500 dark:text-gray-400">Use Google search or Google Maps to find fresh available properties and location details.</p>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Online listing search</label>
              <input
                type="text"
                placeholder="Example: 2 bedroom apartment near Boston"
                value={onlineQuery}
                onChange={(e) => setOnlineQuery(e.target.value)}
                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search location on Google Maps</label>
              <input
                type="text"
                placeholder="Example: Miami, FL"
                value={onlineLocation}
                onChange={(e) => setOnlineLocation(e.target.value)}
                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-lg"
              />
            </div>
          </div>
          <div className="mt-6 flex flex-col sm:flex-row gap-4">
            <a
              href={googleSearchUrl(onlineQuery || 'available properties')}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 font-semibold transition"
            >
              Search Google Listings
            </a>
            <a
              href={googleMapsUrl(onlineLocation || locationFilter || 'available property')}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 px-6 font-semibold transition"
            >
              Open Location in Maps
            </a>
          </div>
        </div>

        {user && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h3 className="text-lg font-semibold mb-4">Saved Searches</h3>
            <div className="space-y-2">
              {savedSearches?.map(saved => (
                <div key={saved.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span>{saved.name}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setSearch(saved.filters.search || '');
                        setTypeFilter(saved.filters.typeFilter || 'all');
                        setLocationFilter(saved.filters.locationFilter || '');
                        setMinPrice(saved.filters.minPrice || '');
                        setMaxPrice(saved.filters.maxPrice || '');
                        setMinBedrooms(saved.filters.minBedrooms || '');
                        setMaxBedrooms(saved.filters.maxBedrooms || '');
                        setMinArea(saved.filters.minArea || '');
                        setMaxArea(saved.filters.maxArea || '');
                        setShowFavorites(saved.filters.showFavorites || false);
                        setSortOption(saved.filters.sortOption || 'default');
                        resetPage();
                      }}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                    >
                      Load
                    </button>
                    <button
                      onClick={() => deleteSearch(saved.id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
              {savedSearches?.length === 0 && (
                <div className="p-4 text-sm text-gray-500">No saved searches yet. Save one to revisit filters quickly.</div>
              )}
            </div>
          </div>
        )}
        {/* Page Info */}
        {sortedProperties.length > 0 && (
          <div className="text-center mb-4 text-gray-600 dark:text-gray-400">
            Showing {startIndex + 1}-{Math.min(endIndex, sortedProperties.length)} of {sortedProperties.length} properties
            {totalPages > 1 && ` (Page ${currentPage} of ${totalPages})`}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
          {currentProperties.map(prop => (
            <div key={prop._id} className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden transform hover:-translate-y-0.5">
              {prop.images && prop.images.length > 0 && (
                <div className="relative">
                  <img src={prop.images[0]} alt={prop.title} className="w-full h-36 object-cover" />
                  <div className="absolute top-3 right-3 bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
                    {prop.type === 'sale' ? 'For Sale' : 'For Rent'}
                  </div>
                </div>
              )}
              <div className="p-4 space-y-3">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-1 line-clamp-2">{prop.title}</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{prop.description}</p>
                <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <span>{prop.bedrooms} bd</span>
                  <span>·</span>
                  <span>{prop.bathrooms} ba</span>
                  <span>·</span>
                  <span>{prop.area} sqft</span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-lg font-bold text-green-600 dark:text-green-400">${prop.price.toLocaleString()}</div>
                    {prop.type === 'rent' && <div className="text-xs text-gray-500 dark:text-gray-400">/month</div>}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{prop.location}</div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {prop.amenities?.slice(0, 2).map((amenity) => (
                    <span key={amenity} className="inline-flex items-center rounded-full bg-gray-100 dark:bg-gray-700 px-2 py-1 text-[11px] font-medium text-gray-700 dark:text-gray-300">
                      {amenity}
                    </span>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (!user) {
                        alert('Login to save favorites.');
                        return;
                      }
                      toggleFavorite(prop._id);
                    }}
                    className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${isFavorite(prop._id) ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                  >
                    {isFavorite(prop._id) ? 'Saved' : 'Save'}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleToggleCompare(prop._id)}
                    className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${compareIds.includes(prop._id) ? 'bg-yellow-500 text-white hover:bg-yellow-600' : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                  >
                    {compareIds.includes(prop._id) ? 'Comparing' : 'Compare'}
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    to={`/property/${prop._id}`}
                    className="rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-2 text-center"
                  >
                    Details
                  </Link>
                  <a
                    href={googleMapsUrl(prop.location)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 text-xs font-semibold py-2 text-center"
                  >
                    Map
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-8 mb-8">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNumber;
                if (totalPages <= 5) {
                  pageNumber = i + 1;
                } else if (currentPage <= 3) {
                  pageNumber = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNumber = totalPages - 4 + i;
                } else {
                  pageNumber = currentPage - 2 + i;
                }
                
                return (
                  <button
                    key={pageNumber}
                    onClick={() => handlePageChange(pageNumber)}
                    className={`px-4 py-2 text-sm font-medium rounded-lg ${
                      currentPage === pageNumber
                        ? 'text-white bg-blue-600 border border-blue-600'
                        : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              })}
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {sortedProperties.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.84L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.84l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No properties found</h3>
            <p className="text-gray-500">Try adjusting your search criteria or clearing some filters</p>
          </div>
        )}
          </>
        )}
      </div>
    </div>
  );
};

export default Properties;