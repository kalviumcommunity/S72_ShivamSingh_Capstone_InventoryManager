const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide an item name'],
        trim: true
    },
    quantity: {
        type: Number,
        required: [true, 'Please provide a quantity'],
        min: [0, 'Quantity cannot be negative']
    },
    price: {
        type: Number,
        required: [true, 'Please provide a price'],
        min: [0, 'Price cannot be negative']
    },
    category: {
        type: String,
        required: [true, 'Please provide a category'],
        trim: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Inventory must belong to a user']
    },
    minimumQuantity: {
        type: Number,
        default: 10
    },
    image: {
        type: String,
        default: '',
    }
}, { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual property for status
inventorySchema.virtual('status').get(function() {
    if (this.quantity === 0) return 'Out of Stock';
    if (this.quantity <= this.minimumQuantity) return 'Low Stock';
    return 'In Stock';
});

module.exports = mongoose.model("Inventory", inventorySchema);