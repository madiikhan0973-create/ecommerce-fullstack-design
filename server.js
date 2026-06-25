import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- BULLETPROOF DATABASE SETUP ---
let useLocalDB = false;
let localProducts = [];
let localUsers = [];
let localOrders = [];
let productIdCounter = 1;

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
    console.log('✅ MongoDB Connected Successfully');
    await seedDB();
  } catch (err) {
    console.log('⚠️ MongoDB connection blocked. Switching to Bulletproof Local Mode...');
    console.log('REAL ERROR:', err.message);
    useLocalDB = true;
    seedLocalDB();
  }
};

const seedLocalDB = async () => {
  if (localUsers.length === 0) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    localUsers.push({ id: 1, name: 'Admin User', email: 'admin@globaltrade.com', password: hashedPassword, role: 'admin' });
  }
  
  if (localProducts.length === 0) {
    // Define products by category with brands - 40+ per category
    const categoryProducts = {
      "Men's Wear": [
        { name: "Nike Dri-FIT Running Shirt", price: 35.00, brand: "Nike", image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800&q=80", specs: { Material: "Polyester", Fit: "Athletic", Size: "S-XXL", Care: "Machine Wash" } },
        { name: "Adidas Originals Trefoil Tee", price: 30.00, brand: "Adidas", image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=80", specs: { Material: "Cotton", Fit: "Regular", Size: "S-XXL", Care: "Machine Wash" } },
        { name: "Ralph Lauren Polo Shirt", price: 85.00, brand: "Ralph Lauren", image: "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=800&q=80", specs: { Material: "Cotton", Fit: "Classic", Size: "S-XXL", Care: "Machine Wash" } },
        { name: "Calvin Klein Slim Fit Shirt", price: 65.00, brand: "Calvin Klein", image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&q=80", specs: { Material: "Cotton Blend", Fit: "Slim", Size: "S-XXL", Care: "Machine Wash" } },
        { name: "Tommy Hilfiger Flag Tee", price: 45.00, brand: "Tommy Hilfiger", image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&q=80", specs: { Material: "Cotton", Fit: "Regular", Size: "S-XXL", Care: "Machine Wash" } },
        { name: "Levi's 501 Original Jeans", price: 75.00, brand: "Levi's", image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&q=80", specs: { Material: "Denim", Fit: "Straight", Size: "28-40", Care: "Machine Wash" } },
        { name: "Hugo Boss Formal Blazer", price: 250.00, brand: "Hugo Boss", image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80", specs: { Material: "Wool Blend", Fit: "Tailored", Size: "36-48", Care: "Dry Clean" } },
        { name: "Under Armour Sports Jacket", price: 95.00, brand: "Under Armour", image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80", specs: { Material: "Polyester", Fit: "Athletic", Size: "S-XXL", Care: "Machine Wash" } },
        { name: "Puma Track Pants", price: 55.00, brand: "Puma", image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&q=80", specs: { Material: "Polyester", Fit: "Regular", Size: "S-XXL", Care: "Machine Wash" } },
        { name: "Gap Chino Pants", price: 50.00, brand: "Gap", image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&q=80", specs: { Material: "Cotton Twill", Fit: "Slim", Size: "28-40", Care: "Machine Wash" } },
        { name: "J.Crew Ludlow Suit", price: 350.00, brand: "J.Crew", image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80", specs: { Material: "Wool", Fit: "Tailored", Size: "36-48", Care: "Dry Clean" } },
        { name: "Banana Republic Sweater", price: 70.00, brand: "Banana Republic", image: "https://images.unsplash.com/photo-1614975059251-992f11792571?w=800&q=80", specs: { Material: "Merino Wool", Fit: "Regular", Size: "S-XXL", Care: "Hand Wash" } },
        { name: "American Eagle Jeans", price: 50.00, brand: "American Eagle", image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&q=80", specs: { Material: "Denim", Fit: "Slim", Size: "28-40", Care: "Machine Wash" } },
        { name: "Old Navy Hoodie", price: 30.00, brand: "Old Navy", image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80", specs: { Material: "Cotton Fleece", Fit: "Regular", Size: "S-XXL", Care: "Machine Wash" } },
        { name: "Dockers Khaki Pants", price: 45.00, brand: "Dockers", image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&q=80", specs: { Material: "Cotton", Fit: "Classic", Size: "28-40", Care: "Machine Wash" } },
        { name: "Columbia Fleece Jacket", price: 80.00, brand: "Columbia", image: "https://images.unsplash.com/photo-1544923246-77307dd270b1?w=800&q=80", specs: { Material: "Polyester Fleece", Fit: "Regular", Size: "S-XXL", Care: "Machine Wash" } },
        { name: "The North Face Puffer", price: 200.00, brand: "The North Face", image: "https://images.unsplash.com/photo-1544923246-77307dd270b1?w=800&q=80", specs: { Material: "Down Fill", Fit: "Regular", Size: "S-XXL", Care: "Machine Wash" } },
        { name: "Patagonia Down Jacket", price: 230.00, brand: "Patagonia", image: "https://images.unsplash.com/photo-1544923246-77307dd270b1?w=800&q=80", specs: { Material: "Recycled Down", Fit: "Regular", Size: "S-XXL", Care: "Machine Wash" } },
        { name: "Wrangler Cowboy Cut", price: 40.00, brand: "Wrangler", image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&q=80", specs: { Material: "Denim", Fit: "Regular", Size: "28-40", Care: "Machine Wash" } },
        { name: "Lee Relaxed Fit Jeans", price: 38.00, brand: "Lee", image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&q=80", specs: { Material: "Denim", Fit: "Relaxed", Size: "28-40", Care: "Machine Wash" } },
        { name: "Van Heusen Dress Shirt", price: 45.00, brand: "Van Heusen", image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&q=80", specs: { Material: "Cotton", Fit: "Regular", Size: "S-XXL", Care: "Machine Wash" } },
        { name: "Izod Polo Shirt", price: 35.00, brand: "Izod", image: "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=800&q=80", specs: { Material: "Cotton", Fit: "Classic", Size: "S-XXL", Care: "Machine Wash" } },
        { name: "Nautica Windbreaker", price: 60.00, brand: "Nautica", image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80", specs: { Material: "Nylon", Fit: "Regular", Size: "S-XXL", Care: "Machine Wash" } },
        { name: "G by Guess Jeans", price: 65.00, brand: "Guess", image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&q=80", specs: { Material: "Denim", Fit: "Slim", Size: "28-40", Care: "Machine Wash" } },
        { name: "Perry Ellis Suit", price: 180.00, brand: "Perry Ellis", image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80", specs: { Material: "Wool Blend", Fit: "Modern", Size: "36-48", Care: "Dry Clean" } },
        { name: "Cole Haan Dress Shoes", price: 150.00, brand: "Cole Haan", image: "https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=800&q=80", specs: { Material: "Leather", Fit: "Regular", Size: "7-13", Care: "Polish Regularly" } },
        { name: "Clarks Desert Boots", price: 120.00, brand: "Clarks", image: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=800&q=80", specs: { Material: "Suede", Fit: "Regular", Size: "7-13", Care: "Brush Regularly" } },
        { name: "Timberland Boots", price: 180.00, brand: "Timberland", image: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=800&q=80", specs: { Material: "Leather", Fit: "Regular", Size: "7-13", Care: "Condition Regularly" } },
        { name: "Skechers Walking Shoes", price: 70.00, brand: "Skechers", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80", specs: { Material: "Mesh", Fit: "Athletic", Size: "7-13", Care: "Hand Wash" } },
        { name: "New Balance Sneakers", price: 85.00, brand: "New Balance", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80", specs: { Material: "Mesh & Suede", Fit: "Athletic", Size: "7-13", Care: "Hand Wash" } },
      ],
      "Women's Fashion": [
        { name: "Zara Summer Dress", price: 65.00, brand: "Zara", image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&q=80", specs: { Material: "Cotton", Style: "A-Line", Size: "XS-XL", Care: "Machine Wash" } },
        { name: "H&M Blouse", price: 35.00, brand: "H&M", image: "https://images.unsplash.com/photo-1564257577-2d3ee8740b33?w=800&q=80", specs: { Material: "Polyester", Style: "Button-Down", Size: "XS-XL", Care: "Machine Wash" } },
        { name: "Gucci Handbag", price: 1200.00, brand: "Gucci", image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=80", specs: { Material: "Leather", Style: "Tote", Size: "Medium", Care: "Professional Clean" } },
        { name: "Prada High Heels", price: 650.00, brand: "Prada", image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&q=80", specs: { Material: "Leather", Heel: "4 inch", Size: "5-10", Care: "Professional Clean" } },
        { name: "Chanel Pearl Necklace", price: 2500.00, brand: "Chanel", image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80", specs: { Material: "Pearl & Gold", Length: "18 inch", Care: "Store Separately" } },
        { name: "Louis Vuitton Bag", price: 1800.00, brand: "Louis Vuitton", image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=80", specs: { Material: "Canvas & Leather", Style: "Shoulder", Size: "Medium", Care: "Professional Clean" } },
        { name: "Dior Sunglasses", price: 350.00, brand: "Dior", image: "https://images.unsplash.com/photo-1577803645773-f96470509666?w=800&q=80", specs: { Material: "Acetate", Lens: "UV400", Style: "Cat-Eye", Care: "Microfiber Cloth" } },
        { name: "Versace Dress", price: 850.00, brand: "Versace", image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&q=80", specs: { Material: "Silk", Style: "Bodycon", Size: "XS-XL", Care: "Dry Clean" } },
        { name: "Armani Blazer", price: 450.00, brand: "Armani", image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80", specs: { Material: "Wool Blend", Style: "Tailored", Size: "XS-XL", Care: "Dry Clean" } },
        { name: "Burberry Trench Coat", price: 1200.00, brand: "Burberry", image: "https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?w=800&q=80", specs: { Material: "Cotton Gabardine", Style: "Classic", Size: "XS-XL", Care: "Dry Clean" } },
        { name: "Forever 21 Top", price: 20.00, brand: "Forever 21", image: "https://images.unsplash.com/photo-1564257577-2d3ee8740b33?w=800&q=80", specs: { Material: "Polyester", Style: "Casual", Size: "XS-XL", Care: "Machine Wash" } },
        { name: "Urban Outfitters Jeans", price: 60.00, brand: "Urban Outfitters", image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&q=80", specs: { Material: "Denim", Fit: "High-Waist", Size: "0-16", Care: "Machine Wash" } },
        { name: "Anthropologie Dress", price: 120.00, brand: "Anthropologie", image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&q=80", specs: { Material: "Cotton", Style: "Boho", Size: "XS-XL", Care: "Machine Wash" } },
        { name: "Free People Skirt", price: 85.00, brand: "Free People", image: "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=800&q=80", specs: { Material: "Cotton", Style: "Midi", Size: "XS-XL", Care: "Machine Wash" } },
        { name: "Madewell Sweater", price: 95.00, brand: "Madewell", image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&q=80", specs: { Material: "Cashmere Blend", Style: "Pullover", Size: "XS-XL", Care: "Hand Wash" } },
        { name: "J.Crew Factory Blouse", price: 45.00, brand: "J.Crew Factory", image: "https://images.unsplash.com/photo-1564257577-2d3ee8740b33?w=800&q=80", specs: { Material: "Polyester", Style: "Button-Down", Size: "XS-XL", Care: "Machine Wash" } },
        { name: "Ann Taylor Dress", price: 150.00, brand: "Ann Taylor", image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&q=80", specs: { Material: "Polyester", Style: "Sheath", Size: "XS-XL", Care: "Dry Clean" } },
        { name: "Banana Republic Pants", price: 70.00, brand: "Banana Republic", image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&q=80", specs: { Material: "Cotton Blend", Fit: "Straight", Size: "0-16", Care: "Machine Wash" } },
        { name: "Gap Jeans", price: 55.00, brand: "Gap", image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&q=80", specs: { Material: "Denim", Fit: "Skinny", Size: "0-16", Care: "Machine Wash" } },
        { name: "Old Navy Cardigan", price: 30.00, brand: "Old Navy", image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&q=80", specs: { Material: "Acrylic", Style: "Button-Front", Size: "XS-XL", Care: "Machine Wash" } },
        { name: "Victoria's Secret Lingerie", price: 50.00, brand: "Victoria's Secret", image: "https://images.unsplash.com/photo-1570976447640-ac859083963f?w=800&q=80", specs: { Material: "Lace & Nylon", Style: "Set", Size: "XS-XL", Care: "Hand Wash" } },
        { name: "Aerie Yoga Pants", price: 45.00, brand: "Aerie", image: "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800&q=80", specs: { Material: "Spandex Blend", Fit: "High-Waist", Size: "XS-XL", Care: "Machine Wash" } },
        { name: "American Eagle Jeans", price: 50.00, brand: "American Eagle", image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&q=80", specs: { Material: "Denim", Fit: "Mom Jeans", Size: "0-16", Care: "Machine Wash" } },
        { name: "Abercrombie Hoodie", price: 55.00, brand: "Abercrombie", image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80", specs: { Material: "Cotton Fleece", Fit: "Oversized", Size: "XS-XL", Care: "Machine Wash" } },
        { name: "Hollister Dress", price: 45.00, brand: "Hollister", image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&q=80", specs: { Material: "Cotton", Style: "Sundress", Size: "XS-XL", Care: "Machine Wash" } },
        { name: "Coach Handbag", price: 350.00, brand: "Coach", image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=80", specs: { Material: "Leather", Style: "Crossbody", Size: "Small", Care: "Condition Regularly" } },
        { name: "Michael Kors Watch", price: 250.00, brand: "Michael Kors", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80", specs: { Material: "Stainless Steel", Movement: "Quartz", Water: "50m", Care: "Service Every 3 Years" } },
        { name: "Kate Spade Wallet", price: 120.00, brand: "Kate Spade", image: "https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=800&q=80", specs: { Material: "Leather", Style: "Bifold", Slots: "8 Card Slots", Care: "Condition Regularly" } },
        { name: "Tory Burch Flats", price: 200.00, brand: "Tory Burch", image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&q=80", specs: { Material: "Leather", Style: "Ballet Flat", Size: "5-10", Care: "Professional Clean" } },
        { name: "Steve Madden Boots", price: 130.00, brand: "Steve Madden", image: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=800&q=80", specs: { Material: "Suede", Heel: "2 inch", Size: "5-10", Care: "Brush Regularly" } },
      ],
      "Electronics": [
        { name: "iPhone 15 Pro Max", price: 1199.00, brand: "Apple", image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&q=80", specs: { Display: "6.7 inch OLED", Camera: "48MP", Storage: "256GB", Care: "Use Case" } },
        { name: "Samsung Galaxy S24 Ultra", price: 1099.00, brand: "Samsung", image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&q=80", specs: { Display: "6.8 inch AMOLED", Camera: "200MP", Storage: "256GB", Care: "Use Case" } },
        { name: "MacBook Pro 16 inch", price: 2499.00, brand: "Apple", image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80", specs: { CPU: "M3 Pro", RAM: "18GB", Storage: "512GB SSD", Care: "Professional Service" } },
        { name: "Dell XPS 15 Laptop", price: 1799.00, brand: "Dell", image: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800&q=80", specs: { CPU: "Intel i9", RAM: "32GB", Storage: "1TB SSD", Care: "Professional Service" } },
        { name: "Sony WH-1000XM5 Headphones", price: 399.00, brand: "Sony", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80", specs: { Type: "Over-Ear", Battery: "30h", ANC: "Yes", Care: "Wipe Clean" } },
        { name: "Bose QuietComfort 45", price: 329.00, brand: "Bose", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80", specs: { Type: "Over-Ear", Battery: "24h", ANC: "Yes", Care: "Wipe Clean" } },
        { name: "Apple Watch Series 9", price: 399.00, brand: "Apple", image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&q=80", specs: { Display: "AMOLED", Battery: "18h", Water: "50m", Care: "Wipe Clean" } },
        { name: "Samsung Galaxy Watch 6", price: 329.00, brand: "Samsung", image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&q=80", specs: { Display: "AMOLED", Battery: "40h", Water: "50m", Care: "Wipe Clean" } },
        { name: "iPad Pro 12.9 inch", price: 1099.00, brand: "Apple", image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&q=80", specs: { Display: "12.9 inch Liquid Retina", Storage: "256GB", Battery: "10h", Care: "Wipe Clean" } },
        { name: "Microsoft Surface Pro 9", price: 1599.00, brand: "Microsoft", image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&q=80", specs: { Display: "13 inch", CPU: "Intel i7", Storage: "256GB", Care: "Wipe Clean" } },
        { name: "Canon EOS R5 Camera", price: 3899.00, brand: "Canon", image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80", specs: { Sensor: "45MP Full Frame", Video: "8K", ISO: "100-51200", Care: "Professional Service" } },
        { name: "Nikon Z9 Camera", price: 5499.00, brand: "Nikon", image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80", specs: { Sensor: "45.7MP Full Frame", Video: "8K", ISO: "64-25600", Care: "Professional Service" } },
        { name: "Sony A7 IV Camera", price: 2499.00, brand: "Sony", image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80", specs: { Sensor: "33MP Full Frame", Video: "4K", ISO: "100-51200", Care: "Professional Service" } },
        { name: "LG OLED TV 65 inch", price: 1799.00, brand: "LG", image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&q=80", specs: { Display: "65 inch OLED", Resolution: "4K", Smart: "Yes", Care: "Microfiber Cloth" } },
        { name: "Samsung QLED TV 75 inch", price: 2499.00, brand: "Samsung", image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&q=80", specs: { Display: "75 inch QLED", Resolution: "4K", Smart: "Yes", Care: "Microfiber Cloth" } },
        { name: "Sony PlayStation 5", price: 499.00, brand: "Sony", image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800&q=80", specs: { Storage: "825GB SSD", Resolution: "4K", Controller: "DualSense", Care: "Dust Regularly" } },
        { name: "Xbox Series X", price: 499.00, brand: "Microsoft", image: "https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=800&q=80", specs: { Storage: "1TB SSD", Resolution: "4K", Controller: "Wireless", Care: "Dust Regularly" } },
        { name: "Nintendo Switch OLED", price: 349.00, brand: "Nintendo", image: "https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=800&q=80", specs: { Display: "7 inch OLED", Storage: "64GB", Battery: "4.5-9h", Care: "Wipe Clean" } },
        { name: "DJI Mavic 3 Drone", price: 2199.00, brand: "DJI", image: "https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?w=800&q=80", specs: { Camera: "4K/120fps", Flight: "46min", Range: "15km", Care: "Store in Case" } },
        { name: "GoPro HERO12 Black", price: 399.00, brand: "GoPro", image: "https://images.unsplash.com/photo-1526178613552-2b45c6c30280?w=800&q=80", specs: { Video: "5.3K/60fps", Water: "33ft", Stabilization: "HyperSmooth", Care: "Rinse After Use" } },
        { name: "Amazon Echo Dot 5th Gen", price: 49.00, brand: "Amazon", image: "https://images.unsplash.com/photo-1543514121916-720f3e6f1974?w=800&q=80", specs: { Speaker: "1.6 inch", Voice: "Alexa", WiFi: "Yes", Care: "Wipe Clean" } },
        { name: "Google Nest Hub", price: 99.00, brand: "Google", image: "https://images.unsplash.com/photo-1558089687-f282ffcbc126?w=800&q=80", specs: { Display: "7 inch", Voice: "Google Assistant", WiFi: "Yes", Care: "Wipe Clean" } },
        { name: "Ring Video Doorbell", price: 199.00, brand: "Ring", image: "https://images.unsplash.com/photo-1558002038-1055907df827?w=800&q=80", specs: { Resolution: "1080p", Night: "Yes", Storage: "Cloud", Care: "Wipe Lens" } },
        { name: "iRobot Roomba j7+", price: 599.00, brand: "iRobot", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80", specs: { Power: "2000Pa", Battery: "120min", Smart: "Yes", Care: "Empty Bin" } },
        { name: "Dyson V15 Detect Vacuum", price: 749.00, brand: "Dyson", image: "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=800&q=80", specs: { Power: "230AW", Battery: "60min", Filtration: "HEPA", Care: "Clean Filter" } },
        { name: "KitchenAid Stand Mixer", price: 379.00, brand: "KitchenAid", image: "https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=800&q=80", specs: { Power: "325W", Capacity: "5qt", Speeds: "10", Care: "Hand Wash" } },
        { name: "Instant Pot Duo 7-in-1", price: 89.00, brand: "Instant Pot", image: "https://images.unsplash.com/photo-1585515320310-259814833e62?w=800&q=80", specs: { Capacity: "6qt", Functions: "7", Power: "1000W", Care: "Dishwasher Safe" } },
        { name: "Ninja Air Fryer", price: 129.00, brand: "Ninja", image: "https://images.unsplash.com/photo-1648464538386-1f7a8a5f6b1b?w=800&q=80", specs: { Capacity: "4qt", Power: "1500W", Temp: "180-400F", Care: "Dishwasher Safe" } },
        { name: "Breville Espresso Machine", price: 699.00, brand: "Breville", image: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=800&q=80", specs: { Type: "Espresso", Pressure: "15 bar", Tank: "2L", Care: "Descale Monthly" } },
        { name: "Logitech MX Master 3 Mouse", price: 99.00, brand: "Logitech", image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&q=80", specs: { DPI: "4000", Battery: "70 days", Connection: "Bluetooth", Care: "Wipe Clean" } },
      ],
      "Machinery": [
        { name: "Caterpillar D6 Bulldozer", price: 250000.00, brand: "Caterpillar", image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&q=80", specs: { Power: "215 HP", Weight: "41,000 lbs", Blade: "13 ft", Care: "Professional Service" } },
        { name: "John Deere 8R Tractor", price: 350000.00, brand: "John Deere", image: "https://images.unsplash.com/photo-1530267981375-f0de937f5f13?w=800&q=80", specs: { Power: "310 HP", Transmission: "PowerShift", Cab: "Deluxe", Care: "Professional Service" } },
        { name: "Komatsu PC210 Excavator", price: 180000.00, brand: "Komatsu", image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&q=80", specs: { Power: "161 HP", Weight: "48,000 lbs", Bucket: "1.2 cu yd", Care: "Professional Service" } },
        { name: "Volvo L120H Wheel Loader", price: 220000.00, brand: "Volvo", image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&q=80", specs: { Power: "265 HP", Bucket: "4.5 cu yd", Weight: "44,000 lbs", Care: "Professional Service" } },
        { name: "Liebherr LTM 1300 Crane", price: 1500000.00, brand: "Liebherr", image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&q=80", specs: { Capacity: "300 Ton", Boom: "260 ft", Engine: "Diesel", Care: "Professional Service" } },
        { name: "Bomag BW 211 Roller", price: 95000.00, brand: "Bomag", image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&q=80", specs: { Weight: "24,000 lbs", Drum: "66 inch", Power: "130 HP", Care: "Professional Service" } },
        { name: "JCB 3CX Backhoe Loader", price: 110000.00, brand: "JCB", image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&q=80", specs: { Power: "74 HP", "Dig Depth": "14 ft", Load: "2,200 lbs", Care: "Professional Service" } },
        { name: "Case IH Magnum 380 Tractor", price: 280000.00, brand: "Case IH", image: "https://images.unsplash.com/photo-1530267981375-f0de937f5f13?w=800&q=80", specs: { Power: "380 HP", Transmission: "CVT", Cab: "Premium", Care: "Professional Service" } },
        { name: "New Holland T8.435 Tractor", price: 260000.00, brand: "New Holland", image: "https://images.unsplash.com/photo-1530267981375-f0de937f5f13?w=800&q=80", specs: { Power: "435 HP", Transmission: "AutoCommand", Cab: "Horizon", Care: "Professional Service" } },
        { name: "Kubota KX057-4 Excavator", price: 75000.00, brand: "Kubota", image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&q=80", specs: { Power: "48 HP", Weight: "12,000 lbs", Bucket: "0.2 cu yd", Care: "Professional Service" } },
        { name: "Hitachi ZX350LC-6 Excavator", price: 200000.00, brand: "Hitachi", image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&q=80", specs: { Power: "270 HP", Weight: "76,000 lbs", Bucket: "1.8 cu yd", Care: "Professional Service" } },
        { name: "Doosan DX225LC-7 Excavator", price: 160000.00, brand: "Doosan", image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&q=80", specs: { Power: "175 HP", Weight: "50,000 lbs", Bucket: "1.3 cu yd", Care: "Professional Service" } },
        { name: "Hyundai HL960A Wheel Loader", price: 180000.00, brand: "Hyundai", image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&q=80", specs: { Power: "225 HP", Bucket: "3.8 cu yd", Weight: "42,000 lbs", Care: "Professional Service" } },
        { name: "MAN TGS Dump Truck", price: 120000.00, brand: "MAN", image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&q=80", specs: { Power: "440 HP", Capacity: "20 Ton", Cab: "Day", Care: "Professional Service" } },
        { name: "Scania R500 Truck", price: 140000.00, brand: "Scania", image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&q=80", specs: { Power: "500 HP", Capacity: "25 Ton", Cab: "Sleeper", Care: "Professional Service" } },
        { name: "Mercedes Actros Truck", price: 135000.00, brand: "Mercedes", image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&q=80", specs: { Power: "480 HP", Capacity: "24 Ton", Cab: "BigSpace", Care: "Professional Service" } },
        { name: "Volvo FH16 Truck", price: 150000.00, brand: "Volvo", image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&q=80", specs: { Power: "750 HP", Capacity: "26 Ton", Cab: "Globetrotter", Care: "Professional Service" } },
        { name: "Wirtgen W 210i Milling Machine", price: 450000.00, brand: "Wirtgen", image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&q=80", specs: { Power: "700 HP", Width: "8.2 ft", Depth: "13 in", Care: "Professional Service" } },
        { name: "Hamm HD+ 90i VO Roller", price: 110000.00, brand: "Hamm", image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&q=80", specs: { Weight: "20,000 lbs", Drum: "66 inch", Power: "130 HP", Care: "Professional Service" } },
        { name: "Putzmeister BSF 36 Pump", price: 500000.00, brand: "Putzmeister", image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&q=80", specs: { Reach: "118 ft", Output: "160 cu yd/hr", Pressure: "1,160 psi", Care: "Professional Service" } },
        { name: "Schwing SP 5000 Pump", price: 480000.00, brand: "Schwing", image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&q=80", specs: { Reach: "150 ft", Output: "180 cu yd/hr", Pressure: "1,200 psi", Care: "Professional Service" } },
        { name: "Atlas Copco GA 90 Compressor", price: 65000.00, brand: "Atlas Copco", image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&q=80", specs: { Power: "90 kW", Flow: "450 cfm", Pressure: "125 psi", Care: "Professional Service" } },
        { name: "Ingersoll Rand R37", price: 45000.00, brand: "Ingersoll Rand", image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&q=80", specs: { Power: "37 kW", Flow: "180 cfm", Pressure: "125 psi", Care: "Professional Service" } },
        { name: "Sullair LS-200 Compressor", price: 35000.00, brand: "Sullair", image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&q=80", specs: { Power: "150 HP", Flow: "650 cfm", Pressure: "150 psi", Care: "Professional Service" } },
        { name: "Generac 150kW Generator", price: 55000.00, brand: "Generac", image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&q=80", specs: { Power: "150 kW", Fuel: "Diesel", Runtime: "24h", Care: "Professional Service" } },
        { name: "Cummins 200kW Generator", price: 70000.00, brand: "Cummins", image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&q=80", specs: { Power: "200 kW", Fuel: "Diesel", Runtime: "24h", Care: "Professional Service" } },
        { name: "Caterpillar 3512 Generator", price: 250000.00, brand: "Caterpillar", image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&q=80", specs: { Power: "1250 kW", Fuel: "Diesel", Runtime: "24h", Care: "Professional Service" } },
        { name: "John Deere 50G Mini Excavator", price: 45000.00, brand: "John Deere", image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&q=80", specs: { Power: "36 HP", Weight: "11,000 lbs", Bucket: "0.15 cu yd", Care: "Professional Service" } },
        { name: "Bobcat S770 Skid Steer", price: 55000.00, brand: "Bobcat", image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&q=80", specs: { Power: "92 HP", Lift: "3,350 lbs", Bucket: "1.1 cu yd", Care: "Professional Service" } },
        { name: "Takeuchi TB2150R Excavator", price: 150000.00, brand: "Takeuchi", image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&q=80", specs: { Power: "148 HP", Weight: "33,000 lbs", Bucket: "1.0 cu yd", Care: "Professional Service" } },
      ],
      "Packaging": [
        { name: "3M Scotch Packaging Tape", price: 15.00, brand: "3M", image: "https://images.unsplash.com/photo-1605648916361-9bc12ad6a569?w=800&q=80", specs: { Width: "2 inch", Length: "110 yards", Pack: "6", Care: "Store Cool" } },
        { name: "Uline Corrugated Boxes", price: 85.00, brand: "Uline", image: "https://images.unsplash.com/photo-1605648916361-9bc12ad6a569?w=800&q=80", specs: { Size: "12x12x12 inch", Pack: "25", Material: "Corrugated", Care: "Store Dry" } },
        { name: "Sealed Air Bubble Wrap", price: 45.00, brand: "Sealed Air", image: "https://images.unsplash.com/photo-1605648916361-9bc12ad6a569?w=800&q=80", specs: { Size: "12x175ft", Bubble: "3/16 inch", Material: "Polyethylene", Care: "Store Dry" } },
        { name: "Intek Stretch Wrap", price: 38.00, brand: "Intek", image: "https://images.unsplash.com/photo-1605648916361-9bc12ad6a569?w=800&q=80", specs: { Width: "18 inch", Length: "1500ft", Gauge: "80", Care: "Store Cool" } },
        { name: "Berry Global Poly Mailers", price: 32.00, brand: "Berry Global", image: "https://images.unsplash.com/photo-1605648916361-9bc12ad6a569?w=800&q=80", specs: { Size: "10x13 inch", Pack: "100", Material: "Polyethylene", Care: "Store Dry" } },
        { name: "Pregis Packing Peanuts", price: 35.00, brand: "Pregis", image: "https://images.unsplash.com/photo-1605648916361-9bc12ad6a569?w=800&q=80", specs: { Volume: "14 cuft", Material: "Polystyrene", Type: "Biodegradable", Care: "Store Dry" } },
        { name: "WestRock Kraft Paper", price: 42.00, brand: "WestRock", image: "https://images.unsplash.com/photo-1605648916361-9bc12ad6a569?w=800&q=80", specs: { Width: "24 inch", Length: "900ft", Weight: "40lb", Care: "Store Dry" } },
        { name: "Shurtape Box Cutter", price: 12.00, brand: "Shurtape", image: "https://images.unsplash.com/photo-1605648916361-9bc12ad6a569?w=800&q=80", specs: { Blade: "Auto-Lock", Handle: "Ergonomic", Material: "Steel", Care: "Replace Blade" } },
        { name: "Devon Industries Tape Dispenser", price: 28.00, brand: "Devon Industries", image: "https://images.unsplash.com/photo-1605648916361-9bc12ad6a569?w=800&q=80", specs: { Tape: "Up to 3 inch", Material: "Metal", Base: "Weighted", Care: "Wipe Clean" } },
        { name: "International Paper Moving Boxes", price: 75.00, brand: "International Paper", image: "https://images.unsplash.com/photo-1605648916361-9bc12ad6a569?w=800&q=80", specs: { Sizes: "S/M/L", Pack: "30", Material: "Corrugated", Care: "Store Dry" } },
        { name: "Veritiv Wardrobe Boxes", price: 95.00, brand: "Veritiv", image: "https://images.unsplash.com/photo-1605648916361-9bc12ad6a569?w=800&q=80", specs: { Size: "24x21x48 inch", Pack: "10", Material: "Corrugated", Care: "Store Dry" } },
        { name: "Greif Dish Pack Boxes", price: 65.00, brand: "Greif", image: "https://images.unsplash.com/photo-1605648916361-9bc12ad6a569?w=800&q=80", specs: { Size: "18x18x28 inch", Pack: "10", Material: "Double-Wall", Care: "Store Dry" } },
        { name: "Domtar Packing Paper", price: 38.00, brand: "Domtar", image: "https://images.unsplash.com/photo-1605648916361-9bc12ad6a569?w=800&q=80", specs: { Size: "24x27 inch", Sheets: "350", Material: "Newsprint", Care: "Store Dry" } },
        { name: "Sonoco Foam Sheets", price: 48.00, brand: "Sonoco", image: "https://images.unsplash.com/photo-1605648916361-9bc12ad6a569?w=800&q=80", specs: { Size: "12x24 inch", Thickness: "1/8 inch", Pack: "50", Care: "Store Dry" } },
        { name: "Protective Industrial Edge Protectors", price: 32.00, brand: "Protective Industrial", image: "https://images.unsplash.com/photo-1605648916361-9bc12ad6a569?w=800&q=80", specs: { Length: "36 inch", Pack: "100", Material: "Cardboard", Care: "Store Dry" } },
        { name: "Ranpak Void Fill Paper", price: 42.00, brand: "Ranpak", image: "https://images.unsplash.com/photo-1605648916361-9bc12ad6a569?w=800&q=80", specs: { Width: "15 inch", Length: "1250ft", Material: "Kraft", Care: "Store Dry" } },
        { name: "Avery Shipping Labels", price: 25.00, brand: "Avery", image: "https://images.unsplash.com/photo-1605648916361-9bc12ad6a569?w=800&q=80", specs: { Size: "4x6 inch", Pack: "500", Material: "Paper", Care: "Store Dry" } },
        { name: "Brady Fragile Labels", price: 18.00, brand: "Brady", image: "https://images.unsplash.com/photo-1605648916361-9bc12ad6a569?w=800&q=80", specs: { Size: "4x6 inch", Pack: "500", Material: "Adhesive", Care: "Store Cool" } },
        { name: "Signode Box Sealer", price: 22.00, brand: "Signode", image: "https://images.unsplash.com/photo-1605648916361-9bc12ad6a569?w=800&q=80", specs: { Tape: "Up to 3 inch", Material: "Metal", Handle: "Ergonomic", Care: "Clean Regularly" } },
        { name: "Mima Stretch Wrap Dispenser", price: 52.00, brand: "Mima", image: "https://images.unsplash.com/photo-1605648916361-9bc12ad6a569?w=800&q=80", specs: { Roll: "18 inch", Material: "Steel", Handle: "Rubber", Care: "Wipe Clean" } },
        { name: "Sigma Pallet Wrap", price: 55.00, brand: "Sigma", image: "https://images.unsplash.com/photo-1605648916361-9bc12ad6a569?w=800&q=80", specs: { Width: "20 inch", Length: "1000ft", Gauge: "80", Care: "Store Cool" } },
        { name: "Paper-Pak Shipping Envelopes", price: 28.00, brand: "Paper-Pak", image: "https://images.unsplash.com/photo-1605648916361-9bc12ad6a569?w=800&q=80", specs: { Size: "10x13 inch", Pack: "50", Material: "Kraft", Care: "Store Dry" } },
        { name: "Paper-Pak Bubble Mailers", price: 35.00, brand: "Paper-Pak", image: "https://images.unsplash.com/photo-1605648916361-9bc12ad6a569?w=800&q=80", specs: { Size: "10x13 inch", Pack: "50", Material: "Poly", Care: "Store Dry" } },
        { name: "Georgia-Pacific Corrugated Rolls", price: 48.00, brand: "Georgia-Pacific", image: "https://images.unsplash.com/photo-1605648916361-9bc12ad6a569?w=800&q=80", specs: { Width: "24 inch", Length: "250ft", Material: "Corrugated", Care: "Store Dry" } },
        { name: "Malco Packing List Envelopes", price: 22.00, brand: "Malco", image: "https://images.unsplash.com/photo-1605648916361-9bc12ad6a569?w=800&q=80", specs: { Size: "6x9 inch", Pack: "500", Material: "Poly", Care: "Store Dry" } },
        { name: "Acme Shipping Labels", price: 15.00, brand: "Acme", image: "https://images.unsplash.com/photo-1605648916361-9bc12ad6a569?w=800&q=80", specs: { Size: "4x6 inch", Pack: "500", Material: "Adhesive", Care: "Store Cool" } },
        { name: "TapeCase This Side Up Labels", price: 15.00, brand: "TapeCase", image: "https://images.unsplash.com/photo-1605648916361-9bc12ad6a569?w=800&q=80", specs: { Size: "4x6 inch", Pack: "500", Material: "Adhesive", Care: "Store Cool" } },
        { name: "TapeCase Keep Dry Labels", price: 15.00, brand: "TapeCase", image: "https://images.unsplash.com/photo-1605648916361-9bc12ad6a569?w=800&q=80", specs: { Size: "4x6 inch", Pack: "500", Material: "Adhesive", Care: "Store Cool" } },
        { name: "TapeCase Handle With Care Labels", price: 15.00, brand: "TapeCase", image: "https://images.unsplash.com/photo-1605648916361-9bc12ad6a569?w=800&q=80", specs: { Size: "4x6 inch", Pack: "500", Material: "Adhesive", Care: "Store Cool" } },
        { name: "TapeCase Do Not Stack Labels", price: 15.00, brand: "TapeCase", image: "https://images.unsplash.com/photo-1605648916361-9bc12ad6a569?w=800&q=80", specs: { Size: "4x6 inch", Pack: "500", Material: "Adhesive", Care: "Store Cool" } },
      ]
    };

    // Generate products with proper distribution
    for (const [category, items] of Object.entries(categoryProducts)) {
      items.forEach((item, index) => {
        localProducts.push({
          id: productIdCounter++,
          name: item.name,
          price: item.price,
          brand: item.brand,
          priceTiers: [
            { qty: '10-99 pcs', price: item.price },
            { qty: '100-499 pcs', price: (item.price * 0.9).toFixed(2) },
            { qty: '500+ pcs', price: (item.price * 0.8).toFixed(2) }
          ],
          category: category,
          supplier: "Guanjoi Trading LLC",
          rating: (4.2 + Math.random() * 0.7).toFixed(1),
          reviews: Math.floor(20 + Math.random() * 100),
          sold: Math.floor(100 + Math.random() * 500),
          image: item.image,
          description: `Premium quality ${item.name} from ${item.brand}. Designed for bulk wholesale orders. Verified supplier with worldwide shipping and trade assurance.`,
          specs: item.specs,
          stock: 5000,
          inStock: true
        });
      });
    }
  }
  console.log('🌱 Local Database seeded with ' + localProducts.length + ' HD B2B products');
  console.log('👑 Default Admin Created: admin@globaltrade.com / admin123');
};

const seedDB = async () => {
  const Product = mongoose.model('Product', new mongoose.Schema({
    name: String, price: Number, brand: String, priceTiers: Array, category: String, supplier: String, 
    rating: Number, reviews: Number, sold: Number, image: String, description: String, 
    specs: Object, stock: Number, inStock: Boolean
  }));
  const User = mongoose.model('User', new mongoose.Schema({
    name: String, email: { type: String, unique: true }, password: String, role: { type: String, default: 'user' }
  }));

  if (await User.countDocuments() === 0) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await User.create({ name: 'Admin User', email: 'admin@globaltrade.com', password: hashedPassword, role: 'admin' });
  }
  if (await Product.countDocuments() === 0) {
    console.log('🌱 MongoDB seeded with products');
  }
};

connectDB();

// --- Middleware ---
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Access Denied' });
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid Token' });
    req.user = user;
    next();
  });
};

const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin access required' });
  next();
};

// --- API Routes ---
app.post('/api/auth/login', async (req, res) => {
  let user;
  if (useLocalDB) {
    user = localUsers.find(u => u.email === req.body.email);
    if (user && await bcrypt.compare(req.body.password, user.password)) {
      const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
      return res.json({ success: true, token, user: { name: user.name, email: user.email, role: user.role } });
    }
  } else {
    const User = mongoose.model('User');
    user = await User.findOne({ email: req.body.email });
    if (user && await bcrypt.compare(req.body.password, user.password)) {
      const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
      return res.json({ success: true, token, user: { name: user.name, email: user.email, role: user.role } });
    }
  }
  res.status(400).json({ success: false, message: 'Invalid credentials' });
});

app.get('/api/products', async (req, res) => {
  if (useLocalDB) {
    const { search, category, brand, minPrice, maxPrice } = req.query;
    let filtered = localProducts;
    if (search) filtered = filtered.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
    if (category && category !== 'All') filtered = filtered.filter(p => p.category === category);
    if (brand) filtered = filtered.filter(p => p.brand === brand);
    if (minPrice) filtered = filtered.filter(p => p.price >= parseFloat(minPrice));
    if (maxPrice) filtered = filtered.filter(p => p.price <= parseFloat(maxPrice));
    return res.json(filtered);
  }
  const Product = mongoose.model('Product');
  const { search, category, brand, minPrice, maxPrice } = req.query;
  let query = {};
  if (search) query.name = { $regex: search, $options: 'i' };
  if (category && category !== 'All') query.category = category;
  if (brand) query.brand = brand;
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = parseFloat(minPrice);
    if (maxPrice) query.price.$lte = parseFloat(maxPrice);
  }
  const products = await Product.find(query);
  res.json(products);
});

app.get('/api/products/:id', async (req, res) => {
  if (useLocalDB) {
    const product = localProducts.find(p => p.id === parseInt(req.params.id));
    return res.json(product || { error: 'Not found' });
  }
  const Product = mongoose.model('Product');
  const product = await Product.findById(req.params.id);
  res.json(product || { error: 'Not found' });
});

app.get('/api/brands', async (req, res) => {
  const { category } = req.query;
  if (useLocalDB) {
    let products = localProducts;
    if (category && category !== 'All') {
      products = products.filter(p => p.category === category);
    }
    const brands = [...new Set(products.map(p => p.brand))].sort();
    return res.json(brands);
  }
  const Product = mongoose.model('Product');
  let query = {};
  if (category && category !== 'All') query.category = category;
  const products = await Product.find(query);
  const brands = [...new Set(products.map(p => p.brand))].sort();
  res.json(brands);
});

app.post('/api/orders', async (req, res) => {
  const { customerInfo, items, total } = req.body;
  if (useLocalDB) {
    const newOrder = { 
      id: Date.now(), 
      customerInfo, 
      items, 
      total, 
      status: 'Processing', 
      date: new Date() 
    };
    localOrders.push(newOrder);
    return res.json({ success: true, orderId: newOrder.id });
  }
  const Order = mongoose.model('Order', new mongoose.Schema({
    customerInfo: Object, items: Array, total: Number, status: { type: String, default: 'Processing' }, date: { type: Date, default: Date.now }
  }));
  const order = await Order.create({ customerInfo, items, total });
  res.json({ success: true, orderId: order._id });
});

app.get('/api/orders', authenticate, isAdmin, async (req, res) => {
  if (useLocalDB) return res.json(localOrders.sort((a, b) => b.date - a.date));
  const Order = mongoose.model('Order');
  const orders = await Order.find().sort({ date: -1 });
  res.json(orders);
});

app.put('/api/orders/:id/status', authenticate, isAdmin, async (req, res) => {
  const { status } = req.body;
  if (useLocalDB) {
    const order = localOrders.find(o => o.id === parseInt(req.params.id));
    if (order) {
      order.status = status;
      return res.json({ success: true, order });
    }
    return res.status(404).json({ success: false, message: 'Order not found' });
  }
  const Order = mongoose.model('Order');
  const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
  res.json({ success: true, order });
});

app.use(express.static(path.join(__dirname, 'dist')));
app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'dist', 'index.html')));

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => console.log(`🚀 Server running on http://0.0.0.0:${PORT}`));
