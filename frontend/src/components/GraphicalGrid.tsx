import React from 'react';
import GraphicalCard from './GraphicalCard';

interface GridItem {
  title: string;
  description: string;
  icon: string;
  color?: 'orange' | 'purple' | 'blue' | 'green';
  onClick?: () => void;
}

interface GraphicalGridProps {
  items: GridItem[];
  className?: string;
}

const GraphicalGrid: React.FC<GraphicalGridProps> = ({ items, className = '' }) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {items.map((item, index) => (
        <GraphicalCard
          key={index}
          title={item.title}
          description={item.description}
          icon={item.icon}
          color={item.color}
          onClick={item.onClick}
          className="w-full"
        />
      ))}
    </div>
  );
};

export default GraphicalGrid; 