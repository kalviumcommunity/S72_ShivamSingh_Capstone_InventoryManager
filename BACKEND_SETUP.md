# Backend Server Setup Guide

This guide will help you set up and run the backend server for the Inventory Management System.

## Architecture Overview

The application now uses a **client-server architecture**:

- **Frontend**: React app running on `http://localhost:5173`
- **Backend**: Express.js API server running on `http://localhost:5000`
- **Database**: MongoDB (local or Atlas)

## Quick Start

### Option 1: Use the provided scripts

**Windows:**
```bash
start-servers.bat
```

**Linux/macOS:**
```bash
chmod +x start-servers.sh
./start-servers.sh
```

### Option 2: Manual setup

1. **Install backend dependencies:**
   ```bash
   cd server
   npm install
   ```

2. **Set up environment variables:**
   
   Create a `.env` file in the `server` directory:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017
   MONGODB_DB_NAME=inventory_manager
   FRONTEND_URL=http://localhost:5173
   ```

3. **Start the backend server:**
   ```bash
   cd server
   npm run dev
   ```

4. **Start the frontend server (in a new terminal):**
   ```bash
   npm run dev
   ```

## Backend Features

### Security
- **Helmet.js**: Security headers
- **CORS**: Cross-origin resource sharing
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **Input Validation**: Request body validation
- **Error Handling**: Comprehensive error handling

### API Endpoints

#### Health Check
- `GET /api/health` - Server health status

#### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create new category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

#### Inventory Items
- `GET /api/inventory` - Get all inventory items
- `GET /api/inventory/:id` - Get specific item
- `POST /api/inventory` - Create new item
- `PUT /api/inventory/:id` - Update item
- `DELETE /api/inventory/:id` - Delete item
- `GET /api/inventory/low-stock` - Get low stock items
- `GET /api/inventory/search?q=query` - Search items

## Environment Variables

### Required
- `MONGODB_URI`: MongoDB connection string
- `MONGODB_DB_NAME`: Database name

### Optional
- `PORT`: Server port (default: 5000)
- `NODE_ENV`: Environment (development/production)
- `FRONTEND_URL`: Frontend URL for CORS (default: http://localhost:5173)

## MongoDB Setup

### Local MongoDB
```env
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB_NAME=inventory_manager
```

### MongoDB Atlas
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/inventory_manager?retryWrites=true&w=majority
MONGODB_DB_NAME=inventory_manager
```

## Development vs Production

### Development
```bash
npm run dev
```
- Uses nodemon for auto-restart
- Detailed error messages
- CORS enabled for localhost

### Production
```bash
npm start
```
- Optimized for performance
- Minimal error details
- Configure CORS for production domain

## API Response Format

### Success Response
```json
{
  "id": "507f1f77bcf86cd799439011",
  "name": "Item Name",
  "description": "Item description",
  "sku": "SKU123",
  "category": "Electronics",
  "categoryId": "507f1f77bcf86cd799439012",
  "quantity": 10,
  "price": 99.99,
  "threshold": 5,
  "created_at": "2024-01-01T00:00:00.000Z",
  "updated_at": "2024-01-01T00:00:00.000Z"
}
```

### Error Response
```json
{
  "error": "Error message"
}
```

## Testing the API

### Using curl
```bash
# Health check
curl http://localhost:5000/api/health

# Get all categories
curl http://localhost:5000/api/categories

# Create a category
curl -X POST http://localhost:5000/api/categories \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Category","description":"Test description"}'
```

### Using Postman
1. Import the API collection
2. Set base URL to `http://localhost:5000/api`
3. Test endpoints

## Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   # Find process using port 5000
   lsof -i :5000
   # Kill the process
   kill -9 <PID>
   ```

2. **MongoDB connection failed**
   - Check if MongoDB is running
   - Verify connection string
   - Check network access (for Atlas)

3. **CORS errors**
   - Ensure `FRONTEND_URL` is set correctly
   - Check if frontend is running on the expected port

4. **Rate limiting**
   - Wait 15 minutes or increase limit in development

### Logs
- Backend logs are displayed in the terminal
- Check for error messages and stack traces
- Use `console.log()` for debugging

## Performance Optimization

### Production Considerations
1. **Database Indexes**: Already configured
2. **Compression**: Enabled with gzip
3. **Rate Limiting**: Configured for API protection
4. **Security Headers**: Helmet.js enabled
5. **Error Handling**: Comprehensive error responses

### Monitoring
- Health check endpoint: `/api/health`
- Server logs in console
- MongoDB connection status

## Deployment

### Heroku
1. Create Heroku app
2. Set environment variables
3. Deploy with `git push heroku main`

### Vercel
1. Connect GitHub repository
2. Set environment variables
3. Deploy automatically

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## Security Best Practices

1. **Environment Variables**: Never commit `.env` files
2. **Input Validation**: Validate all inputs
3. **Rate Limiting**: Prevent abuse
4. **CORS**: Configure properly for production
5. **HTTPS**: Use in production
6. **Authentication**: Implement JWT or session-based auth
7. **Authorization**: Add role-based access control

## Next Steps

1. **Authentication**: Add JWT authentication
2. **File Upload**: Implement image upload for items
3. **Real-time**: Add WebSocket for live updates
4. **Caching**: Implement Redis for caching
5. **Testing**: Add unit and integration tests
6. **Documentation**: Generate API documentation 