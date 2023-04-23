const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  orderId:{
    type: Number,
    required: true,
  },
  userEmail:{
    type: String,
    required: true,
  },
  orderItems:[{
    productId: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
  }],
  orderAddr:{
    type:String,
    required:true,
  },
  deliveryState:{
    type:Number,
    required:true,
  },
  deleteFlag: {
    type: Boolean,
    default: false
  },
});
module.exports = orderSchema;