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
      
      // Navigate to the dashboard after successful login
      navigate('/dashboard');
    } else {
      setNotification('Login failed');
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-container">
          <label>Email</label>
          <input 
            type="email" 
            placeholder="Enter your email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required 
            pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[eE][dD][uU]$"
            title="Please enter a valid .edu email address"
          />
        </div>
        <div className="input-container">
          <label>Password</label>
          <input 
            type="password" 
            placeholder="Enter your password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
          />
        </div>
        <button type="submit" className="login-button">
          Login
        </button>
      </form>
      <button 
        className="signup-button" 
        onClick={() => navigate('/sign-up')}
      >
        Sign Up
      </button>
      
      {/* Display the notification */}
      {notification && <p>{notification}</p>}
    </div>
  );
};

export default Login;
