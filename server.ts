import express, { Response, Request, NextFunction } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

dotenv.config();

export const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || '';
const JWT_SECRET = process.env.JWT_SECRET || 'MMB admin panel';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// --- EXTENDED REQUEST INTERFACE FOR JWT ---
export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email?: string;
    phone?: string;
    role?: string;
    name?: string;
  };
}

// --- JWT AUTHENTICATION MIDDLEWARES ---

// Strict: Requires Authorization: Bearer <JWT_TOKEN>
export function authenticateToken(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      error: 'Unauthorized: Access token missing',
      message: 'Please provide header Authorization: Bearer <JWT_TOKEN>'
    });
  }

  jwt.verify(token, JWT_SECRET, (err: any, decoded: any) => {
    if (err) {
      return res.status(403).json({
        error: 'Forbidden: Invalid or expired token',
        details: err.message
      });
    }
    req.user = decoded;
    next();
  });
}

// Optional: Decodes Authorization: Bearer <JWT_TOKEN> if provided, does not block if missing
export function optionalAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token) {
    jwt.verify(token, JWT_SECRET, (err: any, decoded: any) => {
      if (!err && decoded) {
        req.user = decoded;
      }
      next();
    });
  } else {
    next();
  }
}

// --- FLEXIBLE MONGOOSE SCHEMAS & MODELS (strict: false to accept all user model fields) ---
const UserSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String },
  email: { type: String, sparse: true, index: true },
  phone: { type: String, sparse: true, index: true },
  password: { type: String },
  role: { type: String, default: 'buyer' },
  shopName: { type: String },
  city: { type: String },
  area: { type: String },
  status: { type: String, default: 'active' }
}, { timestamps: true, strict: false });

const ProductSchema = new mongoose.Schema({
  id: { type: String, unique: true, sparse: true },
  name: { type: String },
  title: { type: String },
  category: { type: String },
  price: { type: Number },
  status: { type: String, default: 'approved' }
}, { timestamps: true, strict: false });

const BannerItemSchema = new mongoose.Schema({
  id: { type: String, unique: true, sparse: true },
  title: { type: String },
  imageUrl: { type: String },
  active: { type: Boolean, default: true },
  order: { type: Number, default: 0 }
}, { timestamps: true, strict: false });

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  order: { type: Number, default: 0 },
  active: { type: Boolean, default: true }
}, { timestamps: true, strict: false });

const CartItemSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  productId: { type: String, required: true },
  quantity: { type: Number, default: 1 }
}, { timestamps: true, strict: false });

CartItemSchema.index({ userId: 1, productId: 1 }, { unique: true });

const FavoriteSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  productId: { type: String, required: true, index: true }
}, { timestamps: true, strict: false });

FavoriteSchema.index({ userId: 1, productId: 1 }, { unique: true });

const EnquirySchema = new mongoose.Schema({
  id: { type: String, unique: true, sparse: true },
  buyerId: { type: String, index: true },
  productId: { type: String },
  status: { type: String, default: 'new' }
}, { timestamps: true, strict: false });

const OrderSchema = new mongoose.Schema({
  id: { type: String, unique: true, sparse: true },
  customerName: { type: String },
  items: { type: Array, default: [] },
  totalAmount: { type: Number, default: 0 },
  orderStatus: { type: String, default: 'Processing' }
}, { timestamps: true, strict: false });

export const User = mongoose.models.User || mongoose.model('User', UserSchema);
export const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);
export const Banner = mongoose.models.Banner || mongoose.model('Banner', BannerItemSchema);
export const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);
export const CartItem = mongoose.models.CartItem || mongoose.model('CartItem', CartItemSchema);
export const Favorite = mongoose.models.Favorite || mongoose.model('Favorite', FavoriteSchema);
export const Enquiry = mongoose.models.Enquiry || mongoose.model('Enquiry', EnquirySchema);
export const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema);

// --- SSE (SERVER-SENT EVENTS) REAL-TIME BROADCAST SYSTEM ---
const sseClients: { [channel: string]: Response[] } = {
  products: [],
  banners: [],
  categories: [],
  cart: [],
  favorites: [],
  enquiries: []
};

function broadcast(channel: string, data: any) {
  const clients = sseClients[channel] || [];
  const payload = `data: ${JSON.stringify(data)}\n\n`;
  clients.forEach((res) => {
    try {
      res.write(payload);
    } catch {
      // client disconnected
    }
  });
}

