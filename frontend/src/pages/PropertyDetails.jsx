import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import usePropertyStore from '../stores/propertyStore';
import useUserStore from '../stores/userStore';

const PropertyDetails = () => {
  const { id } = useParams();
  const { properties, fetchPropertyById, incrementView } = usePropertyStore();
  const { user, isFavorite, toggleFavorite } = useUserStore();
  const [property, setProperty] = useState(() => properties.find((item) => item._id === id));
  const [loadingProperty, setLoadingProperty] = useState(!property);
  const [detailError, setDetailError] = useState(null);
  const [downPayment, setDownPayment] = useState('');
  const [interestRate, setInterestRate] = useState('6.5');
  const [loanTerm, setLoanTerm] = useState('30');
  const [taxRate, setTaxRate] = useState('8');
  const didIncrementView = useRef(false);

  useEffect(() => {
    didIncrementView.current = false;
  }, [id]);

  useEffect(() => {
    let isActive = true;

    const loadProperty = async () => {
      setLoadingProperty(true);
      try {
        const fetchedProperty = await fetchPropertyById(id);
        if (isActive) {
          setProperty(fetchedProperty);
          setDetailError(null);
        }
      } catch (error) {
        if (isActive) {
          setDetailError(error.message || 'Cannot load property details.');
        }
      } finally {
        if (isActive) setLoadingProperty(false);
      }
    };

    if (!property) {
      loadProperty();
    } else if (!didIncrementView.current) {
      didIncrementView.current = true;
      incrementView(id)
        .then((updated) => {
          if (isActive) setProperty(updated);
        })
        .catch(() => {});
    }

    return () => {
      isActive = false;
    };
  }, [id, property, fetchPropertyById, incrementView]);

  const calculateMortgage = () => {
    if (!property || property.type === 'rent') return null;
    const principal = property.price - (parseFloat(downPayment) || 0);
    const rate = parseFloat(interestRate) / 100 / 12;
    const term = parseInt(loanTerm, 10) * 12;
    if (principal <= 0 || rate <= 0 || term <= 0) return null;
    const monthlyPayment = (principal * rate * Math.pow(1 + rate, term)) / (Math.pow(1 + rate, term) - 1);
    return monthlyPayment.toFixed(2);
  };

  const calculatePropertyTax = () => {
    if (!property || property.type === 'rent') return null;
    const rate = parseFloat(taxRate) / 100;
    if (Number.isNaN(rate) || rate < 0) return null;
    return property.price * rate;
  };

  const calculateMonthlyPaymentWithTax = () => {
    const mortgage = Number(calculateMortgage());
    const tax = calculatePropertyTax();
    if (Number.isNaN(mortgage) || tax === null) return null;
    return (mortgage + tax / 12).toFixed(2);
  };

  const taxAmount = calculatePropertyTax();
  const totalPurchaseCost = taxAmount !== null ? property?.price + taxAmount : null;

  if (loadingProperty) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Loading property details...</p>
        </div>
      </div>
    );
  }

  if (detailError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
        <div className="bg-white rounded-xl shadow-lg p-10 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Unable to load property</h1>
          <p className="text-gray-600 mb-6">{detailError}</p>
          <Link to="/properties" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg">
            Back to Properties
          </Link>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
        <div className="bg-white rounded-xl shadow-lg p-10 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Property not found</h1>
          <p className="text-gray-600 mb-6">The listing you are looking for does not exist or has been removed.</p>
          <Link to="/properties" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg">
            Back to Properties
          </Link>
        </div>
      </div>
    );
  }

  const favorite = isFavorite(property._id);
  const handleFavorite = () => {
    if (!user) {
      alert('Please log in to save favorites.');
      return;
    }
    toggleFavorite(property._id);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3 bg-white rounded-3xl shadow-xl overflow-hidden">
            <img src={property.images?.[0] || 'data:image/svg+xml;charset=UTF-8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22300%22%3E%3Crect width=%22400%22 height=%22300%22 fill=%22%23e2e8f0%22/%3E%3Ctext x=%22200%22 y=%22150%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22 font-family=%22Arial%2C sans-serif%22 font-size=%2224%22 fill=%22475569%22%3EProperty%3C/text%3E%3C/svg%3E'} alt={property.title} className="w-full h-96 object-cover" />
            <div className="p-8">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 mb-3">{property.title}</h1>
                  <p className="text-gray-500 text-lg">{property.location}</p>
                </div>
                <button
                  onClick={handleFavorite}
                  className={`inline-flex items-center gap-2 px-5 py-3 rounded-full font-semibold transition ${favorite ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
                >
                  {favorite ? 'Saved' : 'Save Favorite'}
                </button>
              </div>
              <div className="mb-6">
                <span className="inline-flex items-center rounded-full bg-blue-100 text-blue-700 px-3 py-1 text-sm font-medium mr-2">{property.type === 'rent' ? 'For Rent' : 'For Sale'}</span>
                <span className="inline-flex items-center rounded-full bg-green-100 text-green-700 px-3 py-1 text-sm font-medium">{property.amenities?.[0] || 'Featured'}</span>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-8 text-gray-700">
                <div className="bg-gray-50 p-5 rounded-3xl shadow-sm">
                  <p className="text-sm uppercase tracking-wide font-semibold">Price</p>
                  <p className="text-2xl font-bold mt-2">${property.price.toLocaleString()}</p>
                  {property.type === 'rent' && <p className="text-sm text-gray-500">per month</p>}
                </div>
                <div className="bg-gray-50 p-5 rounded-3xl shadow-sm">
                  <p className="text-sm uppercase tracking-wide font-semibold">Views</p>
                  <p className="text-2xl font-bold mt-2">{property.viewCount || 0}</p>
                  <p className="text-sm text-gray-500">Total views</p>
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-3">Overview</h2>
                  <p className="text-gray-600 leading-relaxed">{property.description}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 p-5 rounded-3xl shadow-sm">
                    <p className="text-sm uppercase text-gray-500">Bedrooms</p>
                    <p className="text-xl font-bold mt-2">{property.bedrooms || 'N/A'}</p>
                  </div>
                  <div className="bg-gray-50 p-5 rounded-3xl shadow-sm">
                    <p className="text-sm uppercase text-gray-500">Bathrooms</p>
                    <p className="text-xl font-bold mt-2">{property.bathrooms || 'N/A'}</p>
                  </div>
                  <div className="bg-gray-50 p-5 rounded-3xl shadow-sm">
                    <p className="text-sm uppercase text-gray-500">Area</p>
                    <p className="text-xl font-bold mt-2">{property.area ? `${property.area} sq ft` : 'N/A'}</p>
                  </div>
                </div>
              </div>

              <div className="mt-10">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Amenities</h2>
                <div className="flex flex-wrap gap-3">
                  {property.amenities?.map((amenity) => (
                    <span key={amenity} className="rounded-full bg-blue-50 text-blue-700 px-4 py-2 text-sm font-medium">
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
              <div className="mt-10">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Map</h2>
                <div className="overflow-hidden rounded-3xl border border-gray-200 shadow-sm">
                  <iframe
                    title="Property Location"
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(property.location)}&output=embed`}
                    className="w-full h-72"
                    loading="lazy"
                  />
                </div>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(property.location)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center justify-center w-full rounded-full bg-blue-600 px-6 py-3 text-white font-semibold hover:bg-blue-700"
                >
                  Open Location in Google Maps
                </a>
              </div>
            </div>
          </div>
          <aside className="lg:w-1/3 space-y-6">
            <div className="bg-white rounded-3xl shadow-xl p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Agent</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Agent name</p>
                  <p className="text-lg font-semibold text-gray-800">{property.agent}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="text-lg font-semibold text-gray-800">+1 (555) 123-4567</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="text-lg font-semibold text-gray-800">agent@legitestate.com</p>
                </div>
              </div>
              <Link to="/contact" className="mt-6 inline-flex w-full justify-center rounded-full bg-blue-600 px-6 py-3 text-white font-semibold hover:bg-blue-700">
                Send Inquiry
              </Link>
            </div>
            <div className="bg-white rounded-3xl shadow-xl p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Listing Details</h2>
              <ul className="space-y-3 text-gray-600">
                <li><span className="font-semibold text-gray-900">Location:</span> {property.location}</li>
                <li><span className="font-semibold text-gray-900">Type:</span> {property.type === 'rent' ? 'Rent' : 'Sale'}</li>
                <li><span className="font-semibold text-gray-900">Agent:</span> {property.agent}</li>
                <li><span className="font-semibold text-gray-900">Status:</span> Available</li>
              </ul>
            </div>
            {property.type === 'sale' && (
              <div className="bg-white rounded-3xl shadow-xl p-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Mortgage Calculator</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Down Payment ($)</label>
                    <input
                      type="number"
                      value={downPayment}
                      onChange={(e) => setDownPayment(e.target.value)}
                      placeholder="e.g., 50000"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Interest Rate (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={interestRate}
                      onChange={(e) => setInterestRate(e.target.value)}
                      placeholder="e.g., 6.5"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Loan Term (years)</label>
                    <select
                      value={loanTerm}
                      onChange={(e) => setLoanTerm(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="15">15 years</option>
                      <option value="20">20 years</option>
                      <option value="30">30 years</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Property Tax Rate (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={taxRate}
                      onChange={(e) => setTaxRate(e.target.value)}
                      placeholder="e.g., 8"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  {calculateMortgage() && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg space-y-3">
                      <div>
                        <p className="text-sm text-gray-600">Estimated Monthly Payment</p>
                        <p className="text-2xl font-bold text-blue-600">${calculateMortgage()}</p>
                      </div>
                      {taxAmount !== null && (
                        <div>
                          <p className="text-sm text-gray-600">Estimated Annual Property Tax</p>
                          <p className="text-2xl font-bold text-blue-600">${taxAmount.toFixed(2)}</p>
                        </div>
                      )}
                      {calculateMonthlyPaymentWithTax() && (
                        <div>
                          <p className="text-sm text-gray-600">Estimated Monthly Payment + Tax</p>
                          <p className="text-2xl font-bold text-blue-600">${calculateMonthlyPaymentWithTax()}</p>
                        </div>
                      )}
                      {totalPurchaseCost !== null && (
                        <div>
                          <p className="text-sm text-gray-600">Estimated Total Purchase Cost</p>
                          <p className="text-2xl font-bold text-blue-600">${totalPurchaseCost.toLocaleString()}</p>
                        </div>
                      )}
                      <p className="text-xs text-gray-500">This is an estimate. Consult a financial advisor for accurate calculations.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;
