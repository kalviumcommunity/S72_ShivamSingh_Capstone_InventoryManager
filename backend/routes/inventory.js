const express = require("express");
const router = express.Router();
const Inventory = require("../models/Inventory");
const mongoose = require("mongoose");

// GET all inventory items
router.get("/api/inventory/items", async (req, res) => {
    try {
        const items = await Inventory.find();
        res.status(200).json(items);
    } catch (error) {
        console.error("Error fetching inventory:", error);
        res.status(500).json({ message: "Error fetching inventory", error: error.message });
    }
});

// POST new inventory item
router.post("/api/inventory/items", async (req, res) => {
    try {
        const newItem = new Inventory({
            name: req.body.name,
            quantity: req.body.quantity,
            price: req.body.price,
            category: req.body.category
        });
        const savedItem = await newItem.save();
        res.status(201).json(savedItem);
    } catch (error) {
        console.error("Error creating inventory item:", error);
        res.status(500).json({ message: "Error creating inventory item", error: error.message });
    }
});

// PUT update inventory item
router.put("/api/inventory/items/:id", async (req, res) => {
    try {
        // Validate if the ID is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ 
                message: "Invalid item ID format",
                details: "The provided ID is not a valid MongoDB ObjectId"
            });
        }

        const updatedItem = await Inventory.findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.name,
                quantity: req.body.quantity,
                price: req.body.price,
                category: req.body.category
            },
            { 
                new: true,
                runValidators: true
            }
        );

        if (!updatedItem) {
            return res.status(404).json({ 
                message: "Item not found",
                details: "No inventory item exists with the provided ID"
            });
        }

        res.status(200).json(updatedItem);
    } catch (error) {
        console.error("Error updating inventory item:", error);
        res.status(500).json({ 
            message: "Error updating inventory item", 
            error: error.message,
            details: "Please ensure all required fields are provided with correct data types"
        });
    }
});

// Add some test data route
router.post("/api/inventory/test-data", async (req, res) => {
    try {
        const testData = [
            {
                name: "Laptop",
                quantity: 10,
                price: 999.99,
                category: "Electronics"
            },
            {
                name: "Desk Chair",
                quantity: 15,
                price: 199.99,
                category: "Furniture"
            },
            {
                name: "Coffee Maker",
                quantity: 5,
                price: 49.99,
                category: "Appliances"
            }
        ];

        const result = await Inventory.insertMany(testData);
        res.status(201).json({ message: "Test data added successfully", data: result });
    } catch (error) {
        console.error("Error adding test data:", error);
        res.status(500).json({ message: "Error adding test data", error: error.message });
    }
});

module.exports = router;