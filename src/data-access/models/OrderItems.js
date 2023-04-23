const mongoose = require("mongoose");
const { orderItemsSchema } = require("../schemas");

const OrderItems = mongoose.model("OrderItems", orderItemsSchema);

module.exports = OrderItems;