function registerSse(channel: string, res: Response) {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });
  res.write('\n');
  if (!sseClients[channel]) sseClients[channel] = [];
  sseClients[channel].push(res);

  res.on('close', () => {
    sseClients[channel] = sseClients[channel].filter((c) => c !== res);
  });
}

// Database connection helper (caches connection for serverless / Vercel)
export async function connectDB() {
  if (mongoose.connection.readyState >= 1) return;
  if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI is not defined in environment variables!');
    return;
  }
  await mongoose.connect(MONGODB_URI);
}

// Connect before handling API requests in serverless environments
app.use(async (req, res, next) => {
  try {
    await connectDB();
  } catch (err: any) {
    console.error('MongoDB connection error:', err.message);
  }
  next();
});

// --- HEALTH & STATUS ENDPOINT ---
app.get('/api/health', async (req, res) => {
  const isConnected = mongoose.connection.readyState === 1;
  const counts = isConnected ? {
    products: await Product.countDocuments(),
    orders: await Order.countDocuments(),
    banners: await Banner.countDocuments(),
    categories: await Category.countDocuments(),
    users: await User.countDocuments()
  } : {};

  res.json({
    status: 'ok',
    database: isConnected ? 'connected' : 'disconnected',
    readyState: mongoose.connection.readyState,
    dbName: mongoose.connection.name || 'mmb_bazaar',
    host: mongoose.connection.host || 'Atlas Cluster',
    dataCounts: counts,
    timestamp: new Date().toISOString()
  });
});

