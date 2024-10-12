import { useAuth0 } from '@auth0/auth0-react'
import { Navigate, Outlet } from 'react-router-dom'

const ProtectedRoutes = () => {
  // const { data, loading } = useAppSelector((state) => state.auth)

  // console.log('data in protected routes', data)
  const { isAuthenticated, isLoading } = useAuth0()
  console.log('isAuthenticated\n protexted routes\n', isAuthenticated)
  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        Loading...
      </div>
    )
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/" />
}

export default ProtectedRoutes
