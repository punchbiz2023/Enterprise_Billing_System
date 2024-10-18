import React, { useState } from 'react';
import './login.css';
import { useNavigate } from 'react-router-dom';
import { auth, provider } from './firebase'; 
import { signInWithPopup } from 'firebase/auth'; 
import { FaGoogle, FaLock, FaUser } from 'react-icons/fa';  // Icons
import Loginlogo from '../../assets/Loginlogo.jpeg';

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
    <div className="login-wrapper"> {/* New wrapper */}
      <div className="login-container">
        <div className="image-container">
          <img src={Loginlogo} alt="Graduation" className="background-image" />
        </div>
        <div className="login-box">
          <h2 className="login-title">Login</h2>
          <form onSubmit={handleSubmit}>
            <div className="input-field">
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

          <p className="signup-text text-center">
  Not a user?{" "}
  <span className="signup-link text-blue-500 cursor-pointer" onClick={() => navigate('/sign-up')}>
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
