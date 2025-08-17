# MongoDB Setup Guide

This guide will help you set up MongoDB for the Inventory Management System.

## Prerequisites

1. **MongoDB Server**: You need MongoDB installed and running on your system
   - Download from [MongoDB Community Server](https://www.mongodb.com/try/download/community)
   - Or use MongoDB Atlas (cloud service)

2. **Node.js**: Make sure you have Node.js installed

## Local MongoDB Setup

### 1. Install MongoDB Community Server

**Windows:**
- Download the MongoDB installer from the official website
- Run the installer and follow the setup wizard
- MongoDB will be installed as a service and start automatically

**macOS:**
```bash
brew install mongodb-community
brew services start mongodb-community
```

**Linux (Ubuntu):**
```bash
sudo apt update
sudo apt install mongodb
sudo systemctl start mongodb
sudo systemctl enable mongodb
```

### 2. Verify MongoDB is Running

```bash
mongosh
# or
mongo
```

You should see the MongoDB shell. Type `exit` to quit.

### 3. Environment Variables

Create a `.env` file in the root directory:

```env
VITE_MONGODB_URI=mongodb://localhost:27017
VITE_MONGODB_DB_NAME=inventory_manager
```

## MongoDB Atlas Setup (Cloud Option)

### 1. Create Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account
3. Create a new cluster (free tier is sufficient)

### 2. Configure Database Access

1. Go to "Database Access" in the left sidebar
2. Click "Add New Database User"
3. Create a username and password
4. Set privileges to "Read and write to any database"

### 3. Configure Network Access

1. Go to "Network Access" in the left sidebar
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (for development)
4. Or add your specific IP address

### 4. Get Connection String

1. Go to "Database" in the left sidebar
2. Click "Connect"
3. Choose "Connect your application"
4. Copy the connection string

### 5. Update Environment Variables

```env
VITE_MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/inventory_manager?retryWrites=true&w=majority
VITE_MONGODB_DB_NAME=inventory_manager
```

Replace `username`, `password`, and `cluster` with your actual values.

## Database Structure

The application will automatically create the following collections:

### Categories Collection
```javascript
{
  _id: ObjectId,
  name: String (unique),
  description: String,
  created_at: Date,
  updated_at: Date
}
```

### Inventory Items Collection
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  sku: String (unique),
  category_id: ObjectId (references categories),
  quantity: Number,
  price: Number,
  threshold: Number,
  image_url: String,
  created_by: String (user ID),
  created_at: Date,
  updated_at: Date
}
```

## Indexes

The following indexes are automatically created for better performance:

- `categories.name` (unique)
- `inventory_items.sku` (unique)
- `inventory_items.category_id`
- `inventory_items.created_by`
- `inventory_items.created_at`

## Default Data

The application automatically creates default categories:

- Electronics
- Clothing
- Food & Beverages
- Furniture
- Books
- Sports

## Running the Application

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The application will automatically:
- Connect to MongoDB
- Create necessary indexes
- Insert default categories if they don't exist

## Troubleshooting

### Connection Issues

1. **MongoDB not running**: Start the MongoDB service
2. **Wrong connection string**: Check your environment variables
3. **Network access**: If using Atlas, make sure your IP is whitelisted

### Authentication Issues

1. **Wrong credentials**: Double-check username and password
2. **Database user permissions**: Ensure the user has read/write access

### Performance Issues

1. **Missing indexes**: The application creates indexes automatically
2. **Large datasets**: Consider adding additional indexes based on your query patterns

## Migration from Supabase

If you're migrating from Supabase:

1. Export your data from Supabase
2. Transform the data to match MongoDB structure
3. Import the data into MongoDB collections
4. Update environment variables
5. Test the application

## Security Considerations

1. **Environment Variables**: Never commit `.env` files to version control
2. **Network Security**: Use VPN or specific IP whitelisting in production
3. **Authentication**: Consider implementing additional authentication layers
4. **Backup**: Set up regular backups of your MongoDB data 