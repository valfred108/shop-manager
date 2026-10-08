import { useState, useEffect } from "react";

function Products() {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: "", category: "Clothes", price: "", stock: "10" });

  useEffect(() => {
    fetch("https://shop-manager-backend-production.up.railway.app/api/products")
      .then(res => res.json())
      .then(data => {
        const formatted = data.map(p => ({
          id: p.id,
          name: p.name,
          category: p.category,
          price: `TZS ${Number(p.price).toLocaleString()}`,
          rawPrice: Number(p.price),
          stock: Number(p.stock || 0),
          status: Number(p.stock) === 0 ? "Out of stock" : Number(p.stock) < 10 ? "Low Stock" : "In stock"
        }));
        setProducts(formatted);
      });
  }, []);

  const resetForm = () => {
    setForm({ name: "", category: "Clothes", price: "", stock: "10" });
    setEditingId(null);
    setShowAdd(false);
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.price) {
      alert("Name and Price required");
      return;
    }
    const payload = {
      name: form.name,
      category: form.category,
      price: Number(form.price),
      stock: Number(form.stock)
    };

    if (editingId) {
      const res = await fetch(`https://shop-manager-backend-production.up.railway.app/api/products/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const p = await res.json();
      const updated = {
        id: p.id,
        name: p.name,
        category: p.category,
        price: `TZS ${Number(p.price).toLocaleString()}`,
        rawPrice: Number(p.price),
        stock: Number(p.stock),
        status: Number(p.stock) === 0 ? "Out of stock" : Number(p.stock) < 10 ? "Low Stock" : "In stock"
      };
      setProducts(products.map(prod => prod.id === editingId ? updated : prod));
    } else {
      const res = await fetch("https://shop-manager-backend-production.up.railway.app/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const p = await res.json();
      const newFormatted = {
        id: p.id,
        name: p.name,
        category: p.category,
        price: `TZS ${Number(p.price).toLocaleString()}`,
        rawPrice: Number(p.price),
        stock: Number(p.stock),
        status: Number(p.stock) === 0 ? "Out of stock" : Number(p.stock) < 10 ? "Low Stock" : "In stock"
      };
      setProducts([...products, newFormatted]);
    }
    resetForm();
  };

  const handleEdit = (p) => {
    setEditingId(p.id);
    setForm({ name: p.name, category: p.category, price: String(p.rawPrice), stock: String(p.stock) });
    setShowAdd(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    await fetch(`https://shop-manager-backend-production.up.railway.app/api/products/${id}`, { method: "DELETE" });
    setProducts(products.filter(p => p.id !== id));
  };

  const filteredProducts = products.filter((product) =>
    `${product.name} ${product.category}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="products-page">
      <div className="products-header">
        <div>
          <span className="page-label">INVENTORY MANAGEMENT</span>
          <h1>Products</h1>
          <p>Manage your products, pricing and inventory.</p>
        </div>
        <button className="product-add-btn" onClick={() => { setEditingId(null); setForm({ name: "", category: "Clothes", price: "", stock: "10" }); setShowAdd(true); }}>
          <i className="fa-solid fa-plus"></i> Add Product
        </button>
      </div>

      <div className="product-stats">
        <div className="product-stat-card"><div className="product-stat-icon"><i className="fa-solid fa-box"></i></div><div><span>Total Products</span><h2>{products.length}</h2><small>Across all categories</small></div></div>
        <div className="product-stat-card"><div className="product-stat-icon"><i className="fa-solid fa-layer-group"></i></div><div><span>Categories</span><h2>{[...new Set(products.map(p => p.category))].length}</h2><small>Active</small></div></div>
        <div className="product-stat-card"><div className="product-stat-icon warning"><i className="fa-solid fa-triangle-exclamation"></i></div><div><span>Low Stock</span><h2>{products.filter(p => p.stock > 0 && p.stock < 10).length}</h2><small>Need attention</small></div></div>
        <div className="product-stat-card"><div className="product-stat-icon danger"><i className="fa-solid fa-circle-xmark"></i></div><div><span>Out of Stock</span><h2>{products.filter(p => p.stock === 0).length}</h2><small>Unavailable</small></div></div>
      </div>

      <div className="products-card">
        <div className="products-card-header">
          <div><h3>Product Inventory</h3><p>View and manage all products.</p></div>
          <div className="products-tools">
            <div className="product-search"><i className="fa-solid fa-magnifying-glass"></i><input type="text" placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} /></div>
          </div>
        </div>
        <div className="products-table-wrapper">
          <table className="products-table">
            <thead><tr><th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {filteredProducts.map((p) => (
                <tr key={p.id}><td>{p.name}</td><td>{p.category}</td><td>{p.price}</td><td>{p.stock}</td><td>{p.status}</td>
                  <td style={{display:'flex', gap:'8px'}}>
                    <button onClick={() => handleEdit(p)} style={{background: '#e3f2fd', color:'#1976d2' ,border:'none', padding:'6px 10px', borderRadius:'6px', cursor:'pointer', fontWeight:'bold'}}><i className="fa-solid fa-pen"></i>Edit</button>
                    <button onClick={() => handleDelete(p.id)} style={{background:'#ffebee', color:'#d32f2f', border:'none', padding:'6px 10px', borderRadius:'6px', cursor:'pointer', fontWeight:'bold', marginLeft:'6px'}}><i className="fa-solid fa-trash"> Del</i></button>
                  </td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showAdd && (
        <div style={{position:'fixed', top:0, left:0, right:0, bottom:0, background:'rgba(0,0,0,0.6)', display:'flex', justifyContent:'center', alignItems:'center', zIndex:1000}}>
          <div style={{background:'white', padding:'24px', borderRadius:'12px', width:'380px', display:'flex', flexDirection:'column', gap:'10px'}}>
            <h3 style={{fontWeight:'bold'}}>{editingId ? "Edit Product" : "Add New Product"}</h3>
            <input placeholder="Product Name" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} style={{border:'1px solid #ddd', padding:'10px', borderRadius:'6px'}} />
            <select value={form.category} onChange={e=>setForm({...form, category:e.target.value})} style={{border:'1px solid #ddd', padding:'10px', borderRadius:'6px'}}><option>Clothes</option><option>Cosmetics</option></select>
            <input placeholder="Price" type="number" value={form.price} onChange={e=>setForm({...form, price:e.target.value})} style={{border:'1px solid #ddd', padding:'10px', borderRadius:'6px'}} />
            <input placeholder="Stock" type="number" value={form.stock} onChange={e=>setForm({...form, stock:e.target.value})} style={{border:'1px solid #ddd', padding:'10px', borderRadius:'6px'}} />
            <div style={{display:'flex', gap:'10px', marginTop:'10px'}}>
              <button onClick={handleSave} className="product-add-btn" style={{flex:1, justifyContent:'center'}}>{editingId ? "Update" : "Save Product"}</button>
              <button onClick={resetForm} className="product-filter" style={{flex:1, justifyContent:'center'}}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default Products;