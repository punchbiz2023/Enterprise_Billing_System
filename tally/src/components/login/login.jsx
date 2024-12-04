import React, { useState } from 'react';
import './login.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import axios for API requests

import LoginLogo from '../../assets/login_img.jpg';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [notification, setNotification] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Form validation (add your own validation here)
    if (!email || !password) {
      setNotification('Please enter both email and password.');
      return;
    }

    try {
      // Send login request to your backend (replace URL with your backend login endpoint)
      const response = await axios.post('https://enterprisebillingsystem.onrender.com/api/login', { email, password });
      const { accessToken, refreshToken } = response.data;

      // Store the access and refresh tokens in localStorage
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);

      setNotification('Login successful');
      navigate('/dashboard'); // Redirect to dashboard after successful login
    } catch (error) {
      console.error('Login failed:', error);
      setNotification('Login failed. Please check your credentials.');
    }
  };

  // Function to handle refresh token
  const refreshAccessToken = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken'); // Get the refresh token from localStorage

      if (!refreshToken) {
        setNotification('No refresh token found. Please log in again.');
        navigate('/login'); // Redirect to login if no refresh token
        return;
      }

      const response = await axios.post('https://enterprisebillingsystem.onrender.com/api/login/refresh-token', { refreshToken });
      const { accessToken } = response.data;

      // Store the new access token in localStorage
      localStorage.setItem('accessToken', accessToken);
      console.log('Access token refreshed');
      return accessToken;
    } catch (error) {
      console.error('Error refreshing access token:', error);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setNotification('Session expired. Please log in again.');
      navigate('/login'); // Redirect to login if refresh fails
    }
  };

  // Handling the case where access token is expired and retrying the API request with refresh token
  const makeApiRequest = async () => {
    try {
      const response = await axios.get('https://enterprisebillingsystem.onrender.com/api/login/protected-resource', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`, // Add access token
        },
      });
      console.log('API Response:', response.data);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        // If access token is expired, try refreshing it
        const newAccessToken = await refreshAccessToken();
        // Retry the original request with the new access token
        await axios.get('/api/protected-resource', {
          headers: {
            Authorization: `Bearer ${newAccessToken}`,
          },
        });
      } else {
        console.error('Error during API request:', error);
      }
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <div className="image-container">
          <img src={LoginLogo} alt="Graduation" className="background-image" />
        </div>
        <div className="login-box">
          <h2 className="login-title">Login</h2>
          <form onSubmit={handleSubmit}>
            <div className="input-field">
              <div className="input-container">
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
              <div className="input-container">
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
              Login
            </button>
          </form>

          <p className="signup-text text-center">
            Not a user?{" "}
            <span
              className="signup-link text-blue-500 cursor-pointer"
              onClick={() => navigate('/sign-up')}
            >
              Register
            </span>
          </p>

          {notification && <p className="notification">{notification}</p>}
        </div>
      </div>
    </div>
  );
};

export default Login;
