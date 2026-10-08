import { useState, useEffect } from 'react';

function Sales(){
  const [sales, setSales] = useState([]);
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ productId:'', category:'Clothes', quantity:1, amount:'', customer:'' });

  const load = async () => {
    try{
      const res = await fetch('https://shop-manager-backend-production.up.railway.app/api/sales');
      const data = await res.json();
      setSales(Array.isArray(data)? data: []);
      
      const pres = await fetch('https://shop-manager-backend-production.up.railway.app/api/products');
      const pdata = await pres.json();
      setProducts(Array.isArray(pdata)? pdata: []);
    }catch(e){
      console.log('Backend not running');
    }
  };

  useEffect(()=>{ load(); },[]);

  const getProductName = (sale) => {
    if(sale.product) return sale.product;
    const p = products.find(pr => pr.id === sale.productId || pr.id == sale.productId);
    return p ? p.name : sale.productId || 'Unknown';
  }

  const filtered = sales.filter(s=> getProductName(s).toLowerCase().includes(search.toLowerCase()));

  const handleAdd = async (e) => {
    e.preventDefault();
    if(!form.productId){ alert('Select product!'); return; }
    
    const selectedProd = products.find(p=> p.id === form.productId);
    const payload = {
      productId: form.productId,
      product: selectedProd?.name || form.productId,
      category: form.category,
      quantity: Number(form.quantity),
      amount: Number(form.amount),
      customer: form.customer
    };
    await fetch('https://shop-manager-backend-production.up.railway.app/api/sales',{
      method:'POST', 
      headers:{'Content-Type':'application/json'}, 
      body: JSON.stringify(payload)
    });
    setShowAdd(false); 
    setForm({productId:'', category:'Clothes', quantity:1, amount:'', customer:''}); 
    load();
  };

  const handleDelete = async (id) => { 
    if(!confirm('Delete this sale?')) return; 
    await fetch(`https://shop-manager-backend-production.up.railway.app/api/sales/${id}`,{method:'DELETE'}); 
    load(); 
  };
  
  const openEdit = (s) => { 
    setEditing(s); 
    setForm({
      productId: s.productId || products.find(p=>p.name === s.product)?.id || '',
      category: s.category || 'Clothes',
      quantity:s.quantity, 
      amount:s.amount, 
      customer:s.customer||''
    }); 
    setShowAdd(false); 
  };
  
  const handleUpdate = async (e) => { 
    e.preventDefault(); 
    await fetch(`https://shop-manager-backend-production.up.railway.app/api/sales/${editing.id}`,{
      method:'PUT', 
      headers:{'Content-Type':'application/json'}, 
      body: JSON.stringify({
        productId: form.productId,
        category: form.category,
        quantity:Number(form.quantity), 
        amount:Number(form.amount),
        customer: form.customer
      })
    }); 
    setEditing(null); 
    setForm({productId:'', category:'Clothes', quantity:1, amount:'', customer:''});
    load(); 
  };

  const totalRevenue = sales.reduce((sum,s)=> sum + Number(s.amount||0),0);
  const totalQty = sales.reduce((a,b)=> a + Number(b.quantity||0),0);

  return (
    <div className="sales-page">
      <div className="sales-header">
        <div>
          <span className="page-label">SALES MANAGEMENT</span>
          <h1>Sales</h1>
          <p>Track your sales and transactions.</p>
        </div>
        <button className="sales-add-btn" onClick={()=>{setShowAdd(true); setEditing(null); setForm({productId:'', category:'Clothes', quantity:1, amount:'', customer:''});}}>+ Add Sale</button>
      </div>

      {(showAdd || editing) && (
        <div className="sales-modal-overlay" onClick={()=>{setShowAdd(false); setEditing(null);}}>
          <div className="sales-modal" onClick={e=>e.stopPropagation()}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'18px'}}>
              <h3 style={{fontWeight:'800', fontSize:'18px', margin:0}}>{editing?'Edit Sale':'Add New Sale'}</h3>
              <button onClick={()=>{setShowAdd(false); setEditing(null);}} style={{border:'none', background:'#f1f5f9', width:'32px', height:'32px', borderRadius:'50%', cursor:'pointer', fontWeight:'700'}}>✕</button>
            </div>
            <form onSubmit={editing?handleUpdate:handleAdd} style={{display:'flex', flexDirection:'column', gap:'14px'}}>
              
              <select 
                value={form.productId} 
                onChange={e=>{
                  const prod = products.find(p=> p.id === e.target.value);
                  const qty = Number(form.quantity) || 1;
                  setForm({...form, productId:e.target.value, amount: prod? prod.price * qty : form.amount, category: prod?.category || form.category});
                }} 
                required 
                style={{padding:'14px', border:'1.5px solid #e2e8f0', borderRadius:'12px', fontSize:'14px', fontWeight:'600'}}
              >
                <option value="">Select Product from Workbench</option>
                {products.map(p=>(
                  <option key={p.id} value={p.id}>{p.name} - TSh {p.price} ({p.stock} left)</option>
                ))}
              </select>

              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px'}}>
                <select value={form.category} onChange={e=>setForm({...form, category:e.target.value})} style={{padding:'14px', border:'1.5px solid #e2e8f0', borderRadius:'12px', fontWeight:'600'}}>
                  <option value="Clothes">Clothes</option>
                  <option value="Cosmetics">Cosmetics</option>
                </select>
                <input type="number" min="1" placeholder="Qty" value={form.quantity} onChange={e=>{
                  const qty = Number(e.target.value) || 1;
                  const prod = products.find(p=> p.id === form.productId);
                  setForm({...form, quantity:e.target.value, amount: prod? prod.price * qty : form.amount});
                }} required style={{padding:'14px', border:'1.5px solid #e2e8f0', borderRadius:'12px'}} />
              </div>
              <input type="number" placeholder="Amount (auto)" value={form.amount} onChange={e=>setForm({...form, amount:e.target.value})} required style={{padding:'14px', border:'1.5px solid #e2e8f0', borderRadius:'12px'}} />
              <input placeholder="Customer name" value={form.customer} onChange={e=>setForm({...form, customer:e.target.value})} style={{padding:'14px', border:'1.5px solid #e2e8f0', borderRadius:'12px'}} />
              <div style={{display:'flex', gap:'10px', marginTop:'8px'}}>
                <button type="submit" className="sales-add-btn" style={{flex:1, padding:'14px', borderRadius:'12px', fontWeight:'800', cursor:'pointer'}}>{editing?'Update Sale':'Save Sale'}</button>
                <button type="button" onClick={()=>{setShowAdd(false); setEditing(null);}} style={{padding:'14px 20px', borderRadius:'12px', border:'1px solid #e5e7eb', background:'#fff', fontWeight:'600', cursor:'pointer'}}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="sales-stats">
        <div className="sales-stat-card"><div className="sales-icon">💰</div><div className="sales-stat-info"><span>TOTAL REVENUE</span><h3>TSh {totalRevenue.toLocaleString()}</h3></div></div>
        <div className="sales-stat-card"><div className="sales-icon">🧾</div><div className="sales-stat-info"><span>TOTAL SALES</span><h3>{sales.length}</h3></div></div>
        <div className="sales-stat-card"><div className="sales-icon">📦</div><div className="sales-stat-info"><span>ITEMS SOLD</span><h3>{totalQty}</h3></div></div>
        <div className="sales-stat-card"><div className="sales-icon">📈</div><div className="sales-stat-info"><span>AVG SALE</span><h3>TSh {sales.length? Math.round(totalRevenue/sales.length):0}</h3></div></div>
      </div>

      <div className="sales-card">
        <div className="sales-card-header">
          <div><h3>Sales List</h3><p>{sales.length} transactions - WORKBENCH CONNECTED</p></div>
          <div className="sales-search">🔍<input placeholder="Search product..." value={search} onChange={e=>setSearch(e.target.value)} style={{border:'none', background:'transparent', outline:'none', marginLeft:'6px', width:'160px'}} /></div>
        </div>
        <div className="sales-table-wrapper">
          <table className="sales-table">
            <thead><tr><th>Product</th><th>Category</th><th>Qty</th><th>Amount</th><th>Date</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              {filtered.length===0 && <tr><td colSpan="7" style={{textAlign:'center', padding:'30px', color:'#94a3b8'}}>No sales yet. Add product first, then sale!</td></tr>}
              {filtered.map(s=>(
                <tr key={s.id}>
                  <td style={{fontWeight:'700'}}>{getProductName(s)}</td>
                  <td><span style={{background: s.category?.toLowerCase().includes('cloth') ? '#dcfce7':'#fce7f3', color: s.category?.toLowerCase().includes('cloth') ? '#166534':'#be185d', padding:'4px 10px', borderRadius:'20px', fontSize:'12px', fontWeight:'700'}}>{s.category}</span></td>
                  <td>{s.quantity}</td>
                  <td style={{fontWeight:'800', color:'#0f3d2e'}}>TSh {Number(s.amount).toLocaleString()}</td>
                  <td>{s.date}</td>
                  <td><span className="sales-status status-completed">Completed</span></td>
                  <td>
                    <div className="sales-actions" style={{display:'flex', gap:'8px'}}>
                      <button onClick={()=>openEdit(s)} style={{width:'34px', height:'34px', borderRadius:'8px', border:'none', background:'#0f3d2e', color:'#e8d44d', cursor:'pointer', fontWeight:'700'}}>✎</button>
                      <button onClick={()=>handleDelete(s.id)} style={{width:'34px', height:'34px', borderRadius:'8px', border:'1px solid #fecaca', background:'#fff', color:'#ef4444', cursor:'pointer', fontWeight:'700'}}>✕</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
export default Sales;