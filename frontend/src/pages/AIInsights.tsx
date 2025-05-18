import React, { useState } from 'react'
import {
  ChartBarIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline'

interface PriceRecommendation {
  product: string
  currentPrice: number
  recommendedPrice: number
  change: number
  confidence: number
  trend: 'up' | 'down' | 'stable'
}

interface StockForecast {
  product: string
  currentStock: number
  predictedStock: number
  confidence: number
  risk: 'high' | 'medium' | 'low'
}

const mockPriceRecommendations: PriceRecommendation[] = [
  {
    product: 'Laptop Pro X',
    currentPrice: 1299.99,
    recommendedPrice: 1349.99,
    change: 3.85,
    confidence: 85,
    trend: 'up',
  },
  {
    product: 'Wireless Mouse',
    currentPrice: 49.99,
    recommendedPrice: 44.99,
    change: -10.00,
    confidence: 92,
    trend: 'down',
  },
  {
    product: 'Gaming Headset',
    currentPrice: 79.99,
    recommendedPrice: 79.99,
    change: 0,
    confidence: 78,
    trend: 'stable',
  },
]

const mockStockForecasts: StockForecast[] = [
  {
    product: 'Laptop Pro X',
    currentStock: 25,
    predictedStock: 15,
    confidence: 88,
    risk: 'high',
  },
  {
    product: 'Wireless Mouse',
    currentStock: 150,
    predictedStock: 180,
    confidence: 75,
    risk: 'low',
  },
  {
    product: 'Gaming Headset',
    currentStock: 45,
    predictedStock: 30,
    confidence: 82,
    risk: 'medium',
  },
]

const AIInsights: React.FC = () => {
  const [timeRange, setTimeRange] = useState('month')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const getTrendIcon = (trend: PriceRecommendation['trend']) => {
    switch (trend) {
      case 'up':
        return <ArrowTrendingUpIcon className="h-5 w-5 text-green-500" />
      case 'down':
        return <ArrowTrendingDownIcon className="h-5 w-5 text-red-500" />
      default:
        return <ChartBarIcon className="h-5 w-5 text-gray-500" />
    }
  }

  const getRiskColor = (risk: StockForecast['risk']) => {
    switch (risk) {
      case 'high':
        return 'text-red-500 dark:text-red-400'
      case 'medium':
        return 'text-yellow-500 dark:text-yellow-400'
      case 'low':
        return 'text-green-500 dark:text-green-400'
      default:
        return 'text-gray-500 dark:text-gray-400'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">AI Insights</h1>
        <div className="flex space-x-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 text-sm focus:border-indigo-500 focus:ring-indigo-500 dark:text-white"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
          </select>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 text-sm focus:border-indigo-500 focus:ring-indigo-500 dark:text-white"
          >
            <option value="all">All Categories</option>
            <option value="electronics">Electronics</option>
            <option value="accessories">Accessories</option>
            <option value="peripherals">Peripherals</option>
          </select>
        </div>
      </div>

      {/* Stock Forecasts */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">Stock Forecasts</h3>
        </div>
        <div className="border-t border-gray-200 dark:border-gray-700">
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {mockStockForecasts.map((forecast) => (
              <div key={forecast.product} className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <ChartBarIcon className="h-6 w-6 text-indigo-500" />
                    </div>
                    <div className="ml-4">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white">{forecast.product}</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Current Stock: {forecast.currentStock}
                      </p>
                    </div>
                  </div>
                  <div className="ml-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                      {forecast.confidence}% Confidence
                    </span>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Predicted Stock</p>
                    <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">{forecast.predictedStock}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Risk Level</p>
                    <p className={`mt-1 text-sm font-medium ${getRiskColor(forecast.risk)}`}>
                      {forecast.risk.charAt(0).toUpperCase() + forecast.risk.slice(1)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Price Recommendations */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">Price Recommendations</h3>
        </div>
        <div className="border-t border-gray-200 dark:border-gray-700">
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {mockPriceRecommendations.map((recommendation) => (
              <div key={recommendation.product} className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <CurrencyDollarIcon className="h-6 w-6 text-indigo-500" />
                    </div>
                    <div className="ml-4">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white">{recommendation.product}</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Current Price: ${recommendation.currentPrice.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <div className="ml-4">
                    {getTrendIcon(recommendation.trend)}
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Recommended Price</p>
                    <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                      ${recommendation.recommendedPrice.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Price Change</p>
                    <p className={`mt-1 text-sm font-medium ${
                      recommendation.change > 0
                        ? 'text-green-600 dark:text-green-400'
                        : recommendation.change < 0
                        ? 'text-red-600 dark:text-red-400'
                        : 'text-gray-600 dark:text-gray-400'
                    }`}>
                      {recommendation.change > 0 ? '+' : ''}{recommendation.change}%
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AIInsights 