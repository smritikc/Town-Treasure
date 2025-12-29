require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ ok: true, message: 'Server is running' });
});

// Products routes (placeholder)
app.get('/api/products', (req, res) => {
  res.json([
    {
      id: 1,
      name: 'Sample Product',
      price: 25.99,
      image: '',
      description: 'A sample product',
      stock: 10,
      sellerId: 'seller1',
      createdAt: new Date().toISOString()
    }
  ]);
});

app.post('/api/products', (req, res) => {
  const { name, price, stock, description, image } = req.body;
  if (!name || !price || !stock) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  res.status(201).json({
    id: Date.now(),
    name,
    price: parseFloat(price),
    stock: parseInt(stock),
    description,
    image: image || '',
    sellerId: 'seller1',
    createdAt: new Date().toISOString()
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
  console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📦 Products: http://localhost:${PORT}/api/products\n`);
});
