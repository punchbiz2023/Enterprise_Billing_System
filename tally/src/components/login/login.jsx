import React, { useState } from 'react';
import './login.css';
import { useNavigate } from 'react-router-dom';

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

  return (
    <div className="login-wrapper">
      <div className="outer-box">
        <div className="login-box">
          <h2 className="login-title">Login</h2>
          <form onSubmit={handleSubmit}>
            <div className="input-field">
              <label className="input-label">Email</label>
              <input
                type="email"
                className="input-control"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[eE][dD][uU]$"
                title="Please enter a valid .edu email address"
              />
            </div>
            <div className="input-field">
              <label className="input-label">Password</label>
              <input
                type="password"
                className="input-control"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="login-btn ">
              Login
            </button>
          </form>

          {notification && <p className="notification">{notification}</p>}
        </div>

        {/* Sign Up link */}
        <div className="signup-box">
          <p className="signup-text">
            Not a user? <span className="signup-link" onClick={() => navigate('/sign-up')}>Sign Up</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
