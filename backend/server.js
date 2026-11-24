import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
const SECRET = process.env.JWT_SECRET || "shop_secret_2026";

// ===== CONNECT TO MONGODB =====
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.log('❌ MongoDB Error:', err.message));

// ===== SCHEMAS (replaces CREATE TABLE) =====
const userSchema = new mongoose.Schema({
  id: String, name: String, email: String, password: String,
}, { timestamps: true });
const User = mongoose.model('User', userSchema);

const productSchema = new mongoose.Schema({
  id: String, name: String, price: { type: Number, default: 0 },
  stock: { type: Number, default: 0 }, category: { type: String, default: 'general' }
});
const Product = mongoose.model('Product', productSchema);

const customerSchema = new mongoose.Schema({
  id: String, name: String, email: { type: String, default: '' },
  phone: { type: String, default: '' }, joined: String
});
const Customer = mongoose.model('Customer', customerSchema);

const saleSchema = new mongoose.Schema({
  id: String, productId: String, quantity: { type: Number, default: 1 },
  customer: String, amount: { type: Number, default: 0 }, date: String
});
const Sale = mongoose.model('Sale', saleSchema);

console.log('✅ MongoDB Models Ready!');

// ================= REAL AUTH =================
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: "All fields required" });
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ error: "Email already exists" });
    const hashed = await bcrypt.hash(password, 10);
    const id = Date.now().toString();
    await User.create({ id, name, email, password: hashed });
    res.json({ message: "Registered successfully!" });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "User not found" });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: "Wrong password" });
    const token = jwt.sign({ id: user.id, email: user.email }, SECRET, { expiresIn: '1d' });
    res.json({ message: "Login success", token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ================= PRODUCTS =================
app.get('/api/products', async (req, res) => { res.json(await Product.find()); });
app.post('/api/products', async (req, res) => {
  const id = Date.now().toString();
  const { name, price, stock, category } = req.body;
  await Product.create({ id, name, price, stock: Number(stock || 0), category: category || 'general' });
  res.json({ id, name });
});
app.put('/api/products/:id', async (req, res) => {
  const { name, price, stock, category } = req.body;
  await Product.findOneAndUpdate({ id: req.params.id }, { name, price, stock, category });
  res.json({ success: true });
});
app.delete('/api/products/:id', async (req, res) => { await Product.deleteOne({ id: req.params.id }); res.json({ success: true }); });

// ================= CUSTOMERS =================
app.get('/api/customers', async (req, res) => {
  let customers = await Customer.find();
  const sales = await Sale.find();
  for (const s of sales) {
    const n = (s.customer || '').trim();
    if (!n || n.toLowerCase() === 'walk-in customer') continue;
    if (!customers.find(c => c.name.toLowerCase() === n.toLowerCase())) {
      const newId = n.toLowerCase().replace(/\s+/g, '_');
      await Customer.create({ id: newId, name: n, joined: s.date });
    }
  }
  customers = await Customer.find();
  const result = customers.map(c => {
    const cs = sales.filter(s => (s.customer || '').toLowerCase() === c.name.toLowerCase());
    const tot = cs.reduce((a, b) => a + Number(b.amount || 0), 0);
    return { ...c.toObject(), totalSpent: tot, orders: cs.length };
  });
  res.json(result);
});
app.post('/api/customers', async (req, res) => {
  const id = req.body.name.toLowerCase().replace(/\s+/g, '_');
  const { name, email, phone } = req.body;
  await Customer.create({ id, name, email: email || '', phone: phone || '', joined: new Date().toISOString().split('T')[0] });
  res.json({ id, name });
});
app.put('/api/customers/:id', async (req, res) => {
  const old = await Customer.findOne({ id: req.params.id });
  if (!old) return res.status(404).json({ error: 'Not found, reload page' });
  const oldName = old.name;
  const newName = req.body.name.trim();
  const newId = newName.toLowerCase().replace(/\s+/g, '_');
  await Customer.findOneAndUpdate({ id: req.params.id }, { id: newId, name: newName, email: req.body.email, phone: req.body.phone });
  await Sale.updateMany({ customer: oldName }, { customer: newName });
  res.json({ id: newId, name: newName });
});
app.delete('/api/customers/:id', async (req, res) => { await Customer.deleteOne({ id: req.params.id }); res.json({ success: true }); });

// ================= SALES =================
app.get('/api/sales', async (req, res) => { res.json(await Sale.find().sort({ date: -1 })); });
app.post('/api/sales', async (req, res) => {
  const { productId, quantity, customer, amount } = req.body;
  const qty = Number(quantity || 1);
  const prod = await Product.findOne({ id: productId });
  if (prod) {
    if (Number(prod.stock) <= 0) return res.status(400).json({ error: `${prod.name} has 0 stock` });
    if (Number(prod.stock) < qty) return res.status(400).json({ error: `Only ${prod.stock} left for ${prod.name}` });
    prod.stock -= qty;
    await prod.save();
  }
  const id = Date.now().toString();
  const today = new Date().toISOString().split('T')[0];
  const custName = customer || 'Walk-in Customer';
  await Sale.create({ id, productId, quantity: qty, customer: custName, amount: Number(amount || 0), date: today });
  if (custName.toLowerCase() !== 'walk-in customer') {
    const cid = custName.toLowerCase().replace(/\s+/g, '_');
    const ex = await Customer.findOne({ name: { $regex: new RegExp(`^${custName}$`, 'i') } });
    if (!ex) { await Customer.create({ id: cid, name: custName, joined: today }); }
  }
  res.json({ id });
});
app.delete('/api/sales/:id', async (req, res) => { await Sale.deleteOne({ id: req.params.id }); res.json({ success: true }); });

// ================= DASHBOARD =================
app.get('/api/dashboard', async (req, res) => {
  const sales = await Sale.find();
  const totalRevenue = sales.reduce((a, s) => a + Number(s.amount || 0), 0);
  const totalSales = sales.length;
  const totalProducts = await Product.countDocuments();
  const totalCustomers = await Customer.countDocuments();
  const lowStock = await Product.countDocuments({ stock: { $lte: 5 } });
  const recentSales = await Sale.find().sort({ date: -1 }).limit(5);
  res.json({ totalRevenue, totalSales, totalProducts, totalCustomers, lowStock, recentSales });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server runnning on port ${PORT}`));

export default app;