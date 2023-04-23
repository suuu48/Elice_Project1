const mongoose = require("mongoose");
const Schema = require("mongoose");
// const Types = require("mongoose");
const orderItemsSchema = require("./orderItems");

const orderSchema = new mongoose.Schema({
  _id : {
    type: Schema.Types.ObjectId, required: true
  },
  userId: { type: Schema.Types.ObjectId, ref: 'users', required: true },
  orderItems: [orderItemsSchema],
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
}, {
      collection: 'orders',
    },
);

module.exports = orderSchema;
