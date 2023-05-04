const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    productId: {
      type: Number,
      required: true,
    },
    productName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    imageUri: {
      type: String,
      required: true,
    },
    company: {
      type: String,
      required: true,
    },
    category: {
      type: Number, // 카테고리 종류(채소 : 0/과일 : 1)
      required: true,
    },
  },
  {
    collection: 'products',
  }
);

module.exports = productSchema;
