import React from 'react';
import { Link } from 'react-router-dom';
import usePropertyStore from '../stores/propertyStore';

const Home = () => {
  const { properties } = usePropertyStore();
  const featuredProperties = properties.slice(0, 3);

  return (
    <div>
      <div className="bg-linear-to-r from-blue-600 to-purple-700 min-h-[85vh] flex items-center justify-center">
        <div className="text-center text-white px-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 drop-shadow-lg">Find Your Dream Home</h1>
          <p className="text-xl md:text-2xl mb-8 drop-shadow-md">Discover amazing properties in your area with our expert guidance.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/properties" className="bg-white text-blue-600 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg text-lg transition-all duration-200 transform hover:scale-105 shadow-lg">
              Browse Properties
            </Link>
            <Link to="/contact" className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600 font-semibold py-3 px-8 rounded-lg text-lg transition-all duration-200">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
      <div className="container mx-auto p-8">
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Featured Listings</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Explore top properties hand-picked for buyers and renters.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {featuredProperties.map((prop) => (
            <Link key={prop._id} to={`/property/${prop._id}`} className="group block bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300">
              <img src={prop.images?.[0] || 'data:image/svg+xml;charset=UTF-8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22300%22%3E%3Crect width=%22400%22 height=%22300%22 fill=%22%23e2e8f0%22/%3E%3Ctext x=%22200%22 y=%22150%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22 font-family=%22Arial%2C sans-serif%22 font-size=%2224%22 fill=%22475569%22%3EProperty%3C/text%3E%3C/svg%3E'} alt={prop.title} className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300" />
              <div className="p-6">
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">{prop.title}</h3>
                <p className="text-gray-500 mb-4 line-clamp-2">{prop.description}</p>
                <div className="flex items-center justify-between text-gray-700">
                  <span className="font-bold text-green-600">${prop.price.toLocaleString()}</span>
                  <span className="text-sm uppercase tracking-wide text-gray-500">{prop.type === 'rent' ? 'Rent' : 'Sale'}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">Why Choose Us?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold mb-3 text-gray-800">Expert Agents</h3>
            <p className="text-gray-600 leading-relaxed">Our experienced agents provide personalized service and expert guidance throughout your real estate journey.</p>
          </div>
          <div className="text-center bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold mb-3 text-gray-800">Wide Selection</h3>
            <p className="text-gray-600 leading-relaxed">Browse through thousands of verified listings for sale and rent across prime locations.</p>
          </div>
          <div className="text-center bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold mb-3 text-gray-800">Easy Contact</h3>
            <p className="text-gray-600 leading-relaxed">Get in touch with us anytime through multiple channels for quick responses and support.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;