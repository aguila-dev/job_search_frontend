import { useEffect } from 'react'

import { me } from './redux/slices/authSlice'
import { useAppDispatch, useAppSelector } from './redux/store'
import AppRoutes from './routes/AppRoutes'

function App() {
  const { data } = useAppSelector((state) => state.auth)
  const dispatch = useAppDispatch()

  console.log('Data in ProtectedRoute:', data)
  useEffect(() => {
    const fetchMe = async () => {
      try {
        await dispatch(me())
      } catch (err) {
        console.log('Error fetching user data:', err)
      }
    }

    fetchMe()
  }, [dispatch])

  return <AppRoutes />
}

export default App
