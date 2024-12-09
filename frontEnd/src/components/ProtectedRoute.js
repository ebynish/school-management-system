// ProtectedRoute.js
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element }) => {
  const token = useSelector((state) => state.auth.token);

  if (!token) {
    return <Navigate to="/login" />;
  }

  return element;
};

export default ProtectedRoute;
