import AuthComponent from '@/components/Auth/AuthComponent'
import AuthLayout from '@/layouts/AuthLayout'
import ProtectedLayout from '@/layouts/ProtectedLayout'
import AllJobPostingsComponent from '@/pages/AllJobPostingsComponent'
import AppliedJobsComponent from '@/pages/AppliedJobs'
import Callback from '@/pages/Callback'
import Form from '@/pages/Form'
import Home from '@/pages/Home'
import { me } from '@/redux/slices/authSlice'
import { useAppDispatch, useAppSelector } from '@/redux/store'
import { useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

import ProtectedRoutes from './ProtectedRoutes'

const AppRoutes = () => {
  const { data } = useAppSelector((state) => state.auth)
  const dispatch = useAppDispatch()
  console.log('app routes', data)
  const isAuthenticated = Boolean(data?.auth)

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

  return (
    <Routes>
      {isAuthenticated ? (
        <Route path="/auth" element={<Navigate to="/" replace />} />
      ) : (
        <>
          <Route
            path="/auth"
            element={
              <AuthLayout>
                <AuthComponent />
              </AuthLayout>
            }
          />
          <Route path="/callback" element={<Callback />} />
        </>
      )}
      <Route element={<ProtectedRoutes />}>
        <Route
          path="/"
          element={
            <ProtectedLayout>
              <Home />
            </ProtectedLayout>
          }
        />
        <Route
          path="/jobs/:company"
          element={
            <ProtectedLayout>
              <AllJobPostingsComponent />
            </ProtectedLayout>
          }
        />
        <Route
          path="/profile/applied-jobs"
          element={
            <ProtectedLayout>
              <AppliedJobsComponent />
            </ProtectedLayout>
          }
        />
        <Route
          path="/jobs/todays-jobs"
          element={
            <ProtectedLayout>
              <AllJobPostingsComponent isTodaysJobs={true} />
            </ProtectedLayout>
          }
        />
      </Route>
      <Route
        path="/test/form/don-quixote"
        element={
          <ProtectedLayout>
            <Form />
            {/* <div>
              <h1>Form</h1>
            </div> */}
          </ProtectedLayout>
        }
      />

      <Route path="/*" element={<div> Error 404</div>} />
    </Routes>
  )
}

export default AppRoutes
