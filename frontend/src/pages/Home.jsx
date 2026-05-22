import React from 'react';
import { Link } from 'react-router-dom';
import usePropertyStore from '../stores/propertyStore';

const Home = () => {
  const { properties } = usePropertyStore();
  const featuredProperties = properties.slice(0, 3);

  return (
    <div>
      {/* Hero Section with Real Estate Video Background */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-r from-blue-600 to-purple-700">
        {/* Video Background */}
        <video
          autoPlay
          muted
          loop
          playsInline
          poster="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1600&q=80"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: 0.85,
            zIndex: 1
          }}
        >
          <source src="https://assets.mixkit.co/videos/preview/mixkit-real-estate-agent-showing-a-property-40773-large.mp4" type="video/mp4" />
          <source src="https://assets.mixkit.co/videos/preview/mixkit-real-estate-agent-showing-a-property-40773-large.webm" type="video/webm" />
        </video>
        
        {/* Overlay */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.55)',
          zIndex: 2
        }}></div>

        {/* Content */}
        <div className="relative text-center text-white px-4 max-w-4xl mx-auto" style={{ zIndex: 3 }}>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 drop-shadow-lg animate-fade-in">
            Dream homes, trusted agents, fast closings.
          </h1>
          <p className="text-xl md:text-2xl mb-8 drop-shadow-md font-light max-w-2xl mx-auto">
            Connect with local real estate experts, explore verified listings, and move forward with confidence.
          </p>
          
          {/* Search Bar */}
          <div className="mb-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="text"
              placeholder="Search homes, agents, or neighborhoods"
              className="flex-1 px-6 py-3 rounded-lg text-gray-800 focus:outline-none focus:ring-4 focus:ring-blue-400"
            />
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-200 transform hover:scale-105">
              Find Listings
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/properties" className="bg-white text-blue-600 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg text-lg transition-all duration-200 transform hover:scale-105 shadow-lg">
              Browse Homes
            </Link>
            <Link to="/contact" className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600 font-semibold py-3 px-8 rounded-lg text-lg transition-all duration-200">
              Talk to an Agent
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2" style={{ zIndex: 3 }}>
          <div className="animate-bounce">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-white text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">500+</div>
              <p className="text-lg font-light">Verified Listings</p>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">10K+</div>
              <p className="text-lg font-light">Buyers & Renters Helped</p>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">50+</div>
              <p className="text-lg font-light">Local Agents</p>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">95%</div>
              <p className="text-lg font-light">Success Rate</p>
            </div>
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

        {/* How It Works Section */}
        <div className="bg-gray-50 py-16 mt-16">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-4 text-gray-800">How It Works</h2>
            <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">Simple, transparent, and straightforward process to help you find your perfect property.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { num: 1, title: 'Find Properties', desc: 'Search verified homes, apartments, and investment listings across top neighborhoods.' },
                { num: 2, title: 'Connect with Agents', desc: 'Get matched with local real estate experts who know the market and your needs.' },
                { num: 3, title: 'Tour with Confidence', desc: 'Book viewings, compare homes, and get virtual tours from anywhere.' },
                { num: 4, title: 'Close the Deal', desc: 'Make offers and move forward with trusted support for buyers and sellers.' }
              ].map((step) => (
                <div key={step.num} className="relative">
                  <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 h-full">
                    <div className="w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4 mx-auto">
                      {step.num}
                    </div>
                    <h3 className="text-xl font-semibold mb-3 text-gray-800 text-center">{step.title}</h3>
                    <p className="text-gray-600 text-center leading-relaxed">{step.desc}</p>
                  </div>
                  {step.num < 4 && (
                    <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                      <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="py-16">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-4 text-gray-800">What Our Clients Say</h2>
            <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">Thousands of satisfied customers have found their dream homes through our platform.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { name: 'Sarah Johnson', role: 'Homebuyer', text: 'This platform helped me find my first home in the perfect neighborhood with an agent who understood my priorities.' },
                { name: 'Michael Chen', role: 'Investor', text: 'I found multiple rental prospects quickly and closed on the best deal with clear agent guidance.' },
                { name: 'Emma Davis', role: 'First-time Buyer', text: 'The property tours and financing insights made the buying process feel easy and transparent.' }
              ].map((testimonial, idx) => (
                <div key={idx} className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-gray-700 mb-6 leading-relaxed italic">"{testimonial.text}"</p>
                  <div className="border-t border-gray-200 pt-4">
                    <p className="font-semibold text-gray-800">{testimonial.name}</p>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-700 py-16 mt-16">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold text-white mb-4">Stay Updated</h2>
            <p className="text-blue-100 mb-8 max-w-2xl mx-auto">Subscribe to our newsletter for new property listings, real estate tips, and market updates.</p>
            
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email..."
                className="flex-1 px-6 py-3 rounded-lg text-gray-800 focus:outline-none focus:ring-4 focus:ring-blue-400"
              />
              <button className="bg-white text-blue-600 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg transition-all duration-200 transform hover:scale-105">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Agents CTA Section */}
        <div className="py-16">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold text-gray-800 mb-6">Sell faster with our agent network</h2>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Connect with motivated buyers and renters through our marketplace, get instant leads, and manage property showings with ease.
                </p>
                <ul className="space-y-4 mb-8">
                  {['Showcase listings to motivated buyers', 'Instant lead notifications', 'Smart property matching', 'Tools for fast closings'].map((feature, idx) => (
                    <li key={idx} className="flex items-center text-gray-700">
                      <svg className="w-5 h-5 text-green-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-200 transform hover:scale-105">
                  Join Our Network
                </button>
              </div>
              <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl p-8 min-h-96 flex items-center justify-center">
                <div className="text-center">
                  <svg className="w-24 h-24 text-blue-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  <p className="text-gray-700 text-lg font-semibold">Showcase properties to ready buyers</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;