import { useEffect } from 'react'

import { me } from './redux/slices/authSlice'
import { useAppDispatch, useAppSelector } from './redux/store'
import AppRoutes from './routes/AppRoutes'

function App() {
  const dispatch = useAppDispatch()
  const { data } = useAppSelector((state) => state.auth)

  useEffect(() => {
    const fetchMe = async () => {
      try {
        await dispatch(me()).unwrap()
      } catch (err) {
        console.log('Error fetching user data:', err)
      }
    }

    if (!data?.auth) {
      fetchMe()
    }
  }, [data, dispatch])

  return <AppRoutes />
}

export default App
