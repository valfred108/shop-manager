import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaUserPlus,
  FaStore
} from "react-icons/fa";

function Register() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegister = async(e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      alert("Please fill in all fields.");
      return;
    }
    

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
    try {
      const res =await fetch('https://shop-manager-backend-production.up.railway.app/api/register', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password
        })
      });
      const data=await res.json();
      if (!res.ok){
        alert(data.error);
        return;
      }
      alert("Account successfully! Now login");
      navigate("/login");
    } catch (err){
      alert ("Backend not running! Make sure server.js is running on 5000");
      console.log(err);
    }
  };


    
  return (
    <div className="auth-page">

      <div className="auth-card">

        {/* LOGO */}
        <div className="auth-logo">
          <div className="auth-logo-icon">
            <FaStore />
          </div>

          <div>
            <h2>ShopManager</h2>
            <span>Business Management</span>
          </div>
        </div>

        {/* HEADER */}
        <div className="auth-header">
          <h1>Create Account</h1>
          <p>Create your ShopManager administrator account</p>
        </div>

        {/* FORM */}
        <form onSubmit={handleRegister}>

          {/* NAME */}
          <div className="auth-input-group">
            <label>Full Name</label>

            <div className="auth-input">
              <FaUser />

              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* EMAIL */}
          <div className="auth-input-group">
            <label>Email Address</label>

            <div className="auth-input">
              <FaEnvelope />

              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* PASSWORD */}
          <div className="auth-input-group">
            <label>Password</label>

            <div className="auth-input">
              <FaLock />

              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
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

          {/* CONFIRM PASSWORD */}
          <div className="auth-input-group">
            <label>Confirm Password</label>

            <div className="auth-input">
              <FaLock />

              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* REGISTER BUTTON */}
          <button type="submit" className="auth-submit">
            <FaUserPlus />
            Create Account
          </button>

        </form>

        {/* LOGIN LINK */}
        <div className="auth-footer">
          <span>Already have an account?</span>

          <Link to="/login">
            Sign in
          </Link>
        </div>

      </div>

    </div>
  );
}

export default Register;