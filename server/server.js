const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DB_NAME = process.env.MONGODB_DB_NAME || 'inventory_manager';

let db;

// Connect to MongoDB
async function connectToMongoDB() {
  try {
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    db = client.db(DB_NAME);
    console.log('Connected to MongoDB');
    
    // Initialize database
    await initializeDatabase();
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

// Initialize database with indexes and default data
async function initializeDatabase() {
  try {
    const categoriesCollection = db.collection('categories');
    const inventoryCollection = db.collection('inventory_items');
    
    // Create indexes
    await categoriesCollection.createIndex({ name: 1 }, { unique: true });
    await inventoryCollection.createIndex({ sku: 1 }, { unique: true });
    await inventoryCollection.createIndex({ category_id: 1 });
    await inventoryCollection.createIndex({ created_by: 1 });
    await inventoryCollection.createIndex({ created_at: -1 });
    
    // Check if default categories exist
    const existingCategories = await categoriesCollection.countDocuments();
    
    if (existingCategories === 0) {
      const defaultCategories = [
        {
          name: 'Electronics',
          description: 'Electronic devices and accessories',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          name: 'Clothing',
          description: 'Apparel and fashion items',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          name: 'Food & Beverages',
          description: 'Food and drink products',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          name: 'Furniture',
          description: 'Home and office furniture',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          name: 'Books',
          description: 'Books and publications',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          name: 'Sports',
          description: 'Sports equipment and accessories',
          created_at: new Date(),
          updated_at: new Date()
        }
      ];
      
      await categoriesCollection.insertMany(defaultCategories);
      console.log('Default categories created successfully');
    }
    
    console.log('Database initialization completed');
  } catch (error) {
    console.error('Database initialization error:', error);
  }
}

// Middleware
app.use(helmet());
app.use(compression());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// Rate limiting disabled for development
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 1000 // limit each IP to 1000 requests per windowMs (increased for development)
// });
// app.use(limiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Categories API
app.get('/api/categories', async (req, res) => {
  try {
    const categories = await db.collection('categories')
      .find({})
      .sort({ name: 1 })
      .toArray();
    
    res.json(categories.map(cat => ({
      id: cat._id.toString(),
      name: cat.name,
      description: cat.description || '',
      createdAt: cat.created_at,
      updatedAt: cat.updated_at
    })));
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

app.post('/api/categories', async (req, res) => {
  try {
    const { name, description } = req.body;
    const now = new Date();
    
    const newCategory = {
      name,
      description,
      created_at: now,
      updated_at: now
    };
    
    const result = await db.collection('categories').insertOne(newCategory);
    const createdCategory = await db.collection('categories').findOne({ _id: result.insertedId });
    
    res.status(201).json({
      id: createdCategory._id.toString(),
      name: createdCategory.name,
      description: createdCategory.description || '',
      createdAt: createdCategory.created_at,
      updatedAt: createdCategory.updated_at
    });
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ error: 'Failed to create category' });
  }
});

app.put('/api/categories/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = {
      ...req.body,
      updated_at: new Date()
    };
    
    await db.collection('categories').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );
    
    const updatedCategory = await db.collection('categories').findOne({ _id: new ObjectId(id) });
    
    res.json({
      id: updatedCategory._id.toString(),
      name: updatedCategory.name,
      description: updatedCategory.description || '',
      createdAt: updatedCategory.created_at,
      updatedAt: updatedCategory.updated_at
    });
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ error: 'Failed to update category' });
  }
});

app.delete('/api/categories/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection('categories').deleteOne({ _id: new ObjectId(id) });
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ error: 'Failed to delete category' });
  }
});

// Inventory Items API
app.get('/api/inventory', async (req, res) => {
  try {
    const pipeline = [
      {
        $lookup: {
          from: 'categories',
          localField: 'category_id',
          foreignField: '_id',
          as: 'category'
        }
      },
      {
        $unwind: {
          path: '$category',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $sort: { created_at: -1 }
      }
    ];
    
    const items = await db.collection('inventory_items').aggregate(pipeline).toArray();
    
    res.json(items.map(item => ({
      id: item._id.toString(),
      name: item.name,
      description: item.description || '',
      sku: item.sku,
      category: item.category?.name || '',
      categoryId: item.category_id?.toString() || null,
      quantity: item.quantity,
      price: item.price,
      threshold: item.threshold,
      imageUrl: item.image_url || '',
      createdAt: item.created_at,
      updatedAt: item.updated_at
    })));
  } catch (error) {
    console.error('Error fetching inventory items:', error);
    res.status(500).json({ error: 'Failed to fetch inventory items' });
  }
});

app.get('/api/inventory/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const pipeline = [
      {
        $match: { _id: new ObjectId(id) }
      },
      {
        $lookup: {
          from: 'categories',
          localField: 'category_id',
          foreignField: '_id',
          as: 'category'
        }
      },
      {
        $unwind: {
          path: '$category',
          preserveNullAndEmptyArrays: true
        }
      }
    ];
    
    const items = await db.collection('inventory_items').aggregate(pipeline).toArray();
    
    if (items.length === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }
    
    const item = items[0];
    res.json({
      id: item._id.toString(),
      name: item.name,
      description: item.description || '',
      sku: item.sku,
      category: item.category?.name || '',
      categoryId: item.category_id?.toString() || null,
      quantity: item.quantity,
      price: item.price,
      threshold: item.threshold,
      imageUrl: item.image_url || '',
      createdAt: item.created_at,
      updatedAt: item.updated_at
    });
  } catch (error) {
    console.error('Error fetching inventory item:', error);
    res.status(500).json({ error: 'Failed to fetch inventory item' });
  }
});

