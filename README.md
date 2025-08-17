# Inventory Management System

A modern, responsive inventory management system built with React, TypeScript, and MongoDB.

## Features

- 🔐 **Authentication**: Firebase Authentication with Google Sign-in
- 📦 **Inventory Management**: Add, edit, delete, and search inventory items
- 📂 **Category Management**: Organize items by categories
- 📊 **Dashboard**: Real-time statistics and low stock alerts
- 🎨 **Modern UI**: Beautiful, responsive design with dark/light theme
- 📱 **Mobile Friendly**: Works seamlessly on all devices
- 🔍 **Search & Filter**: Advanced search capabilities
- 📈 **Activity Logging**: Track all user activities
- ⚡ **Real-time Updates**: Instant data synchronization

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Framer Motion
- **Database**: MongoDB
- **Authentication**: Firebase Auth
- **State Management**: React Context API
- **Icons**: Lucide React, React Icons

## Quick Start

### Prerequisites

1. **Node.js** (v16 or higher)
2. **MongoDB** (local or Atlas)
3. **Firebase Project** (for authentication)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd inventory-management-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   # MongoDB Configuration
   VITE_MONGODB_URI=mongodb://localhost:27017
   VITE_MONGODB_DB_NAME=inventory_manager
   
   # Firebase Configuration
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

4. **Set up MongoDB**
   
   - **Local MongoDB**: Install and start MongoDB server
   - **MongoDB Atlas**: Create a cluster and get connection string
   
   See [MONGODB_SETUP.md](./MONGODB_SETUP.md) for detailed instructions.

5. **Set up Firebase**
   
   - Create a Firebase project
   - Enable Authentication (Email/Password and Google)
   - Get your Firebase config
   - Update the environment variables

6. **Start the development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   
   Navigate to `http://localhost:5173`

## Deployment

The application is deployed on Render:
- **Frontend**: [Your frontend URL here]
- **Backend API**: https://s72-shivamsingh-capstone-inventorymanager.onrender.com

For local development, the API defaults to the production URL. To use a local backend:
1. Create a `.env` file in the root directory
2. Add: `VITE_API_URL=http://localhost:5000/api`

## Project Structure

```
src/
├── components/          # React components
│   ├── auth/           # Authentication components
│   ├── common/         # Reusable UI components
│   ├── inventory/      # Inventory-related components
│   ├── layout/         # Layout components
│   ├── roles/          # Role management components
│   └── users/          # User management components
├── context/            # React Context providers
├── hooks/              # Custom React hooks
├── lib/                # Utility libraries
│   ├── firebase.ts     # Firebase configuration
│   ├── mongodb.ts      # MongoDB connection
│   ├── mongoInventoryService.ts  # MongoDB service layer
│   └── mongoSetup.ts   # MongoDB initialization
├── pages/              # Page components
├── types/              # TypeScript type definitions
└── routes.tsx          # Application routing
```

## Database Schema

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

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Features in Detail

### Authentication
- Email/password authentication
- Google Sign-in
- Anonymous authentication
- Protected routes

### Inventory Management
- Add new inventory items
- Edit existing items
- Delete items
- Search and filter
- Low stock alerts
- Category organization

### Dashboard
- Total items count
- Low stock items
- Recent activities
- Quick actions

### User Management
- User roles and permissions
- Activity logging
- User profiles

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions:
- Check the [MongoDB Setup Guide](./MONGODB_SETUP.md)
- Review the Firebase documentation
- Open an issue on GitHub
