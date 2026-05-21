const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '../data');

// Create data directory if it doesn't exist
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const getFilePath = (collection) => path.join(dataDir, `${collection}.json`);

// Property data generators
const cities = [
  { name: 'New York', state: 'NY', stateImage: 'ny', features: ['High cost of living', 'Excellent public transport', 'Cultural hub'] },
  { name: 'Los Angeles', state: 'CA', stateImage: 'ca', features: ['Mild climate', 'Entertainment industry', 'Diverse neighborhoods'] },
  { name: 'Miami', state: 'FL', stateImage: 'fl', features: ['Tropical climate', 'Beach access', 'International appeal'] },
  { name: 'Chicago', state: 'IL', stateImage: 'il', features: ['Windy city', 'Cultural landmarks', 'Four seasons'] },
  { name: 'Austin', state: 'TX', stateImage: 'tx', features: ['Tech hub', 'Live music scene', 'Outdoor activities'] },
  { name: 'Seattle', state: 'WA', stateImage: 'wa', features: ['Rainy climate', 'Coffee culture', 'Natural beauty'] },
  { name: 'Denver', state: 'CO', stateImage: 'co', features: ['Mountain access', 'Outdoor recreation', 'Brewery scene'] },
  { name: 'San Diego', state: 'CA', stateImage: 'ca2', features: ['Mild climate', 'Entertainment industry', 'Diverse neighborhoods'] },
  { name: 'Boston', state: 'MA', stateImage: 'ma', features: ['Historic charm', 'Academic excellence', 'Sports culture'] },
  { name: 'San Francisco', state: 'CA', stateImage: 'sf', features: ['Tech innovation', 'Foggy weather', 'Steep hills'] },
  { name: 'Phoenix', state: 'AZ', stateImage: 'az', features: ['Desert climate', 'Golf courses', 'Spring training'] },
  { name: 'Dallas', state: 'TX', stateImage: 'tx2', features: ['Business hub', 'Sports teams', 'Diverse culture'] },
  { name: 'Houston', state: 'TX', stateImage: 'tx3', features: ['Space city', 'Port activities', 'Diverse economy'] },
  { name: 'Atlanta', state: 'GA', stateImage: 'ga', features: ['Southern hospitality', 'Business center', 'Civil rights history'] },
  { name: 'Las Vegas', state: 'NV', stateImage: 'nv', features: ['Entertainment capital', 'Desert landscape', 'Tourism hub'] }
];

const propertyTypes = ['sale', 'rent'];
const propertyTitles = [
  'Beautiful House', 'Cozy Apartment', 'Luxury Villa', 'Modern Condo', 'Charming Cottage',
  'Urban Loft', 'Beachfront Bungalow', 'Spacious Townhouse', 'Elegant Mansion', 'Compact Studio',
  'Family Home', 'Penthouse Suite', 'Garden Apartment', 'Victorian House', 'Contemporary Loft',
  'Suburban Ranch', 'Downtown Condo', 'Lakefront Property', 'Mountain View Home', 'City Center Flat'
];

