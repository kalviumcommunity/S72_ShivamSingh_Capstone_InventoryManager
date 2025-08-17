# Deployment Configuration

## Backend API URL

The application is configured to use the production backend API deployed on Render:

**Production API URL**: `https://s72-shivamsingh-capstone-inventorymanager.onrender.com/api`

## Configuration

### Default Configuration
The application automatically uses the production API URL by default. No additional configuration is required for production use.

### Local Development
To use a local backend server during development:

1. Create a `.env` file in the root directory
2. Add the following line:
   ```
   VITE_API_URL=http://localhost:5000/api
   ```

### Environment Variables

| Variable | Description | Default Value |
|----------|-------------|---------------|
| `VITE_API_URL` | Backend API base URL | `https://s72-shivamsingh-capstone-inventorymanager.onrender.com/api` |

## API Endpoints

All API endpoints are relative to the base URL:

- Health Check: `/health`
- Categories: `/categories`
- Inventory: `/inventory`
- Low Stock Items: `/inventory/low-stock`
- Search: `/inventory/search?q={query}`

## Testing the Connection

You can test the API connection by visiting:
`https://s72-shivamsingh-capstone-inventorymanager.onrender.com/api/health`

This should return a JSON response with status and message.

## Troubleshooting

If you encounter connection issues:

1. Verify the Render service is running
2. Check the API URL in the browser's network tab
3. Ensure CORS is properly configured on the backend
4. For local development, make sure the local backend server is running on port 5000
