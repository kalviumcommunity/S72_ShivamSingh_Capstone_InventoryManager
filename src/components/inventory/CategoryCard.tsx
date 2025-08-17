import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Package } from 'lucide-react';
import { Link } from 'react-router-dom';

interface CategoryCardProps {
  name: string;
  itemCount: number;
  categoryId: string;
}

const CategoryCard = ({ name, itemCount, categoryId }: CategoryCardProps) => {
  return (
    <Link to={`/inventory/category/${categoryId}`}>
      <StyledCard>
        <motion.div 
          className="card"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95, rotate: '1.7deg' }}
        >
          <div className="icon">
            <Package className="h-8 w-8" />
          </div>
          <h3>{name}</h3>
          <p>{itemCount} items</p>
        </motion.div>
      </StyledCard>
    </Link>
  );
};

const StyledCard = styled.div`
  .card {
    box-sizing: border-box;
    width: 100%;
    height: 200px;
    background: rgba(217, 217, 217, 0.58);
    border: 1px solid white;
    box-shadow: 12px 17px 51px rgba(0, 0, 0, 0.22);
    backdrop-filter: blur(6px);
    border-radius: 17px;
    text-align: center;
    cursor: pointer;
    transition: all 0.5s;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    user-select: none;
    color: black;
    padding: 1rem;
  }

  .card:hover {
    border: 1px solid black;
  }

  .icon {
    background: rgba(59, 130, 246, 0.1);
    padding: 1rem;
    border-radius: 50%;
    margin-bottom: 1rem;
    color: #3b82f6;
  }

  h3 {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }

  p {
    color: #6b7280;
    font-size: 0.875rem;
  }
`;

export default CategoryCard;