app.post('/api/inventory', async (req, res) => {
  try {
    const itemData = req.body;
    const now = new Date();
    
    const newItem = {
      ...itemData,
      category_id: itemData.category_id ? new ObjectId(itemData.category_id) : null,
      created_at: now,
      updated_at: now
    };
    
    const result = await db.collection('inventory_items').insertOne(newItem);
    
    // Fetch the created item with category information
    const createdItem = await db.collection('inventory_items').findOne({ _id: result.insertedId });
    
    res.status(201).json({
      id: createdItem._id.toString(),
      name: createdItem.name,
      description: createdItem.description || '',
      sku: createdItem.sku,
      category: '',
      categoryId: createdItem.category_id?.toString() || null,
      quantity: createdItem.quantity,
      price: createdItem.price,
      threshold: createdItem.threshold,
      imageUrl: createdItem.image_url || '',
      createdAt: createdItem.created_at,
      updatedAt: createdItem.updated_at
    });
  } catch (error) {
    console.error('Error creating inventory item:', error);
    res.status(500).json({ error: 'Failed to create inventory item' });
  }
});

app.put('/api/inventory/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = {
      ...req.body,
      updated_at: new Date()
    };
    
    if (updateData.category_id !== undefined) {
      updateData.category_id = updateData.category_id ? new ObjectId(updateData.category_id) : null;
    }
    
    await db.collection('inventory_items').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );
    
    const updatedItem = await db.collection('inventory_items').findOne({ _id: new ObjectId(id) });
    
    res.json({
      id: updatedItem._id.toString(),
      name: updatedItem.name,
      description: updatedItem.description || '',
      sku: updatedItem.sku,
      category: '',
      categoryId: updatedItem.category_id?.toString() || null,
      quantity: updatedItem.quantity,
      price: updatedItem.price,
      threshold: updatedItem.threshold,
      imageUrl: updatedItem.image_url || '',
      createdAt: updatedItem.created_at,
      updatedAt: updatedItem.updated_at
    });
  } catch (error) {
    console.error('Error updating inventory item:', error);
    res.status(500).json({ error: 'Failed to update inventory item' });
  }
});

app.delete('/api/inventory/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection('inventory_items').deleteOne({ _id: new ObjectId(id) });
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting inventory item:', error);
    res.status(500).json({ error: 'Failed to delete inventory item' });
  }
});

app.get('/api/inventory/low-stock', async (req, res) => {
  try {
    const pipeline = [
      {
        $lookup: {
          from: 'categories',
          localField: 'category_id',
          foreignField: '_id',
          as: 'category'
        }
      },
      {
        $unwind: {
          path: '$category',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $match: {
          $expr: { $lte: ['$quantity', '$threshold'] }
        }
      },
      {
        $sort: { quantity: 1 }
      }
    ];
    
    const items = await db.collection('inventory_items').aggregate(pipeline).toArray();
    
    res.json(items.map(item => ({
      id: item._id.toString(),
      name: item.name,
      description: item.description || '',
      sku: item.sku,
      category: item.category?.name || '',
      categoryId: item.category_id?.toString() || null,
      quantity: item.quantity,
      price: item.price,
      threshold: item.threshold,
      imageUrl: item.image_url || '',
      createdAt: item.created_at,
      updatedAt: item.updated_at
    })));
  } catch (error) {
    console.error('Error fetching low stock items:', error);
    res.status(500).json({ error: 'Failed to fetch low stock items' });
  }
});

app.get('/api/inventory/search', async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.status(400).json({ error: 'Search query is required' });
    }
    
    const pipeline = [
      {
        $lookup: {
          from: 'categories',
          localField: 'category_id',
          foreignField: '_id',
          as: 'category'
        }
      },
      {
        $unwind: {
          path: '$category',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $match: {
          $or: [
            { name: { $regex: q, $options: 'i' } },
            { sku: { $regex: q, $options: 'i' } },
            { description: { $regex: q, $options: 'i' } }
          ]
        }
      },
      {
        $sort: { created_at: -1 }
      }
    ];
    
    const items = await db.collection('inventory_items').aggregate(pipeline).toArray();
    
    res.json(items.map(item => ({
      id: item._id.toString(),
      name: item.name,
      description: item.description || '',
      sku: item.sku,
      category: item.category?.name || '',
      categoryId: item.category_id?.toString() || null,
      quantity: item.quantity,
      price: item.price,
      threshold: item.threshold,
      imageUrl: item.image_url || '',
      createdAt: item.created_at,
      updatedAt: item.updated_at
    })));
  } catch (error) {
    console.error('Error searching inventory items:', error);
    res.status(500).json({ error: 'Failed to search inventory items' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
async function startServer() {
  await connectToMongoDB();
  
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
  });
}

startServer().catch(console.error); 

const allowedOrigins = [
  "http://localhost:5173", // local dev
  "https://inventorymangement3669.netlify.app" // your Netlify site
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // if you use cookies/auth
  })
);

app.use(express.json());
