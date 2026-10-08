import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { FaBox, FaUsers, FaShoppingCart, FaChartBar, FaCog, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa'

function Layout() {
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn")
    navigate("/login")
  }

  const closeMobile = () => setMobileOpen(false)

  return (
    <div className="app-layout" style={{display:'flex', minHeight:'100vh'}}>
      
      {/* MOBILE TOP BAR */}
      <div style={{
        display:'flex', position:'fixed', top:0, left:0, right:0, height:'60px',
        background:'black', color:'#D4AF37', alignItems:'center', 
        justifyContent:'space-between', padding:'0 16px', zIndex:1000
      }} className="mobile-topbar">
        <span style={{fontWeight:900, letterSpacing:'2px'}}>ALFRED STORE</span>
        <button onClick={()=>setMobileOpen(!mobileOpen)} style={{fontSize:'22px', background:'none', border:'none', color:'#D4AF37'}}>
          {mobileOpen ? <FaTimes/> : <FaBars/>}
        </button>
      </div>

      {/* SIDEBAR */}
      <aside className={`sidebar ${mobileOpen ? 'mobile-open' : ''}`} style={{
        width:'260px', background:'black', color:'white', padding:'20px',
        position:'fixed', top:0, left:0, bottom:0, zIndex:999,
        overflowY:'auto', transition:'transform 0.3s',
        paddingTop: mobileOpen ? '70px' : '20px'
      }}>
        <div className="sidebar-logo" style={{display:'flex', alignItems:'center', gap:'10px', marginBottom:'30px'}}>
          <div className="sidebar-logo-icon" style={{background:'#D4AF37', width:'40px', height:'40px', borderRadius:'10px', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900, color:'black'}}>A</div>
          <span style={{color:'#D4AF37', fontWeight:900, letterSpacing:'2px'}}>Alfred Store</span>
        </div>

        <div className="sidebar-nav">
          <p className="nav-title" style={{color:'#888', fontSize:'11px', letterSpacing:'2px', margin:'20px 0 10px'}}>MAIN</p>
          <NavLink to="/dashboard" onClick={closeMobile} className="nav-link"><FaBox/> <span>Dashboard</span></NavLink>
          <NavLink to="/products" onClick={closeMobile} className="nav-link"><FaBox/> <span>Products</span></NavLink>
          <NavLink to="/customers" onClick={closeMobile} className="nav-link"><FaUsers/> <span>Customers</span></NavLink>
          <NavLink to="/sales" onClick={closeMobile} className="nav-link"><FaShoppingCart/> <span>Sales</span></NavLink>
          <NavLink to="/reports" onClick={closeMobile} className="nav-link"><FaChartBar/> <span>Reports</span></NavLink>

          <p className="nav-title" style={{color:'#888', fontSize:'11px', letterSpacing:'2px', margin:'20px 0 10px'}}>MANAGEMENT</p>
          <NavLink to="/settings" onClick={closeMobile} className="nav-link"><FaCog/> <span>Settings</span></NavLink>
          <button className="logout-btn" onClick={handleLogout} style={{width:'100%', marginTop:'20px', background:'#D4AF37', color:'black', border:'none', padding:'12px', borderRadius:'10px', fontWeight:700, display:'flex', gap:'10px', alignItems:'center', justifyContent:'center'}}>
            <FaSignOutAlt/> <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* OVERLAY */}
      {mobileOpen && <div onClick={closeMobile} style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:998}}></div>}

      {/* MAIN CONTENT */}
      <main className="main-content" style={{flex:1, marginLeft:'260px', padding:'24px', paddingTop:'24px', background:'#FFF8E7', minHeight:'100vh'}}>
        <Outlet/>
      </main>

      {/* RESPONSIVE CSS */}
      <style>{`
        .nav-link { display:flex; gap:12px; align-items:center; padding:12px 16px; border-radius:10px; color:#ccc; text-decoration:none; margin-bottom:6px; }
        .nav-link.active, .nav-link:hover { background:#D4AF37; color:black; font-weight:700; }
        .mobile-topbar { display:none !important; }
        @media (max-width: 1024px) {
          .mobile-topbar { display:flex !important; }
          .sidebar { transform: translateX(-100%); }
          .sidebar.mobile-open { transform: translateX(0); padding-top:70px !important; }
          .main-content { margin-left:0 !important; padding-top:76px !important; }
        }
        @media (max-width: 640px) {
          .main-content { padding:12px !important; padding-top:72px !important; }
        }
      `}</style>
    </div>
  )
}

export default Layout;