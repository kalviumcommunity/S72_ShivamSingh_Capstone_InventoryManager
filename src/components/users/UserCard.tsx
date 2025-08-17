import styled from 'styled-components';
import { UserType } from '../../types/user';

interface UserCardProps {
  user: UserType;
}

const UserCard = ({ user }: UserCardProps) => {
  return (
    <StyledCard>
      <div className="card-header">
        {user.avatar ? (
          <img 
            src={user.avatar}
            alt={user.name}
            className="avatar"
          />
        ) : (
          <div className="avatar-placeholder">
            {user.name.charAt(0)}
          </div>
        )}
      </div>
      <div className="card-content">
        <h3>{user.name}</h3>
        <span className="role">{user.role === 'manager' ? 'Store Manager' : 'Staff Member'}</span>
        <div className="info">
          <div className="info-item">
            <svg className="icon" viewBox="0 0 24 24">
              <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
            </svg>
            <span>{user.email}</span>
          </div>
          <div className="info-item">
            <svg className="icon" viewBox="0 0 24 24">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
            <span>Member since {new Date(user.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
      <div className="card-footer" />
    </StyledCard>
  );
};

const StyledCard = styled.div`
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-4px);
  }

  .card-header {
    padding: 2rem;
    display: flex;
    justify-content: center;
    background: linear-gradient(135deg, #58b0e0 0%, #3b82f6 100%);
  }

  .avatar {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    border: 4px solid white;
    object-fit: cover;
  }

  .avatar-placeholder {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    border: 4px solid white;
    background: #3b82f6;
    color: white;
    font-size: 2.5rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .card-content {
    padding: 1.5rem;
    text-align: center;

    h3 {
      font-size: 1.25rem;
      font-weight: 600;
      color: #1f2937;
      margin-bottom: 0.5rem;
    }

    .role {
      display: inline-block;
      padding: 0.25rem 0.75rem;
      background: #e5e7eb;
      color: #4b5563;
      border-radius: 9999px;
      font-size: 0.875rem;
      font-weight: 500;
      margin-bottom: 1rem;
    }

    .info {
      text-align: left;
      
      .info-item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem 0;
        color: #6b7280;
        font-size: 0.875rem;

        .icon {
          width: 18px;
          height: 18px;
          fill: currentColor;
        }
      }
    }
  }

  .card-footer {
    height: 6px;
    background: linear-gradient(135deg, #58b0e0 0%, #3b82f6 100%);
  }
`;

export default UserCard;