import React from 'react';
import { useNavigate } from 'react-router-dom';

const Tour: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: 'Inventory Management',
      description: 'Track and manage your inventory with ease. Add, update, and monitor stock levels in real-time.',
      icon: '📦'
    },
    {
      title: 'Analytics Dashboard',
      description: 'Get insights into your inventory performance with detailed analytics and reports.',
      icon: '📊'
    },
    {
      title: 'User Management',
      description: 'Manage user roles and permissions to control access to your inventory system.',
      icon: '👥'
    },
    {
      title: 'Real-time Updates',
      description: 'Stay informed with real-time notifications and updates about your inventory.',
      icon: '🔄'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Welcome to Inventory Manager</h1>
          <p className="text-xl text-gray-400">Discover how we can help you manage your inventory efficiently</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {features.map((feature, index) => (
            <div key={index} className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-colors">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center gap-4">
          <button
            onClick={() => navigate('/register')}
            className="px-8 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-md hover:from-purple-600 hover:to-indigo-700 transition-colors"
          >
            Get Started
          </button>
          <button
            onClick={() => navigate('/login')}
            className="px-8 py-3 border border-gray-600 rounded-md hover:bg-gray-800 transition-colors"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Tour; 