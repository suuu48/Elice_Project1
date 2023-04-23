const mongoose = require("mongoose");

const orderItemsSchema = new mongoose.Schema({
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
},
    {
        collection: 'orderItems',
    },
);

module.exports = orderItemsSchema;
