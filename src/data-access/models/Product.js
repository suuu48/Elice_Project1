const mongoose = require('mongoose');
const { productSchema } = require('../schemas');

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
