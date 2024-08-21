import { me } from '@/redux/slices/authSlice'
import { useEffect } from 'react'
import { Navigate, Outlet } from 'react-router-dom'

import { useAppDispatch, useAppSelector } from '../redux/store'

const ProtectedRoute = () => {
  const { data } = useAppSelector((state) => state.auth)
  const dispatch = useAppDispatch()

  console.log('Data in ProtectedRoute:', data)
  useEffect(() => {
    const fetchMe = async () => {
      try {
        if (data && data.auth && !data?.token) {
          // Check if the access token is present
          await dispatch(me())
        }
      } catch (err) {
        console.log('Error fetching user data:', err)
      }
    }

    fetchMe()
  }, [data, dispatch])

  return data?.auth ? <Outlet /> : <Navigate to="/auth" />
}

export default ProtectedRoute
