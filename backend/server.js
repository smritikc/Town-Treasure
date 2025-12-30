require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

// MongoDB Connection
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/town-treasure';

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/town-treasure')
.then(() => {
  console.log('✅ MongoDB Connected');
})
.catch(err => {
  console.error('❌ MongoDB Connection Error:', err.message);
  console.log('⚠️  Using in-memory data storage instead');
});
// Product Schema
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  image: String,
  category: String,
  location: String,
  rating: { type: Number, default: 0 },
  stock: { type: Number, default: 1 },
  sellerId: String,
  createdAt: { type: Date, default: Date.now }
});

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

// Middleware
const allowedOrigins = [
  'http://localhost:3000',
  'https://town-treasure-logy.onrender.com',
  process.env.CLIENT_URL
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Helper function to check MongoDB connection
const isMongoConnected = () => mongoose.connection.readyState === 1;

// Health check endpoint
app.get('/api/health', (req, res) => {
  const dbStatus = isMongoConnected() ? 'connected' : 'disconnected';
  res.json({ 
    ok: true, 
    message: 'Server is running',
    database: dbStatus,
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// GET all products
app.get('/api/products', async (req, res) => {
  try {
    if (isMongoConnected()) {
      // Fetch from MongoDB
      const products = await Product.find().sort({ createdAt: -1 });
      return res.json(products);
    } else {
      // Fallback: Return sample data if MongoDB not connected
      console.log('⚠️  MongoDB not connected, returning sample data');
      return res.json([
        {
          _id: '1',
          name: 'Handmade Ceramic Mug',
          description: 'Beautiful hand-painted ceramic mug',
          price: 25.99,
          rating: 4.5,
          image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574',
          category: 'Home Decor',
          location: 'Local - 2 miles away',
          stock: 10,
          createdAt: new Date().toISOString()
        },
        {
          _id: '2',
          name: 'Organic Raw Honey',
          description: 'Pure raw honey from local bees',
          price: 12.99,
          rating: 4.8,
          image: 'https://images.unsplash.com/photo-1587049352851-8d4e89133924',
          category: 'Food',
          location: 'Local - 5 miles away',
          stock: 15,
          createdAt: new Date().toISOString()
        }
      ]);
    }
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// GET single product
app.get('/api/products/:id', async (req, res) => {
  try {
    if (isMongoConnected()) {
      const product = await Product.findById(req.params.id);
      if (!product) return res.status(404).json({ error: 'Product not found' });
      res.json(product);
    } else {
      // Fallback for single product
      res.json({
        _id: req.params.id,
        name: 'Sample Product',
        description: 'A sample product description',
        price: 19.99,
        rating: 4.0,
        image: '',
        category: 'Sample',
        location: 'Local',
        stock: 5,
        createdAt: new Date().toISOString()
      });
    }
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// POST create new product
app.post('/api/products', async (req, res) => {
  try {
    const { name, price, description, image, category, location, stock } = req.body;
    
    if (!name || !price) {
      return res.status(400).json({ error: 'Name and price are required' });
    }
    
    if (isMongoConnected()) {
      const product = new Product({
        name,
        price,
        description,
        image,
        category,
        location,
        stock: stock || 1,
        sellerId: 'seller1' // In real app, get from auth token
      });
      
      await product.save();
      res.status(201).json(product);
    } else {
      // Fallback: Return simulated product
      const simulatedProduct = {
        _id: Date.now().toString(),
        name,
        price,
        description,
        image,
        category,
        location,
        stock: stock || 1,
        sellerId: 'seller1',
        createdAt: new Date().toISOString()
      };
      console.log('⚠️  MongoDB not connected, simulating product creation');
      res.status(201).json(simulatedProduct);
    }
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Town Treasure API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      products: '/api/products',
      singleProduct: '/api/products/:id'
    },
    database: isMongoConnected() ? 'connected' : 'disconnected'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 Server running on port ${PORT}`);
  console.log(`📍 Local: http://localhost:${PORT}`);
  console.log(`📍 Health: http://localhost:${PORT}/api/health`);
  console.log(`📦 Products: http://localhost:${PORT}/api/products`);
  console.log(`🌐 CORS enabled for: ${allowedOrigins.join(', ')}`);
  console.log(`🗄️  MongoDB: ${isMongoConnected() ? 'Connected' : 'Not connected (using fallback)'}\n`);
});