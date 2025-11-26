const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: String,
  category: String,
  price: Number,
  size: [String],
  
  color: String,         // 👈 Add this
  stock: Number,
  imageURL: String
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
