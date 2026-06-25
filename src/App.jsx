import React, { useState, useEffect, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, Navigate, useParams, useSearchParams } from 'react-router-dom';
import { ShoppingCart, User, Search, Heart, Trash2, ShieldCheck, Truck, Headphones, Star, CheckCircle, MessageSquare, Globe, Menu, X, ChevronRight, Award, Clock, TrendingUp, Package, Users, Mail, Phone, MapPin, CreditCard, MapPinned } from 'lucide-react';
import { AuthContext, AuthProvider } from './context/AuthContext';
import { CartContext, CartProvider } from './context/CartContext';

// --- Custom Logo Component ---
const Logo = ({ size = 'md' }) => {
  const sizes = { sm: 'w-8 h-8', md: 'w-10 h-10', lg: 'w-12 h-12' };
  const textSizes = { sm: 'text-lg', md: 'text-xl', lg: 'text-2xl' };
  return (
    <Link to="/" className="flex items-center gap-2 group">
      <div className={`${sizes[size]} bg-gradient-to-br from-primary to-blue-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:shadow-blue-500/50 transition-all duration-300 group-hover:scale-110`}>
        <svg viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
      </div>
      <span className={`${textSizes[size]} font-black tracking-tight text-gray-900`}>Global<span className="text-primary">Trade</span></span>
    </Link>
  );
};

// --- Announcement Slider ---
const AnnouncementSlider = () => {
  const announcements = [
    { text: "🔥 FLASH SALE: 30% OFF on all Electronics! Use code: TECH30", color: "from-red-500 to-orange-500" },
    { text: "🚚 FREE SHIPPING on orders over $500 worldwide!", color: "from-blue-500 to-cyan-500" },
    { text: "⭐ NEW ARRIVALS: Premium Men's Fashion Collection", color: "from-purple-500 to-pink-500" },
    { text: "💎 EXCLUSIVE DEAL: Buy 100+ items get 15% bulk discount", color: "from-green-500 to-teal-500" },
    { text: "🎁 HOLIDAY SPECIAL: Extra 20% OFF on Machinery orders", color: "from-indigo-500 to-blue-500" },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % announcements.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`bg-gradient-to-r ${announcements[currentIndex].color} text-white py-2 px-4 text-center text-sm font-semibold transition-all duration-500 relative overflow-hidden`}>
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
        <span className="animate-fade-in">{announcements[currentIndex].text}</span>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
        <div 
          className="h-full bg-white transition-all duration-[4000ms] ease-linear"
          style={{ width: '100%', animation: 'shrink 4s linear infinite' }}
        ></div>
      </div>
    </div>
  );
};

// --- Navbar ---
const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { cartCount } = useContext(CartContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  return (
    <>
      <AnnouncementSlider />
      <header className="bg-white shadow-lg sticky top-0 z-50">
        {/* Top Bar */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 text-white">
          <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between text-xs">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> +1 (555) 123-4567</span>
              <span className="hidden md:flex items-center gap-1"><Mail className="w-3 h-3" /> support@globaltrade.com</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="hidden md:flex items-center gap-1"><Truck className="w-3 h-3" /> Free Shipping Over $500</span>
              <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> Secure Payment</span>
            </div>
          </div>
        </div>

        {/* Main Header */}
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <Logo />
        
        <form onSubmit={handleSearch} className="flex-1 max-w-xl mx-4 relative hidden md:block">
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products, suppliers..." 
            className="w-full pl-4 pr-12 py-3 border-2 border-gray-200 rounded-full focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all bg-gray-50 focus:bg-white shadow-sm" 
          />
          <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-gradient-to-r from-primary to-blue-600 text-white rounded-full hover:shadow-lg transition-all">
            <Search className="w-4 h-4" />
          </button>
        </form>

        <div className="flex items-center gap-3">
          <Link to="/cart" className="relative text-gray-700 hover:text-primary transition-colors p-2 hover:bg-blue-50 rounded-full">
            <ShoppingCart className="w-6 h-6" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center animate-pulse shadow-lg">{cartCount}</span>
            )}
          </Link>
          
          {user ? (
            <div className="hidden md:flex items-center gap-3">
              {user.role === 'admin' && <Link to="/admin" className="text-sm font-bold text-primary hover:text-primary-dark transition-colors bg-blue-50 px-3 py-1.5 rounded-full">Admin</Link>}
              <span className="text-sm font-semibold text-gray-700">Hi, {user.name}</span>
              <button onClick={logout} className="text-sm text-white font-semibold bg-gradient-to-r from-red-500 to-pink-500 px-4 py-2 rounded-full hover:shadow-lg transition-all">Logout</button>
            </div>
          ) : (
            <Link to="/login" className="hidden md:flex items-center gap-2 text-white font-semibold transition-all bg-gradient-to-r from-primary to-blue-600 px-5 py-2.5 rounded-full hover:shadow-lg hover:scale-105">
              <User className="w-4 h-4" /> Sign In
            </Link>
          )}

          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 text-gray-700 hover:bg-blue-50 rounded-full">
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 p-4 space-y-4 animate-slide-up">
          <form onSubmit={handleSearch} className="relative">
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search..." className="w-full pl-4 pr-12 py-2.5 border border-gray-200 rounded-xl" />
            <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-primary text-white rounded-lg"><Search className="w-4 h-4" /></button>
          </form>
          <nav className="flex flex-col gap-2">
            <Link to="/" onClick={() => setMobileMenuOpen(false)} className="px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">Home</Link>
            <Link to="/products" onClick={() => setMobileMenuOpen(false)} className="px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">Products</Link>
            <Link to="/cart" onClick={() => setMobileMenuOpen(false)} className="px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">Cart</Link>
            {user ? (
              <>
                {user.role === 'admin' && <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="px-4 py-2 text-primary font-bold hover:bg-gray-50 rounded-lg">Admin Panel</Link>}
                <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="px-4 py-2 text-red-500 hover:bg-gray-50 rounded-lg text-left">Logout</button>
              </>
            ) : (
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="px-4 py-2 bg-primary text-white rounded-lg text-center font-bold">Sign In</Link>
            )}
          </nav>
        </div>
      )}

      {/* Categories Nav */}
      <nav className="hidden md:block bg-gradient-to-r from-blue-50 via-white to-blue-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-center gap-8 text-sm font-bold overflow-x-auto">
          <Link to="/" className="flex items-center gap-2 text-gray-700 hover:text-primary transition-all hover:scale-105 whitespace-nowrap">
            <Package className="w-4 h-4" /> All Categories
          </Link>
          <Link to="/products?category=Men's Wear" className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-all hover:scale-105 whitespace-nowrap">
            <span className="text-lg">👔</span> Men's Wear
          </Link>
          <Link to="/products?category=Women's Fashion" className="flex items-center gap-2 text-gray-700 hover:text-pink-600 transition-all hover:scale-105 whitespace-nowrap">
            <span className="text-lg">👗</span> Women's Fashion
          </Link>
          <Link to="/products?category=Electronics" className="flex items-center gap-2 text-gray-700 hover:text-purple-600 transition-all hover:scale-105 whitespace-nowrap">
            <span className="text-lg">📱</span> Electronics
          </Link>
          <Link to="/products?category=Machinery" className="flex items-center gap-2 text-gray-700 hover:text-orange-600 transition-all hover:scale-105 whitespace-nowrap">
            <span className="text-lg">⚙️</span> Machinery
          </Link>
          <Link to="/products?category=Packaging" className="flex items-center gap-2 text-gray-700 hover:text-yellow-600 transition-all hover:scale-105 whitespace-nowrap">
            <span className="text-lg">📦</span> Packaging
          </Link>
        </div>
      </nav>
    </header>
    </>
  );
};

