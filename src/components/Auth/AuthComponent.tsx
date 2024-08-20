import { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'

import {
  authenticateUser,
  logoutCurrentUser,
  me,
} from '../../redux/slices/authSlice'
import { useAppDispatch, useAppSelector } from '../../redux/store'

const AuthComponent = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { loading, error, data } = useAppSelector((state) => state.auth)
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [firstName, setFirstName] = useState<string>('')
  const [lastName, setLastName] = useState<string>('')
  const [isSignup, setIsSignup] = useState<boolean>(false)
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('submit form fn')
    setFormSubmitted(true)
    const method = isSignup ? 'signup' : 'login'
    dispatch(authenticateUser({ email, password, method, firstName, lastName }))
      .then(() => {
        if (data && data.auth) {
          navigate('/')
        }
      })
      .catch((err) => {
        console.log('Error in auth component\n:', err)
      })
    // .finally(() => {
    //   setFormSubmitted(false);
    // });
  }

  return (
    <div className="flex h-full flex-1 flex-col items-center justify-center">
      <h2>{isSignup ? 'Sign Up' : 'Login'}</h2>
      <form onSubmit={handleSubmit}>
        {isSignup && (
          <>
            <div>
              <label>First Name:</label>
              <input
                placeholder="Jordan"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Last Name:</label>
              <input
                placeholder="Walke"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
          </>
        )}
        <div>
          <label>Email:</label>
          <input
            placeholder="jordan@example.com"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Loading...' : isSignup ? 'Sign Up' : 'Login'}
        </button>
      </form>
      <button type="button" onClick={() => setIsSignup((prev) => !prev)}>
        {isSignup ? 'Switch to Login' : 'Switch to Sign Up'}
      </button>
      {error && formSubmitted && (
        <p className="text-red-500">Invalid Credentials</p>
      )}
    </div>
  )
}

export default AuthComponent
