
import { Navigate } from 'react-router-dom';

const Index = () => {
  // Redirect to dashboard instead of showing a welcome page
  return <Navigate to="/dashboard" replace />;
};

export default Index;
