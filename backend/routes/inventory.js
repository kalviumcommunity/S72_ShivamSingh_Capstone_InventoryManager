const express = require("express");
const router = express.Router();
const Inventory = require("../models/Inventory");
const { protect } = require("../middleware/auth");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");

// Configure multer for inventory image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/inventory/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'inventory-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Not an image! Please upload an image file.'), false);
    }
  }
}).single('image');

// Protect all routes after this middleware
router.use(protect);

// GET all inventory items for the current user
router.get("/items", async (req, res) => {
    try {
        const items = await Inventory.find({ user: req.user._id });
        res.status(200).json(items);
    } catch (error) {
        console.error("Error fetching inventory:", error);
        res.status(500).json({ message: "Error fetching inventory", error: error.message });
    }
});

// POST new inventory item
router.post("/items", upload, async (req, res) => {
    try {
        // Parse numeric values from form data
        const quantity = parseInt(req.body.quantity);
        const price = parseFloat(req.body.price);
        const minimumQuantity = parseInt(req.body.minimumQuantity) || 10;

        // Validate required fields
        if (!req.body.name || !req.body.category || isNaN(quantity) || isNaN(price)) {
            return res.status(400).json({
                message: "Missing required fields",
                details: {
                    name: !req.body.name ? "Name is required" : null,
                    category: !req.body.category ? "Category is required" : null,
                    quantity: isNaN(quantity) ? "Valid quantity is required" : null,
                    price: isNaN(price) ? "Valid price is required" : null
                }
            });
        }

        let image = '';
        if (req.file) {
            image = `/uploads/inventory/${req.file.filename}`;
        } else if (req.body.imageUrl && typeof req.body.imageUrl === 'string' && req.body.imageUrl.startsWith('http')) {
            image = req.body.imageUrl;
        } else if (req.body.image && typeof req.body.image === 'string' && req.body.image.startsWith('http')) {
            image = req.body.image;
        }

        const newItem = new Inventory({
            name: req.body.name,
            quantity: quantity,
            price: price,
            category: req.body.category,
            user: req.user._id,
            minimumQuantity: minimumQuantity,
            image: image,
        });

        const savedItem = await newItem.save();
        res.status(201).json(savedItem);
    } catch (error) {
        console.error("Error creating inventory item:", error);
        res.status(500).json({ message: "Error creating inventory item", error: error.message });
    }
});

// GET single inventory item
router.get("/items/:id", async (req, res) => {
    try {
        const item = await Inventory.findOne({
            _id: req.params.id,
            user: req.user._id
        });
        
        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }
        
        res.status(200).json(item);
    } catch (error) {
        console.error("Error fetching inventory item:", error);
        res.status(500).json({ message: "Error fetching inventory item", error: error.message });
    }
});

// UPDATE inventory item
router.patch("/items/:id", upload, async (req, res) => {
    try {
        // Create update object with only the fields that are present in the request
        const updateData = {};
        
        if (req.body.name) updateData.name = req.body.name;
        if (req.body.quantity) updateData.quantity = parseInt(req.body.quantity);
        if (req.body.price) updateData.price = parseFloat(req.body.price);
        if (req.body.category) updateData.category = req.body.category;
        if (req.body.minimumQuantity) updateData.minimumQuantity = parseInt(req.body.minimumQuantity);
        
        // Handle image update
        if (req.file) {
            updateData.image = `/uploads/inventory/${req.file.filename}`;
        } else if (req.body.imageUrl && typeof req.body.imageUrl === 'string' && req.body.imageUrl.startsWith('http')) {
            updateData.image = req.body.imageUrl;
        } else if (req.body.image && typeof req.body.image === 'string' && req.body.image.startsWith('http')) {
            updateData.image = req.body.image;
        } else if (req.body.image && req.body.image !== '{}') {
            updateData.image = req.body.image;
        }

        const item = await Inventory.findOneAndUpdate(
            {
                _id: req.params.id,
                user: req.user._id
            },
            updateData,
            { new: true, runValidators: true }
        );

        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }

        res.status(200).json(item);
    } catch (error) {
        console.error("Error updating inventory item:", error);
        res.status(500).json({ message: "Error updating inventory item", error: error.message });
    }
});

// DELETE inventory item
router.delete("/items/:id", async (req, res) => {
    try {
        const item = await Inventory.findOneAndDelete({
            _id: req.params.id,
            user: req.user._id
        });

        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }

        res.status(204).json({ message: "Item deleted successfully" });
    } catch (error) {
        console.error("Error deleting inventory item:", error);
        res.status(500).json({ message: "Error deleting inventory item", error: error.message });
    }
});

module.exports = router;