import HomeLayout from '@/layouts/HomeLayout'
import ProtectedLayout from '@/layouts/ProtectedLayout'
import About from '@/pages/About'
import AllJobPostingsComponent from '@/pages/AllJobPostingsComponent'
import AppliedJobsComponent from '@/pages/AppliedJobs'
import Contact from '@/pages/Contact'
import Home from '@/pages/Home'
import NonAuthHome from '@/pages/NonAuthHome'
import { useAuth0 } from '@auth0/auth0-react'
import axios from 'axios'
import { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'

import ProtectedRoutes from './ProtectedRoutes'

const AppRoutes = () => {
  const { isAuthenticated, user, getAccessTokenSilently } = useAuth0()
  console.log(`app is working: ${import.meta.env.MODE} mode...`)
  console.log('isAuthenticated', isAuthenticated)
  console.log('VITE_AUTH0_AUDIENCE', import.meta.env.VITE_AUTH0_AUDIENCE)
  console.log('domain', import.meta.env.VITE_AUTH0_DOMAIN)
  console.log(' client id', import.meta.env.VITE_AUTH0_CLIENT_ID)

  useEffect(() => {
    const syncUser = async () => {
      if (isAuthenticated && user) {
        try {
          const token = await getAccessTokenSilently({
            authorizationParams: {
              audience: import.meta.env.VITE_AUTH0_AUDIENCE,
              scope: 'openid profile email',
              prompt: 'consent',
            },
          })

          console.log('authorization token', token)
          console.log('user', user)

          // Step 1: Check if user already exists in your database
          const { data: existingUser } = await axios.get(
            `http://localhost:8000/v1/auth/checkUser`, // Use an endpoint to check if user exists
            {
              params: { email: user.email }, // Pass the email to check
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )

          if (!existingUser) {
            console.log(
              "User doesn't exist in the database, creating user...\n"
            )

            await axios.post(
              'http://localhost:8000/v1/auth/signup',
              {
                email: user.email,
                firstName: user.name,
                lastName: user.name,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            )
            console.log('User created successfully')
          } else {
            console.log('User already exists in the database')
          }
        } catch (error) {
          console.error('error', error)
        }
      }
    }

    syncUser()
  }, [isAuthenticated, getAccessTokenSilently, user])

  return (
    <Routes>
      <Route
        path="/"
        element={
          <HomeLayout>
            <NonAuthHome />
          </HomeLayout>
        }
      />
      <Route
        path="/contact"
        element={
          <HomeLayout>
            <Contact />
          </HomeLayout>
        }
      />
      <Route
        path="/about"
        element={
          <HomeLayout>
            <About />
          </HomeLayout>
        }
      />
      <Route element={<ProtectedRoutes />}>
        <Route
          path="/profile"
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
      <Route path="/*" element={<div> Error 404</div>} />
    </Routes>
  )
}

export default AppRoutes
