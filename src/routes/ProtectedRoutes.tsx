import { Navigate, Outlet } from "react-router-dom";
import { isDevelopment } from "../utils/developmentEnvironment";
import { useAppSelector } from "../redux/store";

const ProtectedRoute = () => {
  const { data } = useAppSelector((state) => state.auth);
  // if (loading) return <div>Loading...</div>;
  if (isDevelopment) return <Outlet />;
  return data?.auth ? <Outlet /> : <Navigate to="/auth" />;
};

export default ProtectedRoute;
