import { Navigate, Outlet } from 'react-router-dom';

import { useAppSelector } from './redux/store';

const ProtectedRoute = () => {
  const token = useAppSelector((state) => state.auth.token);

  return token ? <Outlet /> : <Navigate to='/auth' />;
};

export default ProtectedRoute;
