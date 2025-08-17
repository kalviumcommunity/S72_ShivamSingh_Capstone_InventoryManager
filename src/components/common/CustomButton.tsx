import { ReactNode } from 'react';
import styled from 'styled-components';

interface CustomButtonProps {
  children: ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

const CustomButton = ({ children, onClick, type = 'button', className = '' }: CustomButtonProps) => {
  return (
    <StyledButton type={type} onClick={onClick} className={className}>
      {children}
    </StyledButton>
  );
};

const StyledButton = styled.button`
  border: none;
  outline: none;
  background-color: #fdf4ec;
  padding: 10px 20px;
  font-size: 12px;
  font-weight: 700;
  color: #000;
  border-radius: 5px;
  transition: all ease 0.1s;
  box-shadow: 0px 5px 0px 0px #8e8f95;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;

  &:active {
    transform: translateY(5px);
    box-shadow: 0px 0px 0px 0px #8e8f95;
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

export default CustomButton;