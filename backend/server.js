const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
require('dotenv').config();
const connectDB = require('./config/database');
const authRoute = require('./Routes/authRoute');
const propertyRoute = require('./Routes/propertyRoute');
const { authenticate, authorize } = require('./middleware/auth');
const { sendEmail } = require('./utils/email');
const Property = require('./models/Property');

const app = express();

// Security middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

app.use(express.json());

// Connect to database
connectDB();

// Seed initial data if empty (handled by fileDB initialization)
/*
const seedData = async () => {
  const count = await Property.countDocuments();
  if (count === 0) {
    const properties = [
      {
        title: 'Beautiful House',
        description: 'A modern family home with garden, balcony, and quick access to schools.',
        price: 300000,
        location: 'New York, NY',
        type: 'sale',
        agent: 'John Doe',
        area: 2200,
        bedrooms: 4,
        bathrooms: 3,
        amenities: ['Garage', 'Garden', 'Fireplace'],
        images: ['https://picsum.photos/400/300?random=1'],
        viewCount: 0
      },
      {
        title: 'Cozy Apartment',
        description: 'Comfortable one-bedroom apartment in the heart of the city with fast transit nearby.',
        price: 1500,
        location: 'Los Angeles, CA',
        type: 'rent',
        agent: 'Jane Smith',
        area: 650,
        bedrooms: 1,
        bathrooms: 1,
        amenities: ['Gym Access', 'Pet Friendly', 'Rooftop'],
        images: ['https://picsum.photos/400/300?random=2'],
        viewCount: 0
      },
      {
        title: 'Luxury Villa',
        description: 'Spacious villa with private pool, home theater, and concierge-level service.',
        price: 500000,
        location: 'Miami, FL',
        type: 'sale',
        agent: 'Bob Johnson',
        area: 4200,
        bedrooms: 5,
        bathrooms: 4,
        amenities: ['Pool', 'Garage', 'Sea View'],
        images: ['https://picsum.photos/400/300?random=3'],
        viewCount: 0
      },
      {
        title: 'Studio Apartment',
        description: 'Affordable studio rental with all utilities included and a vibrant neighborhood.',
        price: 1200,
        location: 'Chicago, IL',
        type: 'rent',
        agent: 'Alice Brown',
        area: 500,
        bedrooms: 0,
        bathrooms: 1,
        amenities: ['Utilities Included', 'Laundry', 'Bike Storage'],
        images: ['https://picsum.photos/400/300?random=4'],
        viewCount: 0
      }
    ];
    await Property.insertMany(properties);
    console.log('Initial data seeded');
  }
};
seedData();
*/


// Routes
app.use("/api/users", authRoute);
app.use("/api/properties", propertyRoute);

app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ message: 'All fields required' });
  }
  // Send email to admin or agent
  sendEmail('admin@legitestate.com', `Contact from ${name}`, `Email: ${email}\nMessage: ${message}`);
  res.json({ message: 'Message sent' });
});

app.listen(5000, () => console.log('Server running on port 5000'));