import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ userTypes, children }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return (
      <Navigate 
        to="/login" 
        state={{ from: location.pathname + location.search }}
        replace 
      />
    );
  }

  if (!userTypes.includes(user.userType)) {
    return (
      <Navigate 
        to="/unauthorized" 
        state={{ message: 'You do not have permission to access this page' }}
        replace 
      />
    );
  }

  return children;
};

export default ProtectedRoute;