// --- CLEAR ALL DATA ENDPOINT ---
app.post('/api/clear-all', async (req, res) => {
  try {
    await Product.deleteMany({});
    await Order.deleteMany({});
    await Banner.deleteMany({});
    await Category.deleteMany({});
    await CartItem.deleteMany({});
    await Favorite.deleteMany({});
    await Enquiry.deleteMany({});

    broadcast('products', []);
    broadcast('banners', []);
    broadcast('categories', []);

    res.json({
      success: true,
      message: 'All collections have been completely cleared. Database is empty and ready for new data.'
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to clear data', details: error.message });
  }
});

// ==========================================
// AUTHENTICATION & JWT ENDPOINTS
// ==========================================

app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, phone, password, role = 'buyer', shopName, city, area, ...extra } = req.body;
    if (!name || !password) {
      return res.status(400).json({ error: 'Name and password are required' });
    }

    if (email) {
      const existingEmail = await User.findOne({ email });
      if (existingEmail) return res.status(400).json({ error: 'Email already registered' });
    }

    if (phone) {
      const existingPhone = await User.findOne({ phone });
      if (existingPhone) return res.status(400).json({ error: 'Phone already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = req.body.id || 'usr-' + Date.now().toString(36);

    const user = await User.create({
      id: userId,
      name,
      email,
      phone,
      password: hashedPassword,
      role,
      shopName,
      city,
      area,
      ...extra
    });

    const token = jwt.sign(
      { userId: user.id, email: user.email, phone: user.phone, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN as any }
    );

    res.status(201).json({
      success: true,
      token,
      user
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Registration failed', details: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { emailOrPhone, email, phone, password } = req.body;
    const queryTerm = emailOrPhone || email || phone;

    if (!queryTerm || !password) {
      return res.status(400).json({ error: 'Email/Phone and password are required' });
    }

    const user = await User.findOne({
      $or: [{ email: queryTerm }, { phone: queryTerm }]
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, phone: user.phone, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN as any }
    );

    res.json({
      success: true,
      token,
      user
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Login failed', details: error.message });
  }
});

app.get('/api/auth/me', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.userId;
    const user = await User.findOne({ id: userId }).select('-password').lean();
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch user profile', details: error.message });
  }
});

// ==========================================
// 1. CATALOG REPOSITORY & PROVIDER API
// Supports single or bulk posting
// ==========================================

// Stream of Approved Products (SSE)
app.get('/api/catalog/products/stream', async (req, res) => {
  registerSse('products', res);
  const products = await Product.find({ status: { $ne: 'rejected' } }).lean();
  res.write(`data: ${JSON.stringify(products)}\n\n`);
});

// GET Approved Products
app.get('/api/catalog/products', async (req, res) => {
  try {
    const products = await Product.find({ status: { $ne: 'rejected' } }).lean();
    res.json(products);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch approved products', details: error.message });
  }
});

// Stream of Banners (SSE)
app.get('/api/catalog/banners/stream', async (req, res) => {
  registerSse('banners', res);
  const banners = await Banner.find({ active: { $ne: false } }).sort({ order: 1 }).lean();
  res.write(`data: ${JSON.stringify(banners)}\n\n`);
});

// GET Banners
app.get('/api/catalog/banners', async (req, res) => {
  try {
    const banners = await Banner.find({ active: { $ne: false } }).sort({ order: 1 }).lean();
    res.json(banners);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch banners', details: error.message });
  }
});

// POST Banners (single or batch)
app.post('/api/catalog/banners', optionalAuth, async (req, res) => {
  try {
    const data = req.body;
    let result;
    if (Array.isArray(data)) {
      result = await Banner.insertMany(data);
    } else {
      if (!data.id) data.id = 'banner-' + Date.now();
      result = await Banner.create(data);
    }
    const allBanners = await Banner.find({ active: { $ne: false } }).sort({ order: 1 }).lean();
    broadcast('banners', allBanners);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({ error: 'Failed to save banner(s)', details: error.message });
  }
});

// Stream of Categories (SSE)
app.get('/api/catalog/categories/stream', async (req, res) => {
  registerSse('categories', res);
  const categories = await Category.find({ active: { $ne: false } }).sort({ order: 1 }).lean();
  const categoryNames = categories.map((c) => c.name);
  res.write(`data: ${JSON.stringify(categoryNames)}\n\n`);
});

// GET Categories
app.get('/api/catalog/categories', async (req, res) => {
  try {
    const categories = await Category.find({ active: { $ne: false } }).sort({ order: 1 }).lean();
    const categoryNames = categories.map((c) => c.name);
    res.json(categoryNames);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch categories', details: error.message });
  }
});

// POST Categories (single or batch)
app.post('/api/catalog/categories', optionalAuth, async (req, res) => {
  try {
    const data = req.body;
    let result;
    if (Array.isArray(data)) {
      const docs = data.map((item, idx) =>
        typeof item === 'string'
          ? { name: item, order: idx, active: true }
          : { active: true, order: idx, ...item }
      );
      result = await Category.insertMany(docs);
    } else if (typeof data === 'string') {
      result = await Category.create({ name: data, active: true });
    } else {
      result = await Category.create(data);
    }
    const allCategories = await Category.find({ active: { $ne: false } }).sort({ order: 1 }).lean();
    broadcast('categories', allCategories.map((c) => c.name));
    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({ error: 'Failed to save categories', details: error.message });
  }
});

// Products: General CRUD & Batch Posting
app.get('/api/products', async (req, res) => {
  try {
    const filter: any = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.category && req.query.category !== 'ALL') filter.category = req.query.category;
    const products = await Product.find(filter).lean();
    res.json(products);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch products', details: error.message });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findOne({ id: req.params.id }).lean();
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch product', details: error.message });
  }
});

// POST Products (accepts single product OR array of products for easy posting!)
app.post('/api/products', optionalAuth, async (req: AuthRequest, res) => {
  try {
    const data = req.body;
    let result;
    if (Array.isArray(data)) {
      const enriched = data.map((p, idx) => ({
        id: p.id || 'prod-' + Date.now() + '-' + idx,
        status: p.status || 'approved',
        ...p
      }));
      result = await Product.insertMany(enriched);
    } else {
      if (!data.id) data.id = 'prod-' + Date.now();
      if (!data.status) data.status = 'approved';
      result = await Product.create(data);
    }
    broadcast('products', await Product.find().lean());
    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({ error: 'Failed to create product(s)', details: error.message });
  }
});

app.put('/api/products/:id', optionalAuth, async (req: AuthRequest, res) => {
  try {
    const updated = await Product.findOneAndUpdate(
      { id: req.params.id },
      { $set: req.body },
      { new: true, upsert: true }
    );
    broadcast('products', await Product.find().lean());
    res.json(updated);
  } catch (error: any) {
    res.status(400).json({ error: 'Failed to update product', details: error.message });
  }
});

app.delete('/api/products/:id', optionalAuth, async (req: AuthRequest, res) => {
  try {
    const deleted = await Product.findOneAndDelete({ id: req.params.id });
    if (!deleted) return res.status(404).json({ error: 'Product not found' });
    broadcast('products', await Product.find().lean());
    res.json({ success: true, message: 'Product deleted', id: req.params.id });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to delete product', details: error.message });
  }
});

// ==========================================
// 2. CART REPOSITORY & PROVIDER API
// ==========================================

app.get('/api/cart/stream', optionalAuth, async (req: AuthRequest, res) => {
  const userId = req.user?.userId || (req.query.userId as string) || 'default-user';
  registerSse(`cart-${userId}`, res);
  const items = await CartItem.find({ userId }).lean();
  res.write(`data: ${JSON.stringify(items)}\n\n`);
});

app.get('/api/cart', optionalAuth, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.userId || (req.query.userId as string) || 'default-user';
    const items = await CartItem.find({ userId }).lean();
    res.json(items);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch cart', details: error.message });
  }
});

