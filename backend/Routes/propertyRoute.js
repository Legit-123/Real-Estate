const express = require('express');
const Property = require('../models/Property');
const { authenticate } = require('../middleware/auth');
const router = express.Router();

// Get all properties with optional filtering and sorting
router.get('/', async (req, res) => {
  try {
    let properties = await Property.find();
    const {
      search,
      type,
      location,
      minPrice,
      maxPrice,
      minBedrooms,
      maxBedrooms,
      minArea,
      maxArea,
      sort
    } = req.query;

    if (search) {
      const q = search.toLowerCase();
      properties = properties.filter((prop) =>
        prop.title.toLowerCase().includes(q) ||
        prop.location.toLowerCase().includes(q) ||
        prop.description.toLowerCase().includes(q)
      );
    }

    if (type && type !== 'all') {
      properties = properties.filter((prop) => prop.type === type);
    }

    if (location) {
      const q = location.toLowerCase();
      properties = properties.filter((prop) => prop.location.toLowerCase().includes(q));
    }

    if (minPrice) {
      properties = properties.filter((prop) => prop.price >= parseInt(minPrice, 10));
    }

    if (maxPrice) {
      properties = properties.filter((prop) => prop.price <= parseInt(maxPrice, 10));
    }

    if (minBedrooms) {
      properties = properties.filter((prop) => prop.bedrooms >= parseInt(minBedrooms, 10));
    }

    if (maxBedrooms) {
      properties = properties.filter((prop) => prop.bedrooms <= parseInt(maxBedrooms, 10));
    }

    if (minArea) {
      properties = properties.filter((prop) => prop.area >= parseInt(minArea, 10));
    }

    if (maxArea) {
      properties = properties.filter((prop) => prop.area <= parseInt(maxArea, 10));
    }

    if (sort) {
      properties = [...properties].sort((a, b) => {
        switch (sort) {
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
    }

    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single property
router.get('/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: 'Property not found' });
    const updatedProperty = await Property.findByIdAndUpdate(req.params.id, {
      viewCount: (property.viewCount || 0) + 1
    });
    if (!updatedProperty) return res.status(404).json({ message: 'Property not found after update' });
    res.json(updatedProperty);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create property (protected)
router.post('/', authenticate, async (req, res) => {
  try {
    const property = new Property(req.body);
    await property.save();
    res.status(201).json(property);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update property (protected)
router.put('/:id', authenticate, async (req, res) => {
  try {
    const property = await Property.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!property) return res.status(404).json({ message: 'Property not found' });
    res.json(property);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete property (protected)
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const property = await Property.findByIdAndDelete(req.params.id);
    if (!property) return res.status(404).json({ message: 'Property not found' });
    res.json({ message: 'Property deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;