// --- Home Page with 8 Sections ---
const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { 
    fetch('/api/products').then(res => res.json()).then(data => {
      setProducts(data);
      setLoading(false);
    }); 
  }, []);

  const categories = [
    { name: "Men's Wear", icon: "👔", color: "from-blue-500 to-blue-600" },
    { name: "Women's Fashion", icon: "👗", color: "from-pink-500 to-pink-600" },
    { name: "Electronics", icon: "📱", color: "from-purple-500 to-purple-600" },
    { name: "Machinery", icon: "⚙️", color: "from-orange-500 to-orange-600" },
    { name: "Packaging", icon: "📦", color: "from-yellow-500 to-yellow-600" },
  ];

  if (loading) return <div className="p-20 text-center text-gray-500">Loading amazing products...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Section 1: Hero - Modern Attractive Design */}
      <section className="relative bg-white rounded-3xl p-8 md:p-12 mb-12 shadow-2xl overflow-hidden border border-gray-100">
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full blur-3xl opacity-30 -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-orange-100 to-pink-100 rounded-full blur-3xl opacity-30 translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <div className="inline-block px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-bold rounded-full shadow-lg animate-fade-in">
              🚀 Welcome To GlobalTrade
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-gray-900 leading-tight animate-slide-up">
              The Ultimate <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">B2B Shopping</span> Experience
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Bye bye limited suppliers. See you later high prices. Adios quality concerns. Connect with verified manufacturers worldwide.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <Link to="/products" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-2xl hover:scale-105 transition-all duration-300">
                <ShoppingCart className="w-5 h-5" /> Start Shopping
              </Link>
              <Link to="/login" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-all">
                Learn More
              </Link>
            </div>
          </div>

          {/* Right Visual - Product Showcase */}
          <div className="relative animate-float">
            <div className="relative bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl p-8 shadow-2xl">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-2xl p-4 shadow-lg hover:scale-105 transition-transform">
                  <img src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&q=80" alt="Fashion" className="w-full h-32 object-cover rounded-xl mb-2" />
                  <p className="text-xs font-bold text-gray-700">Fashion</p>
                </div>
                <div className="bg-white rounded-2xl p-4 shadow-lg hover:scale-105 transition-transform mt-8">
                  <img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&q=80" alt="Electronics" className="w-full h-32 object-cover rounded-xl mb-2" />
                  <p className="text-xs font-bold text-gray-700">Electronics</p>
                </div>
                <div className="bg-white rounded-2xl p-4 shadow-lg hover:scale-105 transition-transform">
                  <img src="https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?w=300&q=80" alt="Machinery" className="w-full h-32 object-cover rounded-xl mb-2" />
                  <p className="text-xs font-bold text-gray-700">Machinery</p>
                </div>
                <div className="bg-white rounded-2xl p-4 shadow-lg hover:scale-105 transition-transform mt-8">
                  <img src="https://images.unsplash.com/photo-1605648916361-9bc12ad6a569?w=300&q=80" alt="Packaging" className="w-full h-32 object-cover rounded-xl mb-2" />
                  <p className="text-xs font-bold text-gray-700">Packaging</p>
                </div>
              </div>
              {/* Floating badge */}
              <div className="absolute -top-4 -right-4 bg-white rounded-full p-4 shadow-xl">
                <div className="text-2xl font-black text-primary">150+</div>
                <div className="text-xs text-gray-500">Products</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Stats */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {[
          { icon: Package, label: "Products", value: `${products.length}+`, color: "text-blue-600 bg-blue-50" },
          { icon: Users, label: "Suppliers", value: "10K+", color: "text-green-600 bg-green-50" },
          { icon: Award, label: "Verified", value: "100%", color: "text-purple-600 bg-purple-50" },
          { icon: TrendingUp, label: "Orders", value: "50K+", color: "text-orange-600 bg-orange-50" },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-soft hover:shadow-3d transition-all duration-300 hover:-translate-y-1">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div className="text-2xl font-black text-gray-900">{stat.value}</div>
            <div className="text-sm text-gray-500 font-medium">{stat.label}</div>
          </div>
        ))}
      </section>

      {/* Section 3: Categories */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black text-gray-900">Shop by Category</h2>
          <Link to="/products" className="text-primary font-semibold hover:underline flex items-center gap-1">View All <ChevronRight className="w-4 h-4" /></Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat, i) => (
            <Link key={i} to={`/products?category=${encodeURIComponent(cat.name)}`} className="card-3d p-6 text-center group cursor-pointer">
              <div className={`w-16 h-16 mx-auto mb-3 bg-gradient-to-br ${cat.color} rounded-2xl flex items-center justify-center text-3xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                {cat.icon}
              </div>
              <h3 className="font-bold text-gray-900 text-sm">{cat.name}</h3>
            </Link>
          ))}
        </div>
      </section>

      {/* Section 4: Featured Products */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-primary" /> Featured Products
          </h2>
          <Link to="/products" className="text-primary font-semibold hover:underline flex items-center gap-1">View All <ChevronRight className="w-4 h-4" /></Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.slice(0, 8).map(p => (
            <ProductCard key={p.id || p._id} product={p} />
          ))}
        </div>
      </section>

      {/* Section 5: New Arrivals */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
            <Clock className="w-6 h-6 text-primary" /> New Arrivals
          </h2>
          <Link to="/products" className="text-primary font-semibold hover:underline flex items-center gap-1">View All <ChevronRight className="w-4 h-4" /></Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.slice(30, 38).map(p => (
            <ProductCard key={p.id || p._id} product={p} />
          ))}
        </div>
      </section>

      {/* Section 6: Top Sellers */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
            <Award className="w-6 h-6 text-primary" /> Top Sellers
          </h2>
          <Link to="/products" className="text-primary font-semibold hover:underline flex items-center gap-1">View All <ChevronRight className="w-4 h-4" /></Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.slice(60, 68).map(p => (
            <ProductCard key={p.id || p._id} product={p} />
          ))}
        </div>
      </section>

      {/* Section 7: Trust Badges */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="card-3d p-6 flex items-start gap-4">
          <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center flex-shrink-0">
            <ShieldCheck className="w-7 h-7 text-primary" />
          </div>
          <div>
            <h4 className="font-bold text-gray-900 mb-1">Secure Payment</h4>
            <p className="text-sm text-gray-500">256-bit SSL encrypted checkout for your safety.</p>
          </div>
        </div>
        <div className="card-3d p-6 flex items-start gap-4">
          <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center flex-shrink-0">
            <Headphones className="w-7 h-7 text-success" />
          </div>
          <div>
            <h4 className="font-bold text-gray-900 mb-1">24/7 Support</h4>
            <p className="text-sm text-gray-500">Dedicated B2B account managers ready to help.</p>
          </div>
        </div>
        <div className="card-3d p-6 flex items-start gap-4">
          <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center flex-shrink-0">
            <Truck className="w-7 h-7 text-orange-600" />
          </div>
          <div>
            <h4 className="font-bold text-gray-900 mb-1">Global Shipping</h4>
            <p className="text-sm text-gray-500">Reliable logistics partners delivering worldwide.</p>
          </div>
        </div>
      </section>

      {/* Section 8: Newsletter */}
      <section className="bg-gradient-to-br from-primary to-blue-700 rounded-3xl p-8 md:p-12 text-white text-center mb-12 shadow-2xl shadow-blue-500/20">
        <h2 className="text-2xl md:text-3xl font-black mb-3">Stay Updated with Latest Deals</h2>
        <p className="text-blue-100 mb-6 max-w-xl mx-auto">Subscribe to our newsletter and get exclusive offers, new product alerts, and industry insights.</p>
        <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input type="email" placeholder="Enter your email" className="flex-1 px-4 py-3 rounded-xl text-gray-900 outline-none focus:ring-2 focus:ring-white" />
          <button type="submit" className="px-6 py-3 bg-white text-primary font-bold rounded-xl hover:bg-gray-50 transition-all shadow-lg">Subscribe</button>
        </form>
      </section>
    </div>
  );
};

// --- Product Card Component ---
const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);
  const p = product;
  
  return (
    <Link to={`/product/${p.id || p._id}`} className="card-3d group overflow-hidden">
      <div className="relative overflow-hidden aspect-[4/3]">
        <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur text-success text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
          <CheckCircle className="w-3 h-3" /> In Stock
        </div>
        <button 
          onClick={(e) => { e.preventDefault(); addToCart(p); }}
          className="absolute bottom-3 right-3 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-primary hover:text-white text-gray-700"
        >
          <ShoppingCart className="w-5 h-5" />
        </button>
      </div>
      <div className="p-5">
        <h3 className="font-bold text-gray-900 line-clamp-2 mb-2 group-hover:text-primary transition-colors leading-snug text-sm">{p.name}</h3>
        <div className="flex items-center gap-1.5 mb-3">
          <Star className="w-4 h-4 text-yellow-400 fill-current" />
          <span className="text-sm font-bold text-gray-900">{p.rating}</span>
          <span className="text-xs text-gray-400">({p.reviews})</span>
        </div>
        <div className="flex items-end justify-between">
          <div>
            <div className="text-accent font-black text-xl">${p.priceTiers[0].price}</div>
            <div className="text-xs text-gray-400 font-medium">Min. Order: 10 pcs</div>
          </div>
        </div>
      </div>
    </Link>
  );
};

// --- Sidebar Filter Component ---
const SidebarFilter = ({ category, selectedBrand, setSelectedBrand, priceRange, setPriceRange, brands }) => {
  const brandLogos = {
    // Men's Wear
    "Nike": "https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg",
    "Adidas": "https://upload.wikimedia.org/wikipedia/commons/2/20/Adidas_Logo.svg",
    "Ralph Lauren": "https://upload.wikimedia.org/wikipedia/commons/4/4c/Ralph_Lauren_logo.svg",
    "Calvin Klein": "https://upload.wikimedia.org/wikipedia/commons/5/5a/Calvin_Klein_logo_2019.svg",
    "Tommy Hilfiger": "https://upload.wikimedia.org/wikipedia/commons/6/6e/Tommy_Hilfiger_logo_2.svg",
    "Levi's": "https://upload.wikimedia.org/wikipedia/commons/4/45/Levi%27s_logo.svg",
    "Hugo Boss": "https://upload.wikimedia.org/wikipedia/commons/1/1a/Hugo_Boss_logo.svg",
    "Under Armour": "https://upload.wikimedia.org/wikipedia/commons/4/44/Under_armour_logo.svg",
    "Puma": "https://upload.wikimedia.org/wikipedia/commons/7/73/Puma_Logo.svg",
    "Gap": "https://upload.wikimedia.org/wikipedia/commons/8/8e/Gap_Logo.svg",
    // Women's Fashion
    "Zara": "https://upload.wikimedia.org/wikipedia/commons/3/34/Zara_Logo.svg",
    "H&M": "https://upload.wikimedia.org/wikipedia/commons/5/53/H%26M-Logo.svg",
    "Gucci": "https://upload.wikimedia.org/wikipedia/commons/3/35/Gucci_logo.svg",
    "Prada": "https://upload.wikimedia.org/wikipedia/commons/4/4d/Prada_logo.svg",
    "Chanel": "https://upload.wikimedia.org/wikipedia/commons/a/a3/Chanel_logo_interlocking_cs.svg",
    "Louis Vuitton": "https://upload.wikimedia.org/wikipedia/commons/8/8c/Louis_Vuitton_logo.svg",
    "Dior": "https://upload.wikimedia.org/wikipedia/commons/a/a7/Dior_logo.svg",
    "Versace": "https://upload.wikimedia.org/wikipedia/commons/4/4a/Versace_logo.svg",
    "Armani": "https://upload.wikimedia.org/wikipedia/commons/5/51/Armani_logo.svg",
    "Burberry": "https://upload.wikimedia.org/wikipedia/commons/4/4c/Burberry_logo.svg",
    // Electronics
    "Apple": "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
    "Samsung": "https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg",
    "Sony": "https://upload.wikimedia.org/wikipedia/commons/c/ca/Sony_logo.svg",
    "Dell": "https://upload.wikimedia.org/wikipedia/commons/4/48/Dell_Logo.svg",
    "Bose": "https://upload.wikimedia.org/wikipedia/commons/1/1f/Bose_logo.svg",
    "Microsoft": "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg",
    "Canon": "https://upload.wikimedia.org/wikipedia/commons/2/26/Canon_logo.svg",
    "Nikon": "https://upload.wikimedia.org/wikipedia/commons/1/1a/Nikon_logo.svg",
    "LG": "https://upload.wikimedia.org/wikipedia/commons/b/bf/LG_logo_%282014%29.svg",
    "Nintendo": "https://upload.wikimedia.org/wikipedia/commons/0/0d/Nintendo.svg",
    // Machinery
    "Caterpillar": "https://upload.wikimedia.org/wikipedia/commons/4/44/Caterpillar_logo.svg",
    "John Deere": "https://upload.wikimedia.org/wikipedia/commons/7/75/John_Deere_logo.svg",
    "Komatsu": "https://upload.wikimedia.org/wikipedia/commons/2/2e/Komatsu_logo.svg",
    "Volvo": "https://upload.wikimedia.org/wikipedia/commons/3/3f/Volvo_Iron_Mark.svg",
    "Liebherr": "https://upload.wikimedia.org/wikipedia/commons/6/6d/Liebherr_logo.svg",
    "Bomag": "https://upload.wikimedia.org/wikipedia/commons/5/5a/BOMAG_logo.svg",
    "JCB": "https://upload.wikimedia.org/wikipedia/commons/8/8d/JCB_logo.svg",
    "Case IH": "https://upload.wikimedia.org/wikipedia/commons/4/4d/Case_IH_logo.svg",
    "New Holland": "https://upload.wikimedia.org/wikipedia/commons/4/4a/New_Holland_logo.svg",
    "Kubota": "https://upload.wikimedia.org/wikipedia/commons/2/2e/Kubota_logo.svg",
    // Packaging
    "3M": "https://upload.wikimedia.org/wikipedia/commons/6/6c/3M_logo.svg",
    "Uline": "https://upload.wikimedia.org/wikipedia/commons/7/7d/Uline_logo.svg",
    "Sealed Air": "https://upload.wikimedia.org/wikipedia/commons/5/5a/Sealed_Air_logo.svg",
    "Intek": "https://upload.wikimedia.org/wikipedia/commons/5/5a/Intek_logo.svg",
    "Berry Global": "https://upload.wikimedia.org/wikipedia/commons/5/5a/Berry_Global_logo.svg",
    "Pregis": "https://upload.wikimedia.org/wikipedia/commons/5/5a/Pregis_logo.svg",
    "WestRock": "https://upload.wikimedia.org/wikipedia/commons/5/5a/WestRock_logo.svg",
    "Shurtape": "https://upload.wikimedia.org/wikipedia/commons/5/5a/Shurtape_logo.svg",
    "Devon Industries": "https://upload.wikimedia.org/wikipedia/commons/5/5a/Devon_Industries_logo.svg",
    "International Paper": "https://upload.wikimedia.org/wikipedia/commons/5/5a/International_Paper_logo.svg",
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-soft p-6 sticky top-24">
      <h3 className="font-bold text-gray-900 mb-4 text-lg">Filters</h3>
      
      {/* Brand Filter */}
      <div className="mb-6">
        <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <Award className="w-4 h-4 text-primary" /> Brands
        </h4>
        <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
          <button
            onClick={() => setSelectedBrand('')}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all flex items-center gap-2 ${
              !selectedBrand ? 'bg-primary text-white' : 'hover:bg-gray-50 text-gray-700'
            }`}
          >
            All Brands
          </button>
          {brands.map(brand => (
            <button
              key={brand}
              onClick={() => setSelectedBrand(brand)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all flex items-center gap-2 ${
                selectedBrand === brand ? 'bg-primary text-white' : 'hover:bg-gray-50 text-gray-700'
              }`}
            >
              {brandLogos[brand] && (
                <img 
                  src={brandLogos[brand]} 
                  alt={brand}
                  className="w-6 h-6 object-contain"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              )}
              <span className="flex-1">{brand}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Price Range Filter */}
      <div className="mb-6">
        <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <span className="text-primary">$</span> Price Range
        </h4>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Min Price: ${priceRange.min}</label>
            <input
              type="range"
              min="0"
              max="1000"
              step="10"
              value={priceRange.min}
              onChange={(e) => setPriceRange({ ...priceRange, min: parseInt(e.target.value) })}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Max Price: ${priceRange.max}</label>
            <input
              type="range"
              min="0"
              max="1000"
              step="10"
              value={priceRange.max}
              onChange={(e) => setPriceRange({ ...priceRange, max: parseInt(e.target.value) })}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
            />
          </div>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Min"
              value={priceRange.min}
              onChange={(e) => setPriceRange({ ...priceRange, min: parseInt(e.target.value) || 0 })}
              className="flex-1 px-2 py-1 border border-gray-200 rounded-lg text-sm"
            />
            <input
              type="number"
              placeholder="Max"
              value={priceRange.max}
              onChange={(e) => setPriceRange({ ...priceRange, max: parseInt(e.target.value) || 1000 })}
              className="flex-1 px-2 py-1 border border-gray-200 rounded-lg text-sm"
            />
          </div>
        </div>
      </div>

      {/* Clear Filters Button */}
      {(selectedBrand || priceRange.min > 0 || priceRange.max < 1000) && (
        <button
          onClick={() => {
            setSelectedBrand('');
            setPriceRange({ min: 0, max: 1000 });
          }}
          className="w-full py-2 bg-red-50 text-red-600 rounded-lg text-sm font-semibold hover:bg-red-100 transition-colors"
        >
          Clear All Filters
        </button>
      )}
    </div>
  );
};

// --- Products Listing Page ---
const Products = () => {
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category') || '';
  const search = searchParams.get('search') || '';

  // Fetch brands for current category
  useEffect(() => {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    fetch(`/api/brands?${params}`).then(res => res.json()).then(setBrands);
  }, [category]);

  // Fetch products with filters
  useEffect(() => { 
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (search) params.append('search', search);
    if (selectedBrand) params.append('brand', selectedBrand);
    if (priceRange.min > 0) params.append('minPrice', priceRange.min);
    if (priceRange.max < 1000) params.append('maxPrice', priceRange.max);
    
    fetch(`/api/products?${params}`).then(res => res.json()).then(setProducts); 
  }, [category, search, selectedBrand, priceRange]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900">
          {category ? category : search ? `Search: "${search}"` : 'All Products'}
        </h1>
        <p className="text-gray-500 mt-1">{products.length} products found</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Filter */}
        <div className="lg:col-span-1">
          <SidebarFilter
            category={category}
            selectedBrand={selectedBrand}
            setSelectedBrand={setSelectedBrand}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            brands={brands}
          />
        </div>

        {/* Product Grid */}
        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map(p => <ProductCard key={p.id || p._id} product={p} />)}
          </div>
          {products.length === 0 && (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-500">Try adjusting your filters or search terms.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- Product Detail Page (FIXED) ---
const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Description');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedTier, setSelectedTier] = useState(0);
  const [quantity, setQuantity] = useState(10);
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const { addToCart } = useContext(CartContext);
  
  useEffect(() => { 
    fetch('/api/products').then(res => res.json()).then(data => {
      const found = data.find(p => String(p.id || p._id) === String(id));
      setProduct(found);
      setLoading(false);
      
      // Check if product is in favorites
      const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
      setIsFavorite(favorites.some(f => f.id === found.id));
    }); 
  }, [id]);

  // Auto-select tier based on quantity
  useEffect(() => {
    if (product && product.priceTiers) {
      const tierRanges = [
        { min: 10, max: 99, tier: 0 },
        { min: 100, max: 499, tier: 1 },
        { min: 500, max: Infinity, tier: 2 }
      ];
      
      const matchingTier = tierRanges.find(range => quantity >= range.min && quantity <= range.max);
      if (matchingTier) {
        setSelectedTier(matchingTier.tier);
      }
    }
  }, [quantity, product]);

  // Determine size options based on product category
  const getSizeOptions = () => {
    if (!product) return [];
    const name = product.name.toLowerCase();
    if (name.includes('shoe') || name.includes('boot') || name.includes('sneaker')) {
      return Array.from({length: 26}, (_, i) => i + 20);
    } else if (name.includes('shirt') || name.includes('t-shirt') || name.includes('blazer') || name.includes('jacket') || name.includes('dress') || name.includes('blouse')) {
      return ['S', 'M', 'L', 'XL', 'XXL'];
    }
    return [];
  };

  const sizeOptions = getSizeOptions();

  // Handle Add to Favorites
  const handleAddToFavorites = () => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    
    if (isFavorite) {
      // Remove from favorites
      const updated = favorites.filter(f => f.id !== product.id);
      localStorage.setItem('favorites', JSON.stringify(updated));
      setIsFavorite(false);
      alert('Removed from favorites!');
    } else {
      // Add to favorites
      favorites.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        addedAt: new Date().toISOString()
      });
      localStorage.setItem('favorites', JSON.stringify(favorites));
      setIsFavorite(true);
      alert('Added to favorites!');
    }
  };

  // Handle Send Inquiry
  const handleSendInquiry = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const inquiryData = {
      productId: product.id,
      productName: product.name,
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      message: formData.get('message'),
      quantity: quantity,
      selectedTier: product.priceTiers[selectedTier]?.qty,
      selectedSize: selectedSize || 'N/A',
      timestamp: new Date().toISOString()
    };
    
    // Save inquiry to localStorage
    const inquiries = JSON.parse(localStorage.getItem('inquiries') || '[]');
    inquiries.push(inquiryData);
    localStorage.setItem('inquiries', JSON.stringify(inquiries));
    
    alert('Inquiry sent successfully! We will contact you soon.');
    setShowInquiryModal(false);
    e.target.reset();
  };

  const sampleReviews = [
    { name: 'John D.', rating: 5, date: '2 days ago', comment: 'Excellent quality! Fast shipping and exactly as described. Will order again.' },
    { name: 'Sarah M.', rating: 4, date: '1 week ago', comment: 'Good product overall. Material is solid and construction is well done.' },
    { name: 'Mike R.', rating: 5, date: '2 weeks ago', comment: 'Perfect for our business needs. Bulk pricing was very competitive.' },
  ];

  if (loading) return <div className="p-20 text-center text-gray-500">Loading...</div>;
  if (!product) return <div className="p-20 text-center text-gray-500">Product not found</div>;

  const currentPrice = product.priceTiers[selectedTier]?.price || product.price;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-4">
          <div className="relative rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 shadow-inner group">
            <img src={product.image} alt={product.name} className="w-full h-[450px] object-cover group-hover:scale-105 transition-transform duration-500" />
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {[1,2,3,4].map(i => (
              <div key={i} className="w-20 h-20 bg-gray-50 rounded-xl border-2 border-transparent hover:border-primary transition-all cursor-pointer overflow-hidden flex-shrink-0">
                <img src={product.image} className="w-full h-full object-cover opacity-60 hover:opacity-100" />
              </div>
            ))}
          </div>
        </div>
        
        <div className="lg:col-span-4 space-y-6">
          <div>
            <div className="flex items-center gap-2 text-success text-sm font-bold mb-3 bg-green-50 w-fit px-3 py-1 rounded-full">
              <CheckCircle className="w-4 h-4" /> In Stock • Ready to Ship
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-gray-900 leading-tight">{product.name}</h1>
            <div className="flex items-center gap-3 mt-3 text-sm text-gray-600">
              <div className="flex items-center gap-1"><Star className="w-4 h-4 text-yellow-400 fill-current" /><span className="font-bold text-gray-900">{product.rating}</span></div>
              <span className="text-gray-300">|</span>
              <span>{product.reviews} reviews</span>
              <span className="text-gray-300">|</span>
              <span>{product.sold} sold</span>
            </div>
          </div>

          {/* Selectable Tiered Pricing */}
          <div className="bg-blue-50/60 border border-blue-100 rounded-2xl p-5">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2 text-sm uppercase tracking-wide">
              <span className="w-1.5 h-1.5 bg-primary rounded-full"></span> Select Quantity Tier
            </h3>
            <div className="space-y-2">
              {product.priceTiers.map((tier, idx) => (
                <button 
                  key={idx} 
                  onClick={() => setSelectedTier(idx)}
                  className={`w-full flex justify-between items-center text-sm p-3 rounded-xl border transition-all ${
                    selectedTier === idx 
                      ? 'bg-primary text-white border-primary shadow-lg scale-105' 
                      : 'bg-white border-blue-100/50 shadow-sm hover:border-primary hover:shadow-md'
                  }`}
                >
                  <span className={`font-semibold ${selectedTier === idx ? 'text-white' : 'text-gray-600'}`}>{tier.qty}</span>
                  <span className={`font-black text-lg ${selectedTier === idx ? 'text-white' : (idx === 2 ? 'text-accent' : 'text-gray-900')}`}>${tier.price}</span>
                </button>
              ))}
            </div>
            <div className="mt-4 p-3 bg-white rounded-xl border border-blue-100">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Selected Price:</span>
                <span className="text-2xl font-black text-primary">${currentPrice}</span>
              </div>
            </div>
          </div>

          {/* Size Selection */}
          {sizeOptions.length > 0 && (
            <div className="border-t border-gray-100 pt-6">
              <h3 className="font-bold text-gray-900 mb-4">Select Size</h3>
              <div className="flex flex-wrap gap-2">
                {sizeOptions.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 rounded-lg border-2 font-semibold transition-all ${
                      selectedSize === size
                        ? 'bg-primary text-white border-primary'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-primary'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Selection */}
          <div className="border-t border-gray-100 pt-6">
            <h3 className="font-bold text-gray-900 mb-4">Quantity</h3>
            <div className="flex items-center gap-3">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 rounded-lg border border-gray-200 hover:bg-gray-50 font-bold">-</button>
              <input 
                type="number" 
                value={quantity} 
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-20 text-center border border-gray-200 rounded-lg py-2 font-bold"
              />
              <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 rounded-lg border border-gray-200 hover:bg-gray-50 font-bold">+</button>
            </div>
            <p className="text-sm text-gray-500 mt-2">Total: <span className="font-bold text-primary">${(currentPrice * quantity).toFixed(2)}</span></p>
          </div>

          <div className="border-t border-gray-100 pt-6">
            <h3 className="font-bold text-gray-900 mb-4">Specifications</h3>
            <div className="grid grid-cols-2 gap-y-4 gap-x-4 text-sm">
              {Object.entries(product.specs).map(([key, val]) => (
                <div key={key} className="flex flex-col">
                  <span className="text-gray-400 text-xs uppercase tracking-wider font-semibold mb-1">{key}</span>
                  <span className="text-gray-800 font-medium">{val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 shadow-sm sticky top-24">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary font-black text-lg">G</div>
              <div>
                <div className="font-bold text-gray-900">{product.supplier}</div>
                <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5"><Globe className="w-3 h-3" /> Germany, Berlin</div>
              </div>
            </div>
            <div className="flex gap-2 mb-5">
              <span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-2 py-1 rounded-md flex items-center gap-1"><CheckCircle className="w-3 h-3"/> Verified</span>
              <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-1 rounded-md flex items-center gap-1"><Truck className="w-3 h-3"/> Worldwide</span>
            </div>
            <button 
              onClick={() => {
                const productWithDetails = {
                  ...product,
                  selectedSize: selectedSize || 'One Size',
                  selectedTier: selectedTier,
                  quantity: quantity,
                  unitPrice: currentPrice
                };
                addToCart(productWithDetails, quantity);
              }}
              className="w-full btn-primary flex items-center justify-center gap-2 mb-3"
            >
              <ShoppingCart className="w-4 h-4" /> Add to Cart
            </button>
            <button 
              onClick={() => setShowInquiryModal(true)}
              className="w-full border border-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-all flex items-center justify-center gap-2 mb-4"
            >
              <MessageSquare className="w-4 h-4" /> Send Inquiry
            </button>
            <button 
              onClick={handleAddToFavorites}
              className={`w-full transition-colors flex items-center justify-center gap-2 text-sm font-medium py-2 rounded-xl ${
                isFavorite 
                  ? 'text-red-500 bg-red-50 hover:bg-red-100' 
                  : 'text-gray-500 hover:text-red-500 hover:bg-gray-50'
              }`}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} /> 
              {isFavorite ? 'Saved to Favorites' : 'Save to Favorites'}
            </button>
          </div>
        </div>
      </div>

      {/* Inquiry Modal */}
      {showInquiryModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowInquiryModal(false)}>
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Send Inquiry</h2>
              <button onClick={() => setShowInquiryModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSendInquiry} className="p-6 space-y-4">
              <div className="bg-gray-50 rounded-xl p-4 mb-4">
                <div className="flex gap-4">
                  <img src={product.image} alt={product.name} className="w-20 h-20 object-cover rounded-lg" />
                  <div>
                    <h3 className="font-bold text-gray-900">{product.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">Quantity: {quantity} pcs | Tier: {product.priceTiers[selectedTier]?.qty}</p>
                    <p className="text-sm text-primary font-bold mt-1">Unit Price: ${currentPrice}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Your Name *</label>
                  <input type="text" name="name" required className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email *</label>
                  <input type="email" name="email" required className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary outline-none" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
                  <input type="tel" name="phone" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary outline-none" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Message *</label>
                  <textarea name="message" rows="4" required className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary outline-none" placeholder="Tell us about your requirements..."></textarea>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button type="submit" className="flex-1 btn-primary">Send Inquiry</button>
                <button type="button" onClick={() => setShowInquiryModal(false)} className="px-6 py-3 border border-gray-200 rounded-xl font-semibold hover:bg-gray-50">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tabs Section with Real Content */}
      <div className="mt-8 bg-white rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
        <div className="flex border-b border-gray-100 overflow-x-auto">
          {['Description', 'Reviews', 'Shipping', 'About seller'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-8 py-4 font-semibold text-sm whitespace-nowrap transition-colors relative ${activeTab === tab ? 'text-primary' : 'text-gray-500 hover:text-gray-700'}`}>
              {tab}
              {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>}
            </button>
          ))}
        </div>
        <div className="p-8">
          {activeTab === 'Description' && (
            <div className="space-y-4">
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
              <p className="text-gray-600 leading-relaxed">Our premium products undergo strict quality control inspections before shipping. We offer customizable packaging, OEM/ODM services, and dedicated account management for bulk orders. Contact us today to discuss your specific requirements and get a tailored quote.</p>
            </div>
          )}
          
          {activeTab === 'Reviews' && (
            <div className="space-y-6">
              <div className="flex items-center gap-4 pb-6 border-b border-gray-100">
                <div className="text-5xl font-black text-gray-900">{product.rating}</div>
                <div>
                  <div className="flex items-center gap-1 mb-1">
                    {[1,2,3,4,5].map(star => (
                      <Star key={star} className={`w-5 h-5 ${star <= Math.round(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                    ))}
                  </div>
                  <p className="text-sm text-gray-500">Based on {product.reviews} reviews</p>
                </div>
              </div>
              <div className="space-y-4">
                {sampleReviews.map((review, idx) => (
                  <div key={idx} className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">{review.name[0]}</div>
                        <div>
                          <p className="font-bold text-gray-900">{review.name}</p>
                          <p className="text-xs text-gray-500">{review.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {[1,2,3,4,5].map(star => (
                          <Star key={star} className={`w-4 h-4 ${star <= review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-600">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {activeTab === 'Shipping' && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900">Shipping Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Truck className="w-5 h-5 text-primary" />
                    <h4 className="font-bold text-gray-900">Standard Shipping</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">7-15 business days</p>
                  <p className="text-lg font-bold text-primary">FREE</p>
                </div>
                <div className="p-4 bg-green-50 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Truck className="w-5 h-5 text-success" />
                    <h4 className="font-bold text-gray-900">Express Shipping</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">3-5 business days</p>
                  <p className="text-lg font-bold text-success">$29.99</p>
                </div>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl">
                <h4 className="font-bold text-gray-900 mb-2">Shipping Partners</h4>
                <p className="text-sm text-gray-600">We ship worldwide via DHL, FedEx, UPS, and local carriers. All orders include tracking numbers and insurance.</p>
              </div>
            </div>
          )}
          
          {activeTab === 'About seller' && (
            <div className="space-y-4">
              <div className="flex items-center gap-4 pb-6 border-b border-gray-100">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary font-black text-3xl">G</div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{product.supplier}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Globe className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Berlin, Germany</span>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <span className="text-xs font-bold bg-blue-100 text-blue-700 px-2 py-1 rounded-md">Verified Seller</span>
                    <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-1 rounded-md">5 Years on Platform</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-gray-50 rounded-xl text-center">
                  <p className="text-3xl font-black text-primary">98%</p>
                  <p className="text-sm text-gray-600">Positive Feedback</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl text-center">
                  <p className="text-3xl font-black text-primary">24h</p>
                  <p className="text-sm text-gray-600">Response Time</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl text-center">
                  <p className="text-3xl font-black text-primary">5000+</p>
                  <p className="text-sm text-gray-600">Orders Completed</p>
                </div>
              </div>
              <div className="p-4 bg-blue-50 rounded-xl">
                <h4 className="font-bold text-gray-900 mb-2">About Us</h4>
                <p className="text-sm text-gray-600 leading-relaxed">We are a leading B2B supplier specializing in high-quality products with competitive pricing. With over 5 years of experience, we serve customers worldwide with reliable shipping and excellent customer service.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- Cart Page ---
const Cart = () => {
  const { cart, removeFromCart, updateQuantity, cartTotal, clearCart } = useContext(CartContext);
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="text-2xl font-black text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-6">Start adding products to see them here.</p>
        <Link to="/products" className="btn-primary">Browse Products</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-black mb-6 text-gray-900">My Cart <span className="text-gray-400 font-normal text-lg">({cart.length})</span></h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cart.map(item => (
            <div key={item.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-soft flex flex-col sm:flex-row gap-5">
              <img src={item.image} className="w-full sm:w-28 h-48 sm:h-28 object-cover rounded-xl bg-gray-50" />
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 mb-1">{item.name}</h3>
                <div className="flex flex-wrap gap-2 mb-2">
                  {item.selectedSize && item.selectedSize !== 'One Size' && (
                    <span className="text-xs font-semibold bg-blue-50 text-blue-700 px-2 py-1 rounded-md">Size: {item.selectedSize}</span>
                  )}
                  {item.selectedTier !== undefined && (
                    <span className="text-xs font-semibold bg-green-50 text-green-700 px-2 py-1 rounded-md">
                      Tier: {item.priceTiers[item.selectedTier]?.qty}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500 mb-4">Seller: {item.supplier}</p>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <select value={item.quantity} onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))} className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 focus:ring-2 focus:ring-primary outline-none">
                    <option value="1">1</option><option value="10">10</option><option value="50">50</option><option value="100">100</option><option value="500">500</option>
                  </select>
                  <div className="flex gap-5 text-sm font-semibold">
                    <button onClick={() => removeFromCart(item.id)} className="text-red-500 flex items-center gap-1.5 hover:text-red-600"><Trash2 className="w-4 h-4" /> Remove</button>
                  </div>
                </div>
              </div>
              <div className="text-right sm:self-start">
                <div className="font-black text-xl text-gray-900">${(item.price * item.quantity).toFixed(2)}</div>
                <div className="text-xs text-gray-400 mt-1">${item.price} x {item.quantity}</div>
              </div>
            </div>
          ))}
          <div className="flex justify-between items-center pt-2">
            <Link to="/" className="text-primary font-semibold flex items-center gap-2 hover:underline">← Continue shopping</Link>
            <button onClick={clearCart} className="text-sm text-gray-500 hover:text-red-500 font-medium">Clear cart</button>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-soft h-fit">
          <h2 className="font-bold text-lg mb-5 text-gray-900">Order Summary</h2>
          <div className="space-y-4 mb-6">
            <div className="flex justify-between text-sm text-gray-600"><span>Subtotal</span><span className="font-semibold text-gray-900">${cartTotal.toFixed(2)}</span></div>
            <div className="flex justify-between text-sm text-red-500"><span>Discount</span><span className="font-semibold">-$0.00</span></div>
            <div className="flex justify-between text-sm text-gray-600"><span>Tax (8%)</span><span className="font-semibold text-gray-900">${(cartTotal * 0.08).toFixed(2)}</span></div>
            <div className="border-t border-gray-100 pt-4 flex justify-between font-black text-xl text-gray-900"><span>Total</span><span className="text-primary">${(cartTotal * 1.08).toFixed(2)}</span></div>
          </div>
          <button onClick={() => navigate('/checkout')} className="w-full btn-success flex items-center justify-center gap-2 mb-4">
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

// --- NEW: Checkout Page (No Login Required) ---
const Checkout = () => {
  const { cart, cartTotal, clearCart } = useContext(CartContext);
  const [formData, setFormData] = useState({
    fullName: '', email: '', phone: '', address: '', city: '', zipCode: '', country: '',
    cardName: '', cardNumber: '', expiry: '', cvv: ''
  });
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    
    const orderData = {
      customerInfo: formData,
      items: cart,
      total: cartTotal * 1.08
    };

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });
      const data = await res.json();
      
      if (data.success) {
        clearCart();
        navigate(`/order-success?orderId=${data.orderId}`);
      }
    } catch (error) {
      alert('Order failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-black mb-6 text-gray-900">Checkout</h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Shipping Information */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-soft p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <MapPinned className="w-6 h-6 text-primary" /> Shipping Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name *</label>
                <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email *</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone *</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Address *</label>
                <input type="text" name="address" value={formData.address} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">City *</label>
                <input type="text" name="city" value={formData.city} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">ZIP Code *</label>
                <input type="text" name="zipCode" value={formData.zipCode} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Country *</label>
                <input type="text" name="country" value={formData.country} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-soft p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <CreditCard className="w-6 h-6 text-primary" /> Payment Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Name on Card *</label>
                <input type="text" name="cardName" value={formData.cardName} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Card Number *</label>
                <input type="text" name="cardNumber" value={formData.cardNumber} onChange={handleChange} placeholder="1234 5678 9012 3456" required maxLength="19" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Expiry Date *</label>
                <input type="text" name="expiry" value={formData.expiry} onChange={handleChange} placeholder="MM/YY" required maxLength="5" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">CVV *</label>
                <input type="text" name="cvv" value={formData.cvv} onChange={handleChange} placeholder="123" required maxLength="4" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-soft p-6 sticky top-24">
            <h2 className="font-bold text-lg mb-5 text-gray-900">Order Summary</h2>
            <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
              {cart.map(item => (
                <div key={item.id} className="flex gap-3">
                  <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900 line-clamp-2">{item.name}</p>
                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <span className="text-sm font-bold text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-100 pt-4 space-y-2 mb-4">
              <div className="flex justify-between text-sm text-gray-600"><span>Subtotal</span><span className="font-semibold">${cartTotal.toFixed(2)}</span></div>
              <div className="flex justify-between text-sm text-gray-600"><span>Tax (8%)</span><span className="font-semibold">${(cartTotal * 0.08).toFixed(2)}</span></div>
              <div className="border-t border-gray-100 pt-2 flex justify-between font-black text-xl text-gray-900"><span>Total</span><span className="text-primary">${(cartTotal * 1.08).toFixed(2)}</span></div>
            </div>
            <button type="submit" disabled={processing} className="w-full btn-success flex items-center justify-center gap-2 disabled:opacity-50">
              {processing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing...
                </>
              ) : (
                'Place Order'
              )}
            </button>
            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
              <ShieldCheck className="w-4 h-4" /> Secure 256-bit SSL Encryption
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

// --- Order Success Page ---
const OrderSuccess = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');

  return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <div className="bg-white rounded-3xl border border-gray-100 shadow-3d p-12">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-float">
          <CheckCircle className="w-12 h-12 text-success" />
        </div>
        <h1 className="text-3xl font-black text-gray-900 mb-4">Order Placed Successfully!</h1>
        <p className="text-gray-600 mb-6">Thank you for your order. Your order ID is:</p>
        <div className="bg-gray-50 rounded-xl p-4 mb-6">
          <p className="text-2xl font-black text-primary">#{orderId}</p>
        </div>
        <p className="text-gray-500 mb-8">You will receive a confirmation email shortly.</p>
        <Link to="/" className="btn-primary">Continue Shopping</Link>
      </div>
    </div>
  );
};

// --- Login Page ---
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/auth/login', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (data.success) {
      login(data.user, data.token);
      navigate(data.user.role === 'admin' ? '/admin' : '/');
    } else {
      alert(data.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-8 bg-white rounded-3xl border border-gray-100 shadow-[0_20px_50px_rgb(0,0,0,0.08)]">
      <h2 className="text-2xl font-black mb-2 text-center text-gray-900">Sign In</h2>
      <p className="text-gray-500 text-center mb-8 text-sm">Access your B2B wholesale account</p>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1.5">Email Address</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all bg-gray-50 focus:bg-white" required />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1.5">Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all bg-gray-50 focus:bg-white" required />
        </div>
        <button type="submit" className="w-full btn-primary">Sign In</button>
      </form>
      <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
        <p className="text-xs text-blue-800 font-bold text-center">Demo Admin: admin@globaltrade.com / admin123</p>
      </div>
    </div>
  );
};

// --- Admin Dashboard (Updated to show orders) ---
const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchData = async () => {
      const headers = { 'Authorization': `Bearer ${token}` };
      const [pRes, oRes] = await Promise.all([ fetch('/api/products', { headers }), fetch('/api/orders', { headers }) ]);
      setProducts(await pRes.json());
      setOrders(await oRes.json());
    };
    fetchData();
  }, [token]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const response = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (response.ok) {
        // Update local state
        setOrders(orders.map(order => 
          (order.id || order._id) === orderId ? { ...order, status: newStatus } : order
        ));
        
        // If order is delivered, remove from list after 3 seconds
        if (newStatus === 'Delivered') {
          setTimeout(() => {
            setOrders(orders.filter(order => (order.id || order._id) !== orderId));
          }, 3000);
          alert('Order marked as delivered and will be removed from active orders.');
        } else {
          alert(`Order status updated to: ${newStatus}`);
        }
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status');
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Processing': return 'bg-yellow-50 text-yellow-700 border-yellow-100';
      case 'Shipped': return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'Delivered': return 'bg-green-50 text-green-700 border-green-100';
      case 'Cancelled': return 'bg-red-50 text-red-700 border-red-100';
      default: return 'bg-gray-50 text-gray-700 border-gray-100';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-black mb-8 text-gray-900">Admin Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-soft">
          <h3 className="text-gray-500 text-sm font-bold uppercase tracking-wide">Total Products</h3>
          <p className="text-4xl font-black text-gray-900 mt-2">{products.length}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-soft">
          <h3 className="text-gray-500 text-sm font-bold uppercase tracking-wide">Active Orders</h3>
          <p className="text-4xl font-black text-gray-900 mt-2">{orders.filter(o => o.status !== 'Delivered').length}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-soft">
          <h3 className="text-gray-500 text-sm font-bold uppercase tracking-wide">Total Revenue</h3>
          <p className="text-4xl font-black text-success mt-2">${orders.reduce((sum, o) => sum + (o.total || 0), 0).toFixed(2)}</p>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-soft overflow-hidden mb-8">
        <div className="px-6 py-5 border-b border-gray-100"><h2 className="text-lg font-bold text-gray-900">Order Management</h2></div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-600 font-bold uppercase tracking-wide text-xs">
              <tr>
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Items</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map(order => (
                <tr key={order.id || order._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-mono text-gray-600">#{(order.id || order._id).toString().slice(-8)}</td>
                  <td className="px-6 py-4 text-gray-900 font-semibold">{order.customerInfo?.fullName || 'N/A'}</td>
                  <td className="px-6 py-4 text-gray-600">{order.customerInfo?.email || 'N/A'}</td>
                  <td className="px-6 py-4 text-gray-600">{order.items?.length || 0} items</td>
                  <td className="px-6 py-4 font-bold text-gray-900">${order.total?.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <select 
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id || order._id, e.target.value)}
                      className={`px-3 py-1 border rounded-full text-xs font-bold ${getStatusColor(order.status)}`}
                    >
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => setSelectedOrder(order)}
                      className="text-primary hover:text-primary-dark font-semibold text-sm"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && <tr><td colSpan="7" className="px-6 py-12 text-center text-gray-500 font-medium">No orders yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedOrder(null)}>
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Order Details #{(selectedOrder.id || selectedOrder._id).toString().slice(-8)}</h2>
              <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Customer Information */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" /> Customer Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div><span className="text-gray-500">Name:</span> <span className="font-semibold text-gray-900">{selectedOrder.customerInfo?.fullName}</span></div>
                  <div><span className="text-gray-500">Email:</span> <span className="font-semibold text-gray-900">{selectedOrder.customerInfo?.email}</span></div>
                  <div><span className="text-gray-500">Phone:</span> <span className="font-semibold text-gray-900">{selectedOrder.customerInfo?.phone}</span></div>
                  <div><span className="text-gray-500">Country:</span> <span className="font-semibold text-gray-900">{selectedOrder.customerInfo?.country}</span></div>
                  <div className="md:col-span-2"><span className="text-gray-500">Address:</span> <span className="font-semibold text-gray-900">{selectedOrder.customerInfo?.address}, {selectedOrder.customerInfo?.city} {selectedOrder.customerInfo?.zipCode}</span></div>
                </div>
              </div>

              {/* Payment Information */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-primary" /> Payment Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div><span className="text-gray-500">Card Name:</span> <span className="font-semibold text-gray-900">{selectedOrder.customerInfo?.cardName}</span></div>
                  <div><span className="text-gray-500">Card Number:</span> <span className="font-semibold text-gray-900">**** **** **** {selectedOrder.customerInfo?.cardNumber?.slice(-4)}</span></div>
                  <div><span className="text-gray-500">Expiry:</span> <span className="font-semibold text-gray-900">{selectedOrder.customerInfo?.expiry}</span></div>
                </div>
              </div>

              {/* Products Ordered */}
              <div>
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Package className="w-5 h-5 text-primary" /> Products Ordered ({selectedOrder.items?.length || 0})
                </h3>
                <div className="space-y-3">
                  {selectedOrder.items?.map((item, idx) => (
                    <div key={idx} className="bg-white border border-gray-200 rounded-xl p-4 flex gap-4">
                      <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900 mb-1">{item.name}</h4>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {item.selectedSize && item.selectedSize !== 'One Size' && (
                            <span className="text-xs font-semibold bg-blue-50 text-blue-700 px-2 py-1 rounded">Size: {item.selectedSize}</span>
                          )}
                          {item.selectedTier !== undefined && item.priceTiers && (
                            <span className="text-xs font-semibold bg-green-50 text-green-700 px-2 py-1 rounded">
                              Tier: {item.priceTiers[item.selectedTier]?.qty}
                            </span>
                          )}
                          <span className="text-xs font-semibold bg-purple-50 text-purple-700 px-2 py-1 rounded">Qty: {item.quantity}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Unit Price: <span className="font-semibold text-gray-900">${item.price}</span></span>
                          <span className="text-gray-500">Subtotal: <span className="font-bold text-primary">${(item.price * item.quantity).toFixed(2)}</span></span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-primary/5 rounded-xl p-4">
                <h3 className="font-bold text-gray-900 mb-3">Order Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-gray-600">Subtotal:</span><span className="font-semibold">${(selectedOrder.total / 1.08).toFixed(2)}</span></div>
                  <div className="flex justify-between"><span className="text-gray-600">Tax (8%):</span><span className="font-semibold">${(selectedOrder.total - selectedOrder.total / 1.08).toFixed(2)}</span></div>
                  <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-2"><span>Total:</span><span className="text-primary">${selectedOrder.total?.toFixed(2)}</span></div>
                </div>
              </div>

              {/* Order Status */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div>
                  <span className="text-gray-500 text-sm">Order Status:</span>
                  <span className="ml-2 px-3 py-1 bg-yellow-50 text-yellow-700 border border-yellow-100 rounded-full text-xs font-bold">{selectedOrder.status}</span>
                </div>
                <div className="text-sm text-gray-500">
                  Order Date: {new Date(selectedOrder.date).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- Footer ---
const Footer = () => (
  <footer className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-gray-300 mt-auto">
    {/* Newsletter Section */}
    <div className="bg-gradient-to-r from-primary to-blue-600 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-white text-center md:text-left">
            <h3 className="text-2xl font-bold mb-2">Subscribe to Our Newsletter</h3>
            <p className="text-blue-100">Get exclusive deals, new arrivals, and industry insights delivered to your inbox.</p>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="flex-1 md:w-80 px-4 py-3 rounded-full text-gray-900 outline-none focus:ring-2 focus:ring-white"
            />
            <button className="px-6 py-3 bg-white text-primary font-bold rounded-full hover:bg-gray-100 transition-all hover:scale-105 shadow-lg">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>

    {/* Main Footer Content */}
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
        {/* Company Info */}
        <div className="lg:col-span-2">
          <Logo size="lg" />
          <p className="text-sm mt-4 mb-6 leading-relaxed">
            Connecting businesses worldwide with verified manufacturers and secure trade solutions. Your trusted B2B marketplace for quality products at competitive prices.
          </p>
          <div className="flex gap-3">
            <a href="#" className="w-10 h-10 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center transition-all hover:scale-110">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </a>
            <a href="#" className="w-10 h-10 bg-sky-500 hover:bg-sky-600 rounded-full flex items-center justify-center transition-all hover:scale-110">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
            </a>
            <a href="#" className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 rounded-full flex items-center justify-center transition-all hover:scale-110">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            </a>
            <a href="#" className="w-10 h-10 bg-blue-700 hover:bg-blue-800 rounded-full flex items-center justify-center transition-all hover:scale-110">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white font-bold mb-4 text-lg">Quick Links</h4>
          <ul className="space-y-3 text-sm">
            <li><Link to="/" className="hover:text-primary transition-colors flex items-center gap-2"><ChevronRight className="w-4 h-4" /> Home</Link></li>
            <li><Link to="/products" className="hover:text-primary transition-colors flex items-center gap-2"><ChevronRight className="w-4 h-4" /> All Products</Link></li>
            <li><Link to="/cart" className="hover:text-primary transition-colors flex items-center gap-2"><ChevronRight className="w-4 h-4" /> Shopping Cart</Link></li>
            <li><Link to="/login" className="hover:text-primary transition-colors flex items-center gap-2"><ChevronRight className="w-4 h-4" /> My Account</Link></li>
          </ul>
        </div>

        {/* Customer Service */}
        <div>
          <h4 className="text-white font-bold mb-4 text-lg">Customer Service</h4>
          <ul className="space-y-3 text-sm">
            <li><a href="#" className="hover:text-primary transition-colors flex items-center gap-2"><ChevronRight className="w-4 h-4" /> Help Center</a></li>
            <li><a href="#" className="hover:text-primary transition-colors flex items-center gap-2"><ChevronRight className="w-4 h-4" /> Returns & Refunds</a></li>
            <li><a href="#" className="hover:text-primary transition-colors flex items-center gap-2"><ChevronRight className="w-4 h-4" /> Shipping Info</a></li>
            <li><a href="#" className="hover:text-primary transition-colors flex items-center gap-2"><ChevronRight className="w-4 h-4" /> Track Order</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="text-white font-bold mb-4 text-lg">Contact Us</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <span>123 Business Avenue, Suite 100<br />Berlin, Germany 10115</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="w-5 h-5 text-primary flex-shrink-0" />
              <a href="tel:+15551234567" className="hover:text-primary transition-colors">+1 (555) 123-4567</a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-primary flex-shrink-0" />
              <a href="mailto:support@globaltrade.com" className="hover:text-primary transition-colors">support@globaltrade.com</a>
            </li>
            <li className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary flex-shrink-0" />
              <span>Mon-Fri: 9AM - 6PM (GMT)</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="border-t border-gray-700 pt-8 mb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-white font-semibold text-sm">Secure Payment</p>
              <p className="text-xs text-gray-400">256-bit SSL Encryption</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center flex-shrink-0">
              <Truck className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-white font-semibold text-sm">Free Shipping</p>
              <p className="text-xs text-gray-400">On orders over $500</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center flex-shrink-0">
              <Award className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-white font-semibold text-sm">Quality Assured</p>
              <p className="text-xs text-gray-400">Verified Suppliers</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center flex-shrink-0">
              <Headphones className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-white font-semibold text-sm">24/7 Support</p>
              <p className="text-xs text-gray-400">Dedicated Help Desk</p>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="border-t border-gray-700 pt-8 mb-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-400">We Accept:</p>
          <div className="flex items-center gap-3">
            <div className="px-3 py-2 bg-white rounded-lg shadow-sm">
              <span className="text-xs font-bold text-blue-600">VISA</span>
            </div>
            <div className="px-3 py-2 bg-white rounded-lg shadow-sm">
              <span className="text-xs font-bold text-red-600">MasterCard</span>
            </div>
            <div className="px-3 py-2 bg-white rounded-lg shadow-sm">
              <span className="text-xs font-bold text-blue-800">PayPal</span>
            </div>
            <div className="px-3 py-2 bg-white rounded-lg shadow-sm">
              <span className="text-xs font-bold text-black">Apple Pay</span>
            </div>
            <div className="px-3 py-2 bg-white rounded-lg shadow-sm">
              <span className="text-xs font-bold text-green-600">Google Pay</span>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-gray-700 pt-8 text-center">
        <p className="text-sm text-gray-400">
          © 2024 GlobalTrade B2B Marketplace. All rights reserved. | 
          <a href="#" className="hover:text-primary transition-colors ml-2">Privacy Policy</a> | 
          <a href="#" className="hover:text-primary transition-colors ml-2">Terms of Service</a> | 
          <a href="#" className="hover:text-primary transition-colors ml-2">Cookie Policy</a>
        </p>
      </div>
    </div>
  </footer>
);

// --- Protected Route ---
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user } = useContext(AuthContext);
  if (!user) return <Navigate to="/login" />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/" />;
  return children;
};

// --- Main App ---
export default function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <div className="min-h-screen flex flex-col bg-background">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/order-success" element={<OrderSuccess />} />
                <Route path="/login" element={<Login />} />
                <Route path="/admin" element={<ProtectedRoute adminOnly={true}><AdminDashboard /></ProtectedRoute>} />
              </Routes>
            </main>
            <Footer />
          </div>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}
