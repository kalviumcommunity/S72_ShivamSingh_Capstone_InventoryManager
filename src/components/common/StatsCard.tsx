import { ReactNode } from 'react';

interface StatsCardProps {
  number: string;
  title: string;
  icon: ReactNode;
  cardType?: 'totalItems' | 'categories' | 'totalValue' | 'lowStock';
  color?: string;
}

const StatsCard = ({ number, title, icon, cardType }: StatsCardProps) => {
  const getCardStyles = () => {
    const baseStyles = "w-full h-48 rounded-2xl p-6 transition-all duration-500 cursor-pointer relative overflow-hidden backdrop-blur-glass border";
    
    switch (cardType) {
      case 'totalItems':
        return `${baseStyles} bg-gradient-to-br from-stats-total-items-light to-yellow-200 dark:from-stats-total-items-dark dark:to-gray-600 border-yellow-200 dark:border-gray-600 hover:shadow-xl hover:shadow-yellow-200/30 dark:hover:shadow-gray-600/30`;
      case 'categories':
        return `${baseStyles} bg-gradient-to-br from-stats-categories-light to-green-200 dark:from-stats-categories-dark dark:to-emerald-700 border-green-200 dark:border-emerald-700 hover:shadow-xl hover:shadow-green-200/30 dark:hover:shadow-emerald-700/30`;
      case 'totalValue':
        return `${baseStyles} bg-gradient-to-br from-stats-total-value-light to-blue-200 dark:from-stats-total-value-dark dark:to-blue-700 border-blue-200 dark:border-blue-700 hover:shadow-xl hover:shadow-blue-200/30 dark:hover:shadow-blue-700/30`;
      case 'lowStock':
        return `${baseStyles} bg-gradient-to-br from-stats-low-stock-light to-red-200 dark:from-stats-low-stock-dark dark:to-red-700 border-red-200 dark:border-red-700 hover:shadow-xl hover:shadow-red-200/30 dark:hover:shadow-red-700/30`;
      default:
        return `${baseStyles} bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 border-gray-200 dark:border-gray-600`;
    }
  };

  return (
    <div className={`${getCardStyles()} group hover:-translate-y-2 hover:scale-105 animate-float`}>
      {/* Glassmorphism overlay */}
      <div className="absolute inset-0 bg-white/10 dark:bg-black/10 backdrop-blur-sm" />
      
      {/* Content */}
      <div className="relative z-10 flex flex-col justify-between h-full transition-transform duration-300 group-hover:scale-105">
        {/* Top section */}
        <div className="flex justify-between items-start">
          <span className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white transition-all duration-300 group-hover:scale-110">
            {number}
          </span>
          <div className="p-3 rounded-full bg-white/20 dark:bg-black/20 backdrop-blur-sm transition-all duration-300 group-hover:scale-110 group-hover:rotate-12 group-hover:bg-white/30 dark:group-hover:bg-black/30">
            <div className="text-gray-700 dark:text-gray-200">
              {icon}
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="flex justify-between items-end">
          <p className="text-lg font-semibold text-gray-700 dark:text-gray-200 transition-all duration-300">
            {title}
          </p>
        </div>
      </div>

      {/* Hover effect gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform -skew-x-12 translate-x-full group-hover:-translate-x-full" />
    </div>
  );
};

export default StatsCard;