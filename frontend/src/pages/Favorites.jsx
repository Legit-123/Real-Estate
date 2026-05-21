import React from 'react';
import { Link } from 'react-router-dom';
import usePropertyStore from '../stores/propertyStore';
import useUserStore from '../stores/userStore';

const Favorites = () => {
  const { user, favorites, toggleFavorite } = useUserStore();
  const { properties } = usePropertyStore();

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
        <div className="bg-white rounded-3xl shadow-xl p-10 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Favorites</h1>
          <p className="text-gray-600 mb-6">You need to log in to save and view your favorite properties.</p>
          <Link to="/login" className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-semibold">
            Login Now
          </Link>
        </div>
      </div>
    );
  }

  const favoriteProperties = properties.filter((prop) => favorites.includes(prop._id));

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-gray-900">My Favorites</h1>
          <p className="text-gray-600 mt-2">Saved listings you can return to anytime.</p>
        </div>

        {favoriteProperties.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-xl p-10 text-center">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">No favorites yet</h2>
            <p className="text-gray-600 mb-6">Browse properties and save your favorites to view them later.</p>
            <Link to="/properties" className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-semibold">
              Browse Properties
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {favoriteProperties.map((prop) => (
              <div key={prop._id} className="bg-white rounded-3xl shadow-lg overflow-hidden">
                <img src={prop.images?.[0] || 'data:image/svg+xml;charset=UTF-8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22300%22%3E%3Crect width=%22400%22 height=%22300%22 fill=%22%23e2e8f0%22/%3E%3Ctext x=%22200%22 y=%22150%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22 font-family=%22Arial%2C sans-serif%22 font-size=%2224%22 fill=%22475569%22%3EProperty%3C/text%3E%3C/svg%3E'} alt={prop.title} className="w-full h-56 object-cover" />
                <div className="p-6">
                  <div className="flex justify-between items-start gap-4 mb-4">
                    <div>
                      <h3 className="text-2xl font-semibold text-gray-900">{prop.title}</h3>
                      <p className="text-gray-500">{prop.location}</p>
                    </div>
                    <button
                      onClick={() => toggleFavorite(prop._id)}
                      className="text-red-600 hover:text-red-700 font-semibold"
                    >
                      Remove
                    </button>
                  </div>
                  <p className="text-gray-600 mb-4 line-clamp-3">{prop.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-green-600">${prop.price.toLocaleString()}</span>
                    <Link to={`/property/${prop._id}`} className="text-blue-600 hover:text-blue-700 font-semibold">
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
