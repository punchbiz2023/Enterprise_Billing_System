import React, { useState } from 'react';
import './login.css';
import { useNavigate } from 'react-router-dom';
import { auth, provider } from './firebase'; 
import { signInWithPopup } from 'firebase/auth'; 
import { FaGoogle, FaLock, FaUser } from 'react-icons/fa';  // Icons

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [notification, setNotification] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Form validation
    if (email === 'punchbiz@kongu.edu' && password === 'admin') {
      setNotification('Login successful');
      navigate('/dashboard');
    } else {
      setNotification('Login failed');
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, provider);
      setNotification('Login successful');
      navigate('/dashboard'); 
    } catch (error) {
      console.error("Google Sign-In Error", error);
      setNotification('Google login failed');
    }
  };

  return (
    <div className="login-wrapper">
      <div className="outer-box">
        <div className="login-box">
          <h2 className="login-title">Login</h2>
          <form onSubmit={handleSubmit}>
            <div className="input-field">
              <label className="input-label">Email</label>
              <div className="input-container">
                <FaUser className="icon" />
                <input
                  type="email"
                  className="input-control"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="input-field">
              <label className="input-label">Password</label>
              <div className="input-container">
                <FaLock className="icon" />
                <input
                  type="password"
                  className="input-control"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            <button type="submit" className="login-btn">
              <FaLock /> Login
            </button>
          </form>

          <button onClick={handleGoogleSignIn} className="google-signin-btn">
            <FaGoogle /> Sign in with Google
          </button>

          {notification && <p className="notification">{notification}</p>}
        </div>

        <div className="signup-box">
          <p className="signup-text">
            Not a user? <span className="signup-link" onClick={() => navigate('/sign-up')}>Register</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
