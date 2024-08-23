import { me } from '@/redux/slices/authSlice'
import { useEffect } from 'react'
import { Navigate, Outlet } from 'react-router-dom'

import { useAppDispatch, useAppSelector } from '../redux/store'

const ProtectedRoutes = () => {
  const dispatch = useAppDispatch()
  const { data, loading } = useAppSelector((state) => state.auth)

  console.log('data in protected routes', data)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await dispatch(me())
      } catch (error) {
        console.log('User is not authenticated, redirecting to login.')
      }
    }

    checkAuth()
  }, [dispatch])

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
