# 🏠 GRIHO (গৃহ) — Bangladesh House & Flat Rental Platform

[![React](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![NodeJS](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB Atlas](https://img.shields.io/badge/Database-MongoDB%20Atlas-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/atlas)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**GRIHO (গৃহ)** is a full-stack web platform tailored specifically for the house and apartment rental ecosystem in Bangladesh. It connects verified landlords directly with prospective tenants (families, bachelor students, working women, and expats) with zero hidden brokerage fees.

---

## ✨ Features Built for Bangladesh

- **🇧🇩 Bangladesh Rental Specifics**:
  - Pricing in Bangladeshi Taka (**BDT ৳**) with service charge and refundable advance deposit calculation (2–3 months).
  - **Gas Connection Filter**: Titas Line Gas (*তিতাস গ্যাস*) vs. Cylinder (LPG) vs. Induction.
  - **Tenant Eligibility Filters**: Family Only (*পরিবার*), Bachelor Friendly (*ব্যাচেলর*), Female-Only (*ছাত্রী/মহিলা*), Any.
  - **Neighborhood Hierarchy**: Dhaka (*Gulshan, Dhanmondi, Bashundhara R/A, Uttara, Banani, Mirpur DOHS, Mohammadpur*) & Chittagong (*Nasirabad H/S, Agrabad*).
  - **Key Amenities**: South-Facing, Standby Generator, Lift/Elevator, 24/7 Security Guard, CCTV, Car Parking, Rooftop Access, Geyser.

- **💬 Direct Landlord WhatsApp & Calling**:
  - One-click **WhatsApp Chat** with pre-filled property inquiry text.
  - **Schedule Physical Visit** modal with date and time slot selection.

- **📊 Monthly Living Cost Calculator**:
  - Transparent monthly cost breakdown: `Rent + Service Charge + Est. Gas + Est. Electricity/Water = Total Monthly Expense`.

- **🏡 Landlord Listing Portal ("+ Post Property")**:
  - Multi-step wizard for property owners to publish listings with specs, amenities, and contact details.

- **❤️ Saved Favorites & Local Storage**:
  - Bookmark favorite apartments and compare specs side-by-side.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, Lucide Icons, Custom Glassmorphism CSS Design System
- **Backend**: Node.js, Express.js, CORS, Dotenv
- **Database**: MongoDB Atlas with Mongoose ODM

---

## 🚀 Getting Started

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB Atlas](https://www.mongodb.com/atlas) account or local MongoDB instance

### 2. Clone the Repository
```bash
git clone https://github.com/fahim110/GRIHO.git
cd GRIHO
```

### 3. Setup Environment Variables
Create a `.env` file in the root directory (or use `.env.example` as a template):
```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/griho_db?retryWrites=true&w=majority
```

### 4. Install Dependencies
```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### 5. Seed the Database with Realistic Sample Listings
```bash
npm run seed
```

### 6. Run the Application
```bash
# Run backend server (Port 5000)
npm run server

# Run frontend dev server (Port 5173)
npm run client
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📂 Project Structure

```
GRIHO/
├── client/                     # Vite + React Frontend
│   ├── src/
│   │   ├── components/         # Navbar, HeroSearch, FilterBar, PropertyCard, Modals, Footer
│   │   ├── api.js              # Frontend REST API client
│   │   ├── App.jsx             # Main Application Component
│   │   ├── index.css           # Glassmorphism & Bangladesh UI Tokens
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── server/                     # Express + Mongoose Backend
│   ├── config/
│   │   └── db.js               # MongoDB Atlas connection
│   ├── models/
│   │   ├── Property.js         # Bangladesh Property Schema
│   │   └── Inquiry.js          # Visit Booking Schema
│   ├── routes/
│   │   ├── properties.js       # Property CRUD & Search Filters API
│   │   └── inquiries.js        # Visit Inquiries API
│   ├── seed/
│   │   └── seedData.js         # Realistic Bangladesh Rental Seed Script
│   ├── index.js                # Server entry point
│   └── package.json
│
├── .env.example                # Environment variables template
├── .gitignore                  # Git ignore rules (protects credentials)
├── package.json                # Root convenience scripts
└── README.md                   # Documentation
```

---

## 📄 License
This project is licensed under the MIT License.
