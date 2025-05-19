import React from 'react';
import { motion } from 'framer-motion';

interface GraphicalCardProps {
  title: string;
  description: string;
  icon: string;
  color?: 'orange' | 'purple' | 'blue' | 'green';
  onClick?: () => void;
  className?: string;
}

const GraphicalCard: React.FC<GraphicalCardProps> = ({
  title,
  description,
  icon,
  color = 'orange',
  onClick,
  className = '',
}) => {
  const colorVariants = {
    orange: 'from-orange-400 to-orange-600',
    purple: 'from-purple-400 to-purple-600',
    blue: 'from-blue-400 to-blue-600',
    green: 'from-green-400 to-green-600',
  };

  const handVariants = {
    initial: { rotate: 0, y: 0 },
    hover: { rotate: 10, y: -5 },
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`relative group cursor-pointer ${className}`}
      onClick={onClick}
    >
      {/* Hand-drawn border effect */}
      <div className="absolute inset-0 border-2 border-dashed border-white/20 rounded-2xl transform rotate-1 scale-[1.02]"></div>
      
      {/* Main card */}
      <div className="relative bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-xl overflow-hidden">
        {/* Gradient overlay */}
        <div className={`absolute inset-0 bg-gradient-to-br ${colorVariants[color]} opacity-10 group-hover:opacity-20 transition-opacity duration-300`}></div>
        
        {/* Content */}
        <div className="relative z-10">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white mb-2 font-['Inter']">{title}</h3>
              <p className="text-gray-300 text-sm">{description}</p>
            </div>
            <motion.div
              variants={handVariants}
              initial="initial"
              whileHover="hover"
              className="text-3xl"
            >
              {icon}
            </motion.div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -bottom-4 -right-4 w-24 h-24 opacity-10">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <path
              d="M10,50 Q50,10 90,50 T90,50"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-white"
            />
          </svg>
        </div>
      </div>

      {/* Pointing hand illustration */}
      {/* Removed hand emoji as per new design */}
    </motion.div>
  );
};

export default GraphicalCard; 