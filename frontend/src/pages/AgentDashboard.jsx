import React from 'react';
import { Link } from 'react-router-dom';
import useUserStore from '../stores/userStore';
import usePropertyStore from '../stores/propertyStore';

const AgentDashboard = () => {
  const { user } = useUserStore();
  const { properties } = usePropertyStore();

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
        <div className="bg-white rounded-3xl shadow-xl p-10 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Agent Dashboard</h1>
          <p className="text-gray-600 mb-6">Please log in with an agent account to view your dashboard.</p>
          <Link to="/login" className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-semibold">
            Login
          </Link>
        </div>
      </div>
    );
  }

  if (user.role !== 'agent') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
        <div className="bg-white rounded-3xl shadow-xl p-10 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-6">This dashboard is only available for users with an agent role.</p>
          <Link to="/properties" className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-semibold">
            Browse Properties
          </Link>
        </div>
      </div>
    );
  }

  const agentProperties = properties.filter((prop) => prop.agent === user.name);
  const totalListings = agentProperties.length;
  const rentalCount = agentProperties.filter((prop) => prop.type === 'rent').length;
  const saleCount = agentProperties.filter((prop) => prop.type === 'sale').length;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-gray-900">Agent Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your listings, view performance, and add new properties.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <h2 className="text-sm uppercase tracking-wide text-blue-600 font-semibold mb-3">Total Listings</h2>
            <p className="text-4xl font-bold text-gray-900">{totalListings}</p>
          </div>
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <h2 className="text-sm uppercase tracking-wide text-green-600 font-semibold mb-3">For Rent</h2>
            <p className="text-4xl font-bold text-gray-900">{rentalCount}</p>
          </div>
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <h2 className="text-sm uppercase tracking-wide text-purple-600 font-semibold mb-3">For Sale</h2>
            <p className="text-4xl font-bold text-gray-900">{saleCount}</p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 mb-10">
          <div className="bg-white rounded-3xl shadow-xl p-8 flex-1">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your Listings</h2>
            {agentProperties.length === 0 ? (
              <p className="text-gray-600">You have not added any listings yet.</p>
            ) : (
              <div className="space-y-4">
                {agentProperties.map((prop) => (
                  <div key={prop._id} className="border border-gray-200 rounded-3xl p-5">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">{prop.title}</h3>
                        <p className="text-gray-500">{prop.location} • {prop.type}</p>
                      </div>
                      <span className="text-green-600 font-bold">${prop.price.toLocaleString()}</span>
                    </div>
                    <p className="text-gray-600 mt-3 line-clamp-3">{prop.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-8 lg:w-96">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <Link to="/add-property" className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-full mb-4">
              Add New Listing
            </Link>
            <div className="rounded-3xl border border-dashed border-gray-300 p-6 bg-blue-50">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Pro tip</h3>
              <p className="text-gray-600">Add more images and amenities to make your listings stand out in search results.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentDashboard;
