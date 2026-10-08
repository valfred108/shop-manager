import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaBox,
  FaUsers,
  FaShoppingCart,
  FaCog,
  FaSignOutAlt,
  FaStore
} from "react-icons/fa";

function Layout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    navigate("/login");
  };

  return (
    <div className="app-layout">

      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon" style={{background: 'transparent', padding: 0}}>
            <img src="/logo.png" alt="Alfred Store" style={{width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover'}} />
          </div>  
          <div>
             <h2 style={{color: '#FFD700', letterSpacing: '1px'}}>ALFRED STORE</h2>
             <span>Business Management</span>
          </div>
        </div>      

        <nav className="sidebar-nav">

          <p className="nav-title">MAIN</p>

          <NavLink to="/dashboard" className="nav-link">
            <FaHome />
            <span>Dashboard</span>
          </NavLink>

          <NavLink to="/products" className="nav-link">
            <FaBox />
            <span>Products</span>
          </NavLink>

          <NavLink to="/customers" className="nav-link">
            <FaUsers />
            <span>Customers</span>
          </NavLink>

          <NavLink to="/sales" className="nav-link">
            <FaShoppingCart />
            <span>Sales</span>
          </NavLink>
          <NavLink to="/reports" className="nav-link">
            <FaShoppingCart />
            <span>Reports</span>
          </NavLink>


          <p className="nav-title">MANAGEMENT</p>

          <NavLink to="/settings" className="nav-link">
            <FaCog />
            <span>Settings</span>
          </NavLink>

        </nav>

        <button className="logout-btn" onClick={handleLogout}>
          <FaSignOutAlt />
          <span>Logout</span>
        </button>

      </aside>

      {/* MAIN CONTENT */}
      <main className="main-content">
        <Outlet />
      </main>

    </div>
  );
}

export default Layout;