import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AgentRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center"><div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600" /></div>;
  }

  if (!user || user.role !== 'AGENT') return <Navigate to="/" />;
  return children;
};

export default AgentRoute;