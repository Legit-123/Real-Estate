import React from 'react';
import usePropertyStore from '../stores/propertyStore';

const Agents = () => {
  const { properties } = usePropertyStore();

  const agents = [...new Set(properties.map(prop => prop.agent))];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Meet Our Agents</h1>
          <p className="text-gray-600 text-lg">Professional real estate agents ready to help you</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {agents.map(agent => (
            <div key={agent} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-8">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-linear-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mr-4">
                  {agent.charAt(0)}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">{agent}</h2>
                  <p className="text-gray-600">Real Estate Agent</p>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.84L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.84l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                  </svg>
                  Properties ({properties.filter(prop => prop.agent === agent).length})
                </h3>
                <div className="space-y-2">
                  {properties.filter(prop => prop.agent === agent).map(prop => (
                    <div key={prop._id} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                      <span className="font-medium text-gray-800">{prop.title}</span>
                      <div className="text-right">
                        <div className="font-semibold text-green-600">${prop.price.toLocaleString()}</div>
                        <div className="text-sm text-gray-500 capitalize">{prop.type}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200">
                Contact Agent
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Agents;