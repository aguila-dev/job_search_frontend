import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import {
  loginUser,
  signupUser,
  logoutUser,
} from '../../redux/slices/authSlice';

const AuthComponent = () => {
  const dispatch = useAppDispatch();
  const { loading, error, token } = useAppSelector((state) => state.auth);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isSignup, setIsSignup] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignup) {
      dispatch(signupUser({ email, password }));
    } else {
      dispatch(loginUser({ email, password }));
    }
  };

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <div>
      {token ? (
        <div>
          <h2>Welcome</h2>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <>
          <h2>{isSignup ? 'Sign Up' : 'Login'}</h2>
          <form onSubmit={handleSubmit}>
            <div>
              <label>Email:</label>
              <input
                placeholder='jordan@example.com'
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Password:</label>
              <input
                type='password'
                value={password}
                placeholder='Password'
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type='submit' disabled={loading}>
              {loading ? 'Loading...' : isSignup ? 'Sign Up' : 'Login'}
            </button>
          </form>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <button type='button' onClick={() => setIsSignup((prev) => !prev)}>
            {isSignup ? 'Switch to Login' : 'Switch to Sign Up'}
          </button>
        </>
      )}
    </div>
  );
};

export default AuthComponent;
