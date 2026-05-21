import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import usePropertyStore from '../stores/propertyStore';

const Locations = () => {
  const { properties, loading, error, fetchProperties } = usePropertyStore();
  const [selectedState, setSelectedState] = useState(null);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  // Group properties by state
  const states = properties.reduce((acc, prop) => {
    const state = prop.state;
    if (!acc[state]) {
      acc[state] = {
        name: state,
        country: prop.country,
        properties: [],
        image: prop.stateImage,
        features: prop.stateFeatures,
        avgPrice: 0,
        count: 0
      };
    }
    acc[state].properties.push(prop);
    acc[state].count += 1;
    acc[state].avgPrice += prop.price;
    return acc;
  }, {});

  // Calculate average prices
  Object.values(states).forEach(state => {
    state.avgPrice = Math.round(state.avgPrice / state.count);
  });

  const stateList = Object.values(states);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="ml-2 text-gray-600 dark:text-gray-400">Loading locations...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-200 px-4 py-3 rounded">
          <strong>Error:</strong> {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200 mb-2">Explore by Location</h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">Discover properties across different states and regions</p>
        </div>

        {!selectedState ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stateList.map(state => (
              <div
                key={state.name}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setSelectedState(state)}
              >
                <img src={state.image} alt={state.name} className="w-full h-48 object-cover" />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
                    {state.name}, {state.country}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-2">
                    {state.count} properties available
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Average Price: ${state.avgPrice.toLocaleString()}
                  </p>
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Features:</h4>
                    <ul className="text-sm text-gray-600 dark:text-gray-400">
                      {state.features.map((feature, index) => (
                        <li key={index} className="mb-1">• {feature}</li>
                      ))}
                    </ul>
                  </div>
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
                    View Properties
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div>
            <button
              onClick={() => setSelectedState(null)}
              className="mb-4 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
            >
              ← Back to States
            </button>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8">
              <img src={selectedState.image} alt={selectedState.name} className="w-full h-64 object-cover rounded-lg mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">
                {selectedState.name}, {selectedState.country}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {selectedState.count} properties • Average Price: ${selectedState.avgPrice.toLocaleString()}
              </p>
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">State Features:</h3>
                <ul className="text-gray-600 dark:text-gray-400">
                  {selectedState.features.map((feature, index) => (
                    <li key={index} className="mb-1">• {feature}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {selectedState.properties.map(prop => (
                <div key={prop._id} className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                  <img src={prop.images[0]} alt={prop.title} className="w-full h-48 object-cover" />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                      {prop.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-2">{prop.location}</p>
                    <p className="text-blue-600 dark:text-blue-400 font-bold mb-2">
                      ${prop.price.toLocaleString()} {prop.type === 'rent' ? '/month' : ''}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                      {prop.bedrooms} bed • {prop.bathrooms} bath • {prop.area} sqft
                    </p>
                    <Link
                      to={`/property/${prop._id}`}
                      className="block text-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Locations;