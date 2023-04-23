const mongoose = require("mongoose");
const { orderSchema } = require("../schemas");

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