app.post('/api/cart', optionalAuth, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.userId || req.body.userId || 'default-user';
    const { productId, quantity = 1, ...rest } = req.body;
    if (!productId) return res.status(400).json({ error: 'productId is required' });

    const item = await CartItem.findOneAndUpdate(
      { userId, productId },
      { $set: rest, $inc: { quantity } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    const allItems = await CartItem.find({ userId }).lean();
    broadcast(`cart-${userId}`, allItems);
    res.status(200).json(item);
  } catch (error: any) {
    res.status(400).json({ error: 'Failed to update cart', details: error.message });
  }
});

app.put('/api/cart/qty', optionalAuth, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.userId || req.body.userId || 'default-user';
    const { productId, quantity } = req.body;
    if (!productId || quantity === undefined) {
      return res.status(400).json({ error: 'productId and quantity are required' });
    }

    if (quantity <= 0) {
      await CartItem.findOneAndDelete({ userId, productId });
    } else {
      await CartItem.findOneAndUpdate(
        { userId, productId },
        { $set: { quantity } },
        { new: true }
      );
    }

    const allItems = await CartItem.find({ userId }).lean();
    broadcast(`cart-${userId}`, allItems);
    res.json({ success: true, items: allItems });
  } catch (error: any) {
    res.status(400).json({ error: 'Failed to update quantity', details: error.message });
  }
});

app.delete('/api/cart/:productId', optionalAuth, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.userId || (req.query.userId as string) || 'default-user';
    await CartItem.findOneAndDelete({ userId, productId: req.params.productId });
    const allItems = await CartItem.find({ userId }).lean();
    broadcast(`cart-${userId}`, allItems);
    res.json({ success: true, items: allItems });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to remove cart item', details: error.message });
  }
});

app.delete('/api/cart', optionalAuth, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.userId || (req.query.userId as string) || 'default-user';
    await CartItem.deleteMany({ userId });
    broadcast(`cart-${userId}`, []);
    res.json({ success: true, message: 'Cart cleared' });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to clear cart', details: error.message });
  }
});

// ==========================================
// 3. FAVORITES REPOSITORY & PROVIDER API
// ==========================================

app.get('/api/favorites/stream', optionalAuth, async (req: AuthRequest, res) => {
  const userId = req.user?.userId || (req.query.userId as string) || 'default-user';
  registerSse(`favorites-${userId}`, res);
  const favs = await Favorite.find({ userId }).lean();
  const ids = favs.map((f) => f.productId);
  res.write(`data: ${JSON.stringify(ids)}\n\n`);
});

app.get('/api/favorites', optionalAuth, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.userId || (req.query.userId as string) || 'default-user';
    const favs = await Favorite.find({ userId }).lean();
    const favoriteIds = favs.map((f) => f.productId);
    res.json({ favoriteIds });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch favorites', details: error.message });
  }
});

app.post('/api/favorites/toggle', optionalAuth, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.userId || req.body.userId || 'default-user';
    const { productId } = req.body;
    if (!productId) return res.status(400).json({ error: 'productId is required' });

    const existing = await Favorite.findOne({ userId, productId });
    let isFavorite = false;

    if (existing) {
      await Favorite.deleteOne({ _id: existing._id });
      isFavorite = false;
    } else {
      await Favorite.create({ userId, productId });
      isFavorite = true;
    }

    const allFavs = await Favorite.find({ userId }).lean();
    const favoriteIds = allFavs.map((f) => f.productId);
    broadcast(`favorites-${userId}`, favoriteIds);

    res.json({ success: true, isFavorite, favoriteIds });
  } catch (error: any) {
    res.status(400).json({ error: 'Failed to toggle favorite', details: error.message });
  }
});

// ==========================================
// 4. ENQUIRY REPOSITORY & PROVIDER API
// ==========================================

app.get('/api/enquiries/stream', optionalAuth, async (req: AuthRequest, res) => {
  const buyerId = req.user?.userId || (req.query.buyerId as string) || 'default-user';
  registerSse(`enquiries-${buyerId}`, res);
  const enquiries = await Enquiry.find({ buyerId }).sort({ createdAt: -1 }).lean();
  res.write(`data: ${JSON.stringify(enquiries)}\n\n`);
});

