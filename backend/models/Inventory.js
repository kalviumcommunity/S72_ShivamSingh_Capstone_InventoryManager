const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema({
    name: String,
    quantity: Number,
    price: Number,
    category: String
}, { timestamps: true });

module.exports = mongoose.model("Inventory", inventorySchema, "items");

