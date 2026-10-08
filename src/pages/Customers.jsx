import { useEffect, useState } from 'react';

function Customers(){
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({name:'', email:'', phone:''});

  const load = () => {
    fetch('https://shop-manager-backend-production.up.railway.app/api/customers')
   .then(r=>r.json())
   .then(data=>{
        const sorted = data.sort((a,b)=> Number(b.totalSpent||b.total||0) - Number(a.totalSpent||a.total||0));
        setCustomers(sorted);
      });
  };
  useEffect(()=>{ load(); },[]);

  const handleDelete = async (id, name) => {
    if(!window.confirm(`DELETE "${name}"?`)) return;
    const res = await fetch(`https://shop-manager-backend-production.up.railway.app/api/customers/${id}`, {method:'DELETE'});
    if(res.ok) load();
  };

  const openEdit = (c) => {
    setEditing(c);
    setForm({name:c.name, email:c.email||'', phone:c.phone||''});
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    const res = await fetch(`https://shop-manager-backend-production.up.railway.app/api/customers/${editing.id}`, {
      method:'PUT',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify(form)
    });
    if(res.ok){
      setEditing(null);
      load();
    }
  };

  const filtered = customers.filter(c=> c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="customers-page">
      <div className="customers-header">
        <div>
          <span className="page-label">Customer Management</span>
          <h1>Customers</h1>
          <p>{customers.length} customers</p>
        </div>
      </div>

      <div className="customers-card">
        <div className="customers-card-header">
          <div><h3>All Customers</h3><p>Real revenue from sales</p></div>
          <div className="customer-search">
            <input placeholder="Search..." value={search} onChange={e=>setSearch(e.target.value)} />
          </div>
        </div>

        <div className="customers-table-wrapper">
          <table className="customers-table">
            <thead>
              <tr><th>Customer</th><th>Contact</th><th>Orders</th><th>Spent</th><th>STATUS</th><th>ACTION</th></tr>
            </thead>
            <tbody>
              {filtered.map(c=>(
                <tr key={c.id}>
                  <td>
                    <div className="customer-profile">
                      <div className="customer-avatar">{c.name.charAt(0).toUpperCase()}</div>
                      <div><strong>{c.name}</strong><small>{c.lastOrder}</small></div>
                    </div>
                  </td>
                  <td><div className="customer-contact"><span>{c.email||'No email'}</span><span>{c.phone||'No phone'}</span></div></td>
                  <td><span className="purchase-count">{c.orders}</span></td>
                  <td><span className="customer-money">Tsh.{Number(c.totalSpent||c.total||0).toLocaleString()}</span></td>
                  <td><span className="customer-status status-active"><span></span>Active</span></td>
                  <td>
                    <div className="customer-actions">
                      <button className="customer-action edit" onClick={()=>openEdit(c)}>✏️</button>
                      <button className="customer-action delete" onClick={()=>handleDelete(c.id, c.name)}>🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* EDIT MODAL - GOLDEN EMERALD LUXURY */}
      {editing && (
        <div style={{position:'fixed', inset:0, background:'rgba(15,46,35,0.6)', backdropFilter:'blur(6px)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:9999}} onClick={()=>setEditing(null)}>
          <div style={{background:'linear-gradient(180deg, #ffffff 0%, #fffef9 100%)', border:'1px solid rgba(212,175,55,0.3)', borderRadius:'22px', padding:'28px', width:'90%', maxWidth:'420px', boxShadow:'0 20px 60px rgba(15,46,35,0.25)'}} onClick={e=>e.stopPropagation()}>
            <h3 style={{margin:'0 0 6px 0', color:'#0f2e23', fontWeight:900, fontSize:'20px'}}>Edit Customer</h3>
            <p style={{margin:'0 0 18px 0', color:'#7a8c85', fontSize:'13px'}}>Update customer information</p>
            <form onSubmit={handleEdit} style={{display:'flex', flexDirection:'column', gap:'14px'}}>
              <input value={form.name} onChange={e=>setForm({...form, name:e.target.value})} placeholder="Customer name" required style={{padding:'12px 14px', borderRadius:'12px', border:'1.5px solid rgba(212,175,55,0.25)', background:'#fcfaf0', outline:'none'}} />
              <input value={form.email} onChange={e=>setForm({...form, email:e.target.value})} placeholder="Email" style={{padding:'12px 14px', borderRadius:'12px', border:'1.5px solid rgba(212,175,55,0.25)', background:'#fcfaf0', outline:'none'}} />
              <input value={form.phone} onChange={e=>setForm({...form, phone:e.target.value})} placeholder="Phone" style={{padding:'12px 14px', borderRadius:'12px', border:'1.5px solid rgba(212,175,55,0.25)', background:'#fcfaf0', outline:'none'}} />
              <div style={{display:'flex', gap:'10px', marginTop:'6px'}}>
                <button type="button" onClick={()=>setEditing(null)} style={{flex:1, padding:'12px', borderRadius:'12px', border:'1px solid #e2e8f0', background:'#fff', cursor:'pointer', fontWeight:700}}>Cancel</button>
                <button type="submit" className="customer-add-btn" style={{flex:1, justifyContent:'center'}}>Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
export default Customers;