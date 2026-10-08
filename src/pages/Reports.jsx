import { useState, useEffect } from 'react';

function Reports() {
  const [salesData, setSalesData] = useState([]);
  const [editing, setEditing] = useState(null);
  const [editForm, setEditForm] = useState({ product:'', category:'', quantity:1, amount:0 });

  const load = () => {
    fetch('https://shop-manager-backend-production.up.railway.app/api/sales')
      .then(r=>r.json())
      .then(data=>{
        // map your sales to report format
        const mapped = data.map(s=>({
          id: s.id,
          date: s.date || new Date().toLocaleDateString(),
          product: s.product || 'Unknown',
          category: s.category || (s.product?.toLowerCase().includes('dress')||s.product?.toLowerCase().includes('cloth') ? 'Clothes' : 'Cosmetics'),
          quantity: s.quantity || 1,
          amount: s.amount || s.total || 0
        }));
        setSalesData(mapped);
      });
  };

  useEffect(()=>{load()},[]);

  // YOUR ORIGINAL CALCULATIONS - SAME
  // YOUR ORIGINAL CALCULATIONS - FIXED - CASE INSENSITIVE
const totalItems = salesData.reduce((sum, sale) => sum + Number(sale.quantity||0), 0);
const totalRevenue = salesData.reduce((sum, sale) => sum + Number(sale.amount||0), 0);
const cosmeticsSales = salesData.filter(s => s.category?.toLowerCase().includes('cosm')).reduce((sum, sale) => sum + Number(sale.amount||0), 0);
const totalClothesSales = salesData.filter(s => s.category?.toLowerCase().includes('cloth')).reduce((sum, sale) => sum + Number(sale.amount||0), 0);
const cosmeticsQty = salesData.filter(s => s.category?.toLowerCase().includes('cosm')).reduce((sum, sale) => sum + Number(sale.quantity||0), 0);
const clothesQty = salesData.filter(s => s.category?.toLowerCase().includes('cloth')).reduce((sum, sale) => sum + Number(sale.quantity||0), 0);

  // CRUD
  const handleDelete = async (id) => {
    if(!confirm('Delete this sale report?')) return;
    await fetch(`https://shop-manager-backend-production.up.railway.app/api/sales/${id}`, {method:'DELETE'});
    load();
  };

  const openEdit = (sale) => {
    setEditing(sale);
    setEditForm({product:sale.product, category:sale.category, quantity:sale.quantity, amount:sale.amount});
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    await fetch(`https://shop-manager-backend-production.up.railway.app/api/sales/${editing.id}`,{
      method:'PUT',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({...editForm, product:editForm.product, amount: parseInt(editForm.amount)})
    });
    setEditing(null);
    load();
  };

  return (
    <div className="reports-page">
      <div className="report-header">
        <div>
          <span className="page-label">REPORTS</span>
          <h1>Reports</h1>
          <p>View your business performance and sales reports.</p>
        </div>
        <button className="customer-add-btn" onClick={()=>window.print()}><i className="fa-solid fa-download"></i> Export Report</button>
      </div>

      {/* EDIT MODAL - WITH YOUR STYLE */}
      {editing && (
        <div style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000}}>
          <div style={{background:'#fff', borderRadius:'16px', padding:'24px', width:'400px'}}>
            <h3 style={{marginBottom:'15px'}}>Edit Sale Report</h3>
            <form onSubmit={handleUpdate} style={{display:'flex', flexDirection:'column', gap:'12px'}}>
              <input value={editForm.product} onChange={e=>setEditForm({...editForm, product:e.target.value})} placeholder="Product" style={{padding:'12px', border:'1px solid #e5e7eb', borderRadius:'8px'}} required />
              <select value={editForm.category} onChange={e=>setEditForm({...editForm, category:e.target.value})} style={{padding:'12px', border:'1px solid #e5e7eb', borderRadius:'8px'}}>
                <option>Clothes</option><option>Cosmetics</option>
              </select>
              <input type="number" value={editForm.quantity} onChange={e=>setEditForm({...editForm, quantity:e.target.value})} placeholder="Quantity" style={{padding:'12px', border:'1px solid #e5e7eb', borderRadius:'8px'}} required />
              <input type="number" value={editForm.amount} onChange={e=>setEditForm({...editForm, amount:e.target.value})} placeholder="Amount" style={{padding:'12px', border:'1px solid #e2e8f0', borderRadius:'8px'}} required />
              <div style={{display:'flex', gap:'10px'}}>
                <button type="submit" className="customer-add-btn">Update</button>
                <button type="button" onClick={()=>setEditing(null)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SUMMARY CARDS - YOUR ORIGINAL */}
      <div className="summary-cards">
        <div className="report-stat-card">
          <div className="report-icon"><i className="fa-solid fa-money-bill-wave"></i></div>
          <div className="report-stat-info"><span>Total Revenue</span><h3>TSh {totalRevenue.toLocaleString()}</h3></div>
        </div>
        <div className="report-stat-card">
          <div className="report-icon"><i className="fa-solid fa-chart-line"></i></div>
          <div className="report-stat-info"><span>Average Sale</span><h3>TSh {salesData.length ? (totalRevenue / salesData.length).toFixed(0) : 0}</h3></div>
        </div>
        <div className="report-stat-card">
          <div className="report-icon"><i className="fa-solid fa-box"></i></div>
          <div className="report-stat-info"><span>Total Items</span><h3>{totalItems}</h3></div>
        </div>
        <div className="report-stat-card">
          <div className="report-icon"><i className="fa-solid fa-receipt"></i></div>
          <div className="report-stat-info"><span>Transactions</span><h3>{salesData.length}</h3></div>
        </div>
      </div>

      {/* YOUR ORIGINAL GRID */}
      <div className="report-grid">
        <div className="report-panel">
          <div className="panel-header"><h3>Revenue by Category</h3></div>
          <div className="category-report">
            <div className="category-info"><span><span className="category-dot cosmetics"></span> Cosmetics</span><span>TSh {cosmeticsSales.toLocaleString()}</span></div>
            <div className="progress-container"><div className="progress-bar" style={{width:`${totalRevenue ? (cosmeticsSales/totalRevenue*100) : 0}%`, background:'#ec4899'}}></div></div>
            <div style={{fontSize:'12px', color:'#6b7280', marginTop:'4px'}}>{cosmeticsQty} items sold</div>
          </div>
          <div className="category-report">
            <div className="category-info"><span><span className="category-dot clothes"></span> Clothes</span><span>TSh {totalClothesSales.toLocaleString()}</span></div>
            <div className="progress-container"><div className="progress-bar" style={{width:`${totalRevenue ? (totalClothesSales/totalRevenue*100) : 0}%`, background:'#3b82f6'}}></div></div>
            <div style={{fontSize:'12px', color:'#6b7280', marginTop:'4px'}}>{clothesQty} items sold</div>
          </div>
        </div>

        <div className="report-panel">
          <div className="panel-header"><h3>Quick Insights</h3><p>Business summary</p></div>
          <div className="insight-list">
            <div className="insight-item"><div className="insight-icon"><i className="fa-solid fa-fire"></i></div><div><strong>Top Category</strong><p>{cosmeticsSales > totalClothesSales ? 'Cosmetics' : 'Clothes'} - {Math.max(cosmeticsSales, totalClothesSales).toLocaleString()} TSh generated</p></div></div>
            <div className="insight-item"><div className="insight-icon"><i className="fa-solid fa-box-open"></i></div><div><strong>Total Items Sold</strong><p>{totalItems} items sold</p></div></div>
            <div className="insight-item"><div className="insight-icon"><i className="fa-solid fa-layer-group"></i></div><div><strong>Revenue by Category</strong><p>Cosmetics {cosmeticsSales.toLocaleString()} | Clothes {totalClothesSales.toLocaleString()}</p></div></div>
          </div>
        </div>
      </div>

      {/* SALES TABLE - YOUR ORIGINAL + CRUD */}
      <div className="report-panel">
        <div className="report-table-header">
          <div><h3>Detailed Sales Report</h3><p>Recent sales transactions - REAL from backend</p></div>
          <span>{salesData.length} records</span>
        </div>
        <div className="table-wrapper">
          <table className="report-table">
            <thead><tr><th>Date</th><th>Product</th><th>Category</th><th>Quantity</th><th>Amount</th><th>Action</th></tr></thead>
            <tbody>
              {salesData.length===0 && <tr><td colSpan="6" style={{textAlign:'center', padding:'20px'}}>No sales yet - Add sales to see report!</td></tr>}
              {salesData.map(sale=>(
                <tr key={sale.id}>
                  <td>{sale.date}</td>
                  <td><strong>{sale.product}</strong></td>
                  <td><span className="report-category">{sale.category}</span></td>
                  <td>{sale.quantity}</td>
                  <td>TSh {sale.amount.toLocaleString()}</td>
                  <td>
                    <div style={{display:'flex', gap:'6px'}}>
                      <button onClick={()=>openEdit(sale)} title="Edit"><i className="fa-solid fa-pen"></i></button>
                      <button onClick={()=>handleDelete(sale.id)} title="Delete"><i className="fa-solid fa-trash"></i></button>
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
export default Reports;