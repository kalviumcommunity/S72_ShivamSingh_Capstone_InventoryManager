const express = require("express");
const router = express.Router();
const Inventory = require("../models/Inventory"); // Your Mongoose model

// GET all inventory items
router.get("/api/inventory/items", async (req, res) => {
    try {
        const items = await Inventory.find(); // Fetch all items from MongoDB
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ message: "Error fetching inventory", error });
    }
});

module.exports = router;
