import { useEffect, useState } from 'react';

function Dashboard() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalProducts: 0,
    totalCustomers: 0,
    totalSales: 0,
    recentSales: []
  });
  const [products, setProducts] = useState([]);
  const [showSale, setShowSale] = useState(false);
  const [form, setForm] = useState({ productId:'', category:'Clothes', quantity:1, amount:'', customer:'' });

  const loadStats = () => {
    fetch('https://shop-manager-backend-production.up.railway.app/api/dashboard')
     .then(res => res.json())
     .then(data => {
       console.log('DASHBOARD API:', data);
       setStats({
         totalRevenue: Number(data.totalRevenue||0),
         totalProducts: Number(data.totalProducts||0),
         totalCustomers: Number(data.totalCustomers||0),
         totalSales: Number(data.totalSales||0),
         recentSales: data.recentSales||[]
       });
     })
     .catch(err => console.log(err));
  };

  const loadProducts = () => {
    fetch('https://shop-manager-backend-production.up.railway.app/api/products')
     .then(res => res.json())
     .then(data => setProducts(Array.isArray(data)?data:[]))
     .catch(()=>{});
  };

  useEffect(() => {
    loadStats();
    loadProducts();
  }, []);

  const selectedProd = products.find(p=> p.id === form.productId);
  const getStock = () => selectedProd ? Number(selectedProd.stock||0) : 999;

  const handleSale = async (e) => {
    e.preventDefault();
    if(!form.productId){
      alert('Select product from dropdown!');
      return;
    }
    const stock = getStock();
    if(stock <= 0){
      alert(`OUT OF STOCK - ${selectedProd.name} has 0 left! Restock first.`);
      return;
    }
    if(Number(form.quantity) > stock){
      alert(`NOT ENOUGH STOCK - Only ${stock} left for ${selectedProd.name}`);
      return;
    }
    const res = await fetch('https://shop-manager-backend-production.up.railway.app/api/sales',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({
        productId: form.productId,
        category: form.category,
        quantity: Number(form.quantity),
        amount: Number(form.amount),
        customer: form.customer
      })
    });
    const data = await res.json();
    if(!res.ok){
      alert(data.error || 'Sale blocked');
      return;
    }
    setShowSale(false);
    setForm({ productId:'', category:'Clothes', quantity:1, amount:'', customer:'' });
    loadStats();
    loadProducts();
  };

  return (
    <div>
      <div className="page-title">
        <div>
          <h1>Dashboard</h1>
          <p>Look what's happening with your business today.</p>
        </div>
        <button className="primary-btn" onClick={()=>setShowSale(true)}>+ New Sale</button>
      </div>

      {showSale && (
        <div style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:999}} onClick={()=>setShowSale(false)}>
          <div style={{background:'#fff', padding:'24px', borderRadius:'16px', width:'90%', maxWidth:'420px'}} onClick={e=>e.stopPropagation()}>
            <h3 style={{margin:'0 0 16px 0'}}>New Sale</h3>
            <form onSubmit={handleSale} style={{display:'flex', flexDirection:'column', gap:'12px'}}>
              
              {/* FIXED: DROPDOWN NOT TEXT INPUT */}
              <select
                value={form.productId}
                onChange={e=>{
                  const prod = products.find(p=> p.id === e.target.value);
                  const qty = Number(form.quantity)||1;
                  setForm({...form, productId:e.target.value, amount: prod? prod.price*qty : '', category: prod?.category||'Clothes'});
                }}
                required
                style={{padding:'12px', borderRadius:'8px', border:'1px solid #ddd', fontWeight:'600'}}
              >
                <option value="">Select Product</option>
                {products.map(p=>(
                  <option key={p.id} value={p.id}>{p.name} - TSh {Number(p.price).toLocaleString()} (Stock {p.stock})</option>
                ))}
              </select>

              {selectedProd && (
                <small style={{color: getStock()<=0? 'red' : getStock()<5? 'orange' : 'green', fontWeight:'700'}}>
                  Stock: {getStock()} {getStock()<=0 && '- OUT OF STOCK!'}
                </small>
              )}

              <select value={form.category} onChange={e=>setForm({...form, category:e.target.value})} style={{padding:'10px', borderRadius:'8px', border:'1px solid #ddd'}}>
                <option value="Clothes">Clothes</option>
                <option value="Cosmetics">Cosmetics</option>
              </select>

              <input type="number" min="1" placeholder="Quantity" value={form.quantity} onChange={e=>{
                const qty = Number(e.target.value)||1;
                setForm({...form, quantity:e.target.value, amount: selectedProd? selectedProd.price*qty : form.amount});
              }} required style={{padding:'10px', borderRadius:'8px', border:'1px solid #ddd'}} />

              <input type="number" placeholder="Amount (auto)" value={form.amount} onChange={e=>setForm({...form, amount:e.target.value})} required style={{padding:'10px', borderRadius:'8px', border:'1px solid #ddd'}} />
              <input placeholder="Customer name" value={form.customer} onChange={e=>setForm({...form, customer:e.target.value})} style={{padding:'10px', borderRadius:'8px', border:'1px solid #ddd'}} />

              <button type="submit" className="primary-btn" style={{padding:'12px', opacity: selectedProd && getStock()<=0? 0.4 : 1}} disabled={selectedProd && getStock()<=0}>
                {selectedProd && getStock()<=0? 'Out of Stock' : 'Save Sale'}
              </button>
            </form>
          </div>
        </div>
      )}

      <section className="stats">
        <div className="stat-card">
          <div className="stat-icon blue">💰</div>
          <div>
            <p>Total Revenue</p>
            {/* FIXED: NOW totalRevenue NOT totalSales */}
            <h2>TSh. {Number(stats.totalRevenue||0).toLocaleString()}</h2>
            <span className="positive">↑ {stats.totalSales} orders this month</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon purple">📦</div>
          <div>
            <p>Total Products</p>
            <h2>{stats.totalProducts}</h2>
            <span className="positive">↑ {stats.totalProducts} total products</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon green">👥</div>
          <div>
            <p>Total Customers</p>
            <h2>{stats.totalCustomers}</h2>
            <span className="positive">↑ customers</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon orange">🛒</div>
          <div>
            <p>Total Orders</p>
            <h2>{stats.totalSales}</h2>
            <span className="warning">{stats.totalSales} total</span>
          </div>
        </div>
      </section>

      <section className="dashboard-grid">
        <div className="dashboard-card sales-card">
          <div className="card-header">
            <div>
              <h2>Sales Overview</h2>
              <p>Revenue for the last 7 days</p>
            </div>
            <select>
              <option>Last 7 days</option>
              <option>Last 30 days</option>
            </select>
          </div>
          <div className="chart">
            <div className="bar" style={{ height: "45%" }}></div>
            <div className="bar" style={{ height: "65%" }}></div>
            <div className="bar" style={{ height: "50%" }}></div>
            <div className="bar" style={{ height: "80%" }}></div>
            <div className="bar" style={{ height: "60%" }}></div>
            <div className="bar" style={{ height: "90%" }}></div>
            <div className="bar" style={{ height: "72%" }}></div>
          </div>
          <div className="chart-labels">
            <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-header">
            <div>
              <h2>Recent Sales</h2>
              <p>Latest transactions</p>
            </div>
            <a href="/sales">View all</a>
          </div>
          <div>
            {stats.recentSales.length === 0 && <p>No sales yet</p>}
            {stats.recentSales.map(s => (
              <div key={s.id} className="transaction">
                <div className="customer-avatar">{(s.customer||'W')?.charAt(0)?.toUpperCase()}</div>
                <div className="transaction-info">
                  <strong>{s.customer}</strong>
                  <small>{s.product || s.productId} - {s.quantity} pcs</small>
                </div>
                <b>TSh. {Number(s.amount||0).toLocaleString()}</b>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
export default Dashboard;