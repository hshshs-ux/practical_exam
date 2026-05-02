const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/productsDB')
  .then(() => console.log("mongo DB connected"))
  .catch(err => console.error(" DB error:", err));

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  inStock: { type: Boolean, default: true }
});
const Product = mongoose.model('Product', productSchema);

// Create product
app.post('/products', async (req, res) => {
  try {
    const product = new Product(req.body);
    const saved = await product.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get  products
app.get('/products', async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Get product 
app.get('/products/:id', async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id });
    if (!product) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    res.json(product);
  } catch {
    res.status(400).json({ error: "Invalid ID" });
  }
});

// Update product
app.put('/products/:id', async (req, res) => {
  try {
    const updated = await Product.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true }
    );
    if (!updated) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    res.json(updated);
  } catch {
    res.status(400).json({ error: "Invalid ID or data" });
  }
});

// Delete product
app.delete('/products/:id', async (req, res) => {
  try {
    const deleted = await Product.findOneAndDelete({ _id: req.params.id });
    if (!deleted) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    res.json({ message: "Deleted successfully" });
  } catch {
    res.status(400).json({ error: "Invalid ID" });
  }
});


app.listen(3000, () => console.log(" Server running on port 3000"));
































































































