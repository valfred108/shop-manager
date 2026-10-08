import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaStore
} from 'react-icons/fa';

function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please fill in all fields");
      return;
    }

    try {
      const res = await fetch('https://shop-manager-backend-production.up.railway.app/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Login failed");
        return;
      }

      // REAL LOGIN SUCCESS
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('isLoggedIn', 'true');

      alert(`Welcome ${data.user.name}!`);
      navigate('/dashboard');

    } catch (err) {
      alert("Backend not running! Make sure port 5000 is running");
      console.log(err);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-icon">
            <FaStore />
          </div>
          <h2>ShopManager</h2>
          <span>Business Management</span>
        </div>

        <div className="auth-header">
          <h2>Welcome Back</h2>
          <p>Sign in to continue to your dashboard</p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="auth-input-group">
            <label>Email Address</label>
            <div className="auth-input">
              <FaEnvelope />
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="auth-input-group">
            <div className="password-label">
              <label>Password</label>
              <Link to="#">Forgot password?</Link>
            </div>
            <div className="auth-input">
              <FaLock />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <button type="submit" className="auth-submit">
            Sign In
          </button>

          <div className="auth-footer">
            <span>Don't have an account? </span>
            <Link to="/register">Create Account</Link>
          </div>

        </form>
      </div>
    </div>
  );
}

export default Login;