import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { AUTH_INPUT_CONFIG } from '../../constants/authInputConfig'
import { authenticateUser } from '../../redux/slices/authSlice'
import { useAppDispatch, useAppSelector } from '../../redux/store'
import AuthInput from '../Input/AuthInput'

const AuthComponent = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { loading, error, data } = useAppSelector((state) => state.auth)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    confirmPassword: '',
  })
  const [isSignup, setIsSignup] = useState(false)
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const isConfirmPasswordDisabled = formData.password.length < 6

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFormSubmitted(true)

    const method = isSignup ? 'signup' : 'login'
    const { email, password, firstName, lastName } = formData

    dispatch(authenticateUser({ email, password, method, firstName, lastName }))
      .then(() => {
        if (data && data.auth) {
          navigate('/')
        }
      })
      .catch((err) => {
        console.log('Error in auth component:', err)
        setErrorMessage('Invalid Credentials')
      })
      .finally(() => {
        setFormSubmitted(false)
      })
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setFormData((prevData) => ({ ...prevData, [name]: value }))
    setErrorMessage('')
  }

  const renderInput = (
    label: string,
    name: string,
    type: string,
    placeholder: string,
    required: boolean = true
  ) => (
    <div className="mx-auto w-2/3 min-w-32">
      <AuthInput
        label={label}
        name={name}
        type={type}
        placeholder={placeholder}
        value={formData[name as keyof typeof formData]}
        onChange={handleInputChange}
        required={required}
        error={formSubmitted && !formData[name as keyof typeof formData]}
        helperText={`${label} is required`}
        disabled={name === 'confirmPassword' && isConfirmPasswordDisabled}
      />
    </div>
  )

  return (
    <div className="flex h-full flex-1 flex-col items-center justify-center">
      <h2>{isSignup ? 'Sign Up' : 'Login'}</h2>
      <form
        onSubmit={handleSubmit}
        className="flex w-full flex-col items-center justify-center gap-4 text-white"
      >
        {AUTH_INPUT_CONFIG.filter(
          (input) => !input.showOnSignup || (input.showOnSignup && isSignup)
        ).map((input) =>
          renderInput(
            input.label,
            input.name,
            input.type,
            input.placeholder,
            input.required
          )
        )}

        <button type="submit" disabled={loading}>
          {loading ? 'Loading...' : isSignup ? 'Sign Up' : 'Login'}
        </button>
      </form>
      <button
        className="mt-4 px-4 py-2"
        type="button"
        onClick={() => setIsSignup((prev) => !prev)}
      >
        {isSignup ? 'Switch to Login' : 'Switch to Sign Up'}
      </button>
      {(error || errorMessage) && formSubmitted && (
        <p className="text-red-500">{errorMessage}</p>
      )}
    </div>
  )
}

export default AuthComponent