app.get('/api/enquiries', optionalAuth, async (req: AuthRequest, res) => {
  try {
    const buyerId = req.user?.userId || (req.query.buyerId as string);
    const filter: any = {};
    if (buyerId) filter.buyerId = buyerId;
    const enquiries = await Enquiry.find(filter).sort({ createdAt: -1 }).lean();
    res.json(enquiries);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch enquiries', details: error.message });
  }
});

app.post('/api/enquiries', optionalAuth, async (req: AuthRequest, res) => {
  try {
    const data = req.body;
    if (!data.id) data.id = 'ENQ-' + Date.now().toString(36).toUpperCase();
    if (!data.buyerId) data.buyerId = req.user?.userId || 'default-user';
    if (req.user?.name && !data.buyerName) data.buyerName = req.user.name;

    const enquiry = await Enquiry.create(data);
    const buyerEnquiries = await Enquiry.find({ buyerId: data.buyerId }).sort({ createdAt: -1 }).lean();
    broadcast(`enquiries-${data.buyerId}`, buyerEnquiries);

    res.status(201).json(enquiry);
  } catch (error: any) {
    res.status(400).json({ error: 'Failed to create enquiry', details: error.message });
  }
});

app.patch('/api/enquiries/:id', optionalAuth, async (req: AuthRequest, res) => {
  try {
    const updated = await Enquiry.findOneAndUpdate(
      { id: req.params.id },
      { $set: req.body },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: 'Enquiry not found' });

    const buyerEnquiries = await Enquiry.find({ buyerId: updated.buyerId }).sort({ createdAt: -1 }).lean();
    broadcast(`enquiries-${updated.buyerId}`, buyerEnquiries);

    res.json(updated);
  } catch (error: any) {
    res.status(400).json({ error: 'Failed to update enquiry', details: error.message });
  }
});

// ==========================================
// 5. ORDERS & STORE MANAGEMENT API
// ==========================================
app.get('/api/orders', optionalAuth, async (req: AuthRequest, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).lean();
    res.json(orders);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch orders', details: error.message });
  }
});

app.post('/api/orders', optionalAuth, async (req: AuthRequest, res) => {
  try {
    const data = req.body;
    let result;
    if (Array.isArray(data)) {
      result = await Order.insertMany(data);
    } else {
      if (!data.id) data.id = `ORD-${Date.now().toString().slice(-4)}`;
      result = await Order.create(data);
    }
    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({ error: 'Failed to create order', details: error.message });
  }
});

app.patch('/api/orders/:id/status', optionalAuth, async (req: AuthRequest, res) => {
  try {
    const order = await Order.findOneAndUpdate(
      { id: req.params.id },
      { $set: req.body },
      { new: true }
    );
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (error: any) {
    res.status(400).json({ error: 'Failed to update order status', details: error.message });
  }
});

// --- CONNECT TO MONGODB & START SERVER (When run directly via node/tsx) ---
async function startServer() {
  if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI is not defined in .env file!');
    process.exit(1);
  }

  try {
    console.log('⏳ Connecting to MongoDB Atlas...');
    await mongoose.connect(MONGODB_URI);
    console.log(`🚀 MongoDB Atlas Connected! Database: ${mongoose.connection.name}`);
    console.log('✨ Auto-seeding disabled. Ready to receive custom models and data.');

    app.listen(Number(PORT), '0.0.0.0', () => {
      console.log(`🌐 MMB Express Backend running on http://localhost:${PORT}`);
      console.log(`📡 Health: http://localhost:${PORT}/api/health`);
      console.log(`🔐 Auth: http://localhost:${PORT}/api/auth/login`);
      console.log(`🛍️ Products: http://localhost:${PORT}/api/products`);
      console.log(`🖼️ Banners: http://localhost:${PORT}/api/catalog/banners`);
      console.log(`📂 Categories: http://localhost:${PORT}/api/catalog/categories`);
      console.log(`🛒 Cart: http://localhost:${PORT}/api/cart`);
      console.log(`❤️ Favorites: http://localhost:${PORT}/api/favorites`);
      console.log(`💬 Enquiries: http://localhost:${PORT}/api/enquiries`);
      console.log(`📑 Orders: http://localhost:${PORT}/api/orders`);
    });
  } catch (err: any) {
    console.error('❌ MongoDB Connection Error:', err.message);
  }
}

// Only start standalone server if executed directly (not in Vercel serverless)
if (process.env.VERCEL !== '1') {
  startServer();
}

export default app;
