import { Navigate, Outlet } from 'react-router-dom'

import { useAppSelector } from '../redux/store'

const ProtectedRoutes = () => {
  const { data, loading } = useAppSelector((state) => state.auth)

  console.log('data in protected routes', data)

  if (loading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        Loading...
      </div>
    )
  }

  return data?.auth ? <Outlet /> : <Navigate to="/auth" />
}

export default ProtectedRoutes