const generatePlaceholderImage = (id, label = 'Property') => {
  const svg = `<?xml version="1.0" encoding="UTF-8"?><svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect width="400" height="300" fill="#e2e8f0"/><text x="200" y="140" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif" font-size="24" fill="#475569">${label} ${id}</text></svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};

const descriptions = [
  'A modern family home with garden, balcony, and quick access to schools.',
  'Comfortable one-bedroom apartment in the heart of the city with fast transit nearby.',
  'Spacious villa with private pool, home theater, and concierge-level service.',
  'Affordable studio rental with all utilities included and a vibrant neighborhood.',
  'Stylish condo in downtown with city views and modern amenities.',
  'Quaint cottage in a peaceful suburb with garden and garage.',
  'Industrial-style loft in the arts district with high ceilings.',
  'Relaxing bungalow steps from the beach with ocean views.',
  'Elegant townhouse with private courtyard and modern finishes.',
  'Luxurious penthouse with panoramic city views and premium amenities.',
  'Charming Victorian home with original details and modern updates.',
  'Contemporary apartment with open floor plan and floor-to-ceiling windows.',
  'Cozy cabin-style home nestled in the mountains with scenic views.',
  'Urban brownstone with historic charm and modern conveniences.',
  'Minimalist studio with efficient layout and city convenience.'
];

const amenitiesList = [
  ['Garage', 'Garden', 'Fireplace'],
  ['Gym Access', 'Pet Friendly', 'Rooftop'],
  ['Pool', 'Garage', 'Sea View'],
  ['Utilities Included', 'Laundry', 'Bike Storage'],
  ['City Views', 'Modern Kitchen', 'Fitness Center'],
  ['Garden', 'Garage', 'Quiet Neighborhood'],
  ['High Ceilings', 'Arts District', 'Bike Friendly'],
  ['Ocean Views', 'Beach Access', 'Patio'],
  ['Private Courtyard', 'Modern Finishes', 'Storage'],
  ['Panoramic Views', 'Premium Amenities', 'Concierge'],
  ['Original Details', 'Modern Updates', 'Hardwood Floors'],
  ['Open Floor Plan', 'Floor-to-Ceiling Windows', 'Balcony'],
  ['Scenic Views', 'Fire Pit', 'Deck'],
  ['Historic Charm', 'Modern Conveniences', 'Garden'],
  ['Efficient Layout', 'City Convenience', 'Walk-in Closet']
];

const agents = [
  'John Doe', 'Jane Smith', 'Bob Johnson', 'Alice Brown', 'Charlie Davis',
  'Diana Evans', 'Frank Garcia', 'Grace Hill', 'Henry Wilson', 'Ivy Chen',
  'Jack Taylor', 'Kate Miller', 'Liam Anderson', 'Maya Rodriguez', 'Noah Thompson'
];

const generateRandomProperty = (id) => {
  const city = cities[Math.floor(Math.random() * cities.length)];
  const type = propertyTypes[Math.floor(Math.random() * propertyTypes.length)];
  const title = propertyTitles[Math.floor(Math.random() * propertyTitles.length)];
  const description = descriptions[Math.floor(Math.random() * descriptions.length)];
  const amenities = amenitiesList[Math.floor(Math.random() * amenitiesList.length)];

  // Generate price based on type and location
  let basePrice;
  if (type === 'sale') {
    basePrice = Math.floor(Math.random() * 2000000) + 100000; // $100k - $2.1M
  } else {
    basePrice = Math.floor(Math.random() * 8000) + 800; // $800 - $8800/month
  }

  // Adjust price based on city (NY, SF, LA are more expensive)
  const expensiveCities = ['New York', 'San Francisco', 'Los Angeles'];
  if (expensiveCities.includes(city.name)) {
    basePrice = Math.floor(basePrice * 1.5);
  }

  const bedrooms = Math.floor(Math.random() * 6); // 0-5 bedrooms
  const bathrooms = Math.max(1, Math.floor(Math.random() * (bedrooms + 2))); // 1 to bedrooms+1 bathrooms
  const area = bedrooms * 300 + Math.floor(Math.random() * 800) + 400; // 400-2200+ sq ft based on bedrooms

  return {
    _id: id.toString(),
    title: `${title} in ${city.name}`,
    description,
    price: basePrice,
    location: `${city.name}, ${city.state}`,
    country: 'USA',
    state: city.state,
    city: city.name,
    type,
    agent: agents[Math.floor(Math.random() * agents.length)],
    area,
    bedrooms,
    bathrooms,
    amenities,
    images: [generatePlaceholderImage(id, title)],
    stateImage: generatePlaceholderImage(id, city.state),
    stateFeatures: city.features,
    viewCount: Math.floor(Math.random() * 100),
    createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString()
  };
};

const generateProperties = (count) => {
  const properties = [];
  for (let i = 1; i <= count; i++) {
    properties.push(generateRandomProperty(i));
  }
  return properties;
};

const initializeCollections = () => {
  const collections = {
    users: [],
    properties: generateProperties(500)
  };

  Object.entries(collections).forEach(([name, defaultData]) => {
    const filePath = getFilePath(name);
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2));
    }
  });
};

const readCollection = (collection) => {
  const filePath = getFilePath(collection);
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch {
    return [];
  }
};

const writeCollection = (collection, data) => {
  const filePath = getFilePath(collection);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

let propertyIdCounter = 5;
let userIdCounter = 1;

class FileDB {
  static generateId() {
    return Math.random().toString(36).substr(2, 9);
  }

  // Property methods
  static getProperties() {
    return readCollection('properties');
  }

  static getPropertyById(id) {
    const properties = this.getProperties();
    return properties.find(p => p._id === id);
  }

  static createProperty(data) {
    const properties = this.getProperties();
    const newProperty = {
      _id: this.generateId(),
      ...data,
      viewCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    properties.push(newProperty);
    writeCollection('properties', properties);
    return newProperty;
  }

  static updateProperty(id, data) {
    const properties = this.getProperties();
    const index = properties.findIndex(p => p._id === id);
    if (index === -1) return null;
    properties[index] = {
      ...properties[index],
      ...data,
      updatedAt: new Date().toISOString()
    };
    writeCollection('properties', properties);
    return properties[index];
  }

  static deleteProperty(id) {
    const properties = this.getProperties();
    const index = properties.findIndex(p => p._id === id);
    if (index === -1) return null;
    const deleted = properties.splice(index, 1);
    writeCollection('properties', properties);
    return deleted[0];
  }

  static incrementViewCount(id) {
    const properties = this.getProperties();
    const property = properties.find(p => p._id === id);
    if (property) {
      property.viewCount += 1;
      writeCollection('properties', properties);
    }
    return property;
  }

  // User methods
  static getUsers() {
    return readCollection('users');
  }

  static getUserByEmail(email) {
    const users = this.getUsers();
    return users.find(u => u.email === email);
  }

  static getUserById(id) {
    const users = this.getUsers();
    return users.find(u => u._id === id);
  }

  static createUser(data) {
    const users = this.getUsers();
    const newUser = {
      _id: this.generateId(),
      ...data,
      favorites: [],
      savedSearches: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    users.push(newUser);
    writeCollection('users', users);
    return newUser;
  }

  static updateUser(id, data) {
    const users = this.getUsers();
    const index = users.findIndex(u => u._id === id);
    if (index === -1) return null;
    users[index] = {
      ...users[index],
      ...data,
      updatedAt: new Date().toISOString()
    };
    writeCollection('users', users);
    return users[index];
  }
}

initializeCollections();
module.exports = FileDB;