# 🏠 GRIHO (গৃহ) — Bangladesh House & Flat Rental Platform

[![React](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![NodeJS](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB Atlas](https://img.shields.io/badge/Database-MongoDB%20Atlas-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/atlas)
[![Auth: JWT + bcrypt](https://img.shields.io/badge/Auth-JWT%20%2B%20Bcrypt-orange.svg)](https://jwt.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**GRIHO (গৃহ)** is a full-stack web platform tailored specifically for the house and apartment rental ecosystem in Bangladesh. It connects verified landlords directly with prospective tenants (families, bachelor students, working women, and expats) with zero hidden brokerage fees.

---

## ✨ Features Built for Bangladesh

- **🔐 User Authentication & Role System**:
  - **Tenant & Landlord Accounts** with secure JWT session tokens and `bcrypt` password hashing.
  - **NID Verification Badge** (National ID) for trusted community members.
  - User profile modal with saved property synchronization and role management.

- **🌐 Dual-Language Support (বাংলা / English)**:
  - 1-click bilingual toggle across all search filters, spec sheets, modals, and forms.

- **🇧🇩 Bangladesh Rental Specifics**:
  - Pricing in Bangladeshi Taka (**BDT ৳**) with service charge and refundable advance deposit calculation (2–3 months).
  - **Gas Connection Filter**: Titas Line Gas (*তিতাস গ্যাস*) vs. Cylinder (LPG) vs. Induction.
  - **Tenant Eligibility Filters**: Family Only (*পরিবার*), Bachelor Friendly (*ব্যাচেলর*), Female-Only (*ছাত্রী/মহিলা*), Any.
  - **Neighborhood Hierarchy**: Dhaka (*Gulshan, Dhanmondi, Bashundhara R/A, Uttara, Banani, Mirpur DOHS, Mohammadpur*) & Chittagong (*Nasirabad H/S, Agrabad*).
  - **Key Amenities**: South-Facing, Standby Generator, Lift/Elevator, 24/7 Security Guard, CCTV, Car Parking, Rooftop Access, Geyser.

- **🧮 Rent Affordability & Budget Calculator**:
  - Computes safe 30% monthly rent allocations and gives neighborhood recommendations based on income.

- **📄 Standard Bangladesh Tenancy Agreement Generator (ভাড়া চুক্তিপত্র)**:
  - Generates legal Bengali rental contracts with 1-click Copy and Print/PDF options.

- **⚖️ Side-by-Side Property Comparison**:
  - Compare up to 3 selected flats across rent, utilities, amenities, floor, and advance deposit.

- **🎓 Student & Bachelor Flatmate / Sublet Hub**:
  - Post and browse room seats and sublets in university hubs like Bashundhara (NSU/IUB) and Dhanmondi.

- **💬 Direct Landlord WhatsApp & Calling**:
  - One-click **WhatsApp Chat** with pre-filled property inquiry text.
  - **Schedule Physical Visit** modal with date and time slot selection.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, Lucide Icons, Custom Glassmorphism CSS Design System
- **Backend**: Node.js, Express.js, JWT, BcryptJS, CORS, Dotenv
- **Database**: MongoDB Atlas with Mongoose ODM

---

## 🚀 Getting Started

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB Atlas](https://www.mongodb.com/atlas) account

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
JWT_SECRET=your_jwt_secret_key
```

### 4. Install Dependencies
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 5. Seed the Database with Realistic Sample Listings
```bash
npm run seed
```

### 6. Run the Application
```bash
# Run backend server (Port 5000)
npm run backend

# Run frontend dev server (Port 5173)
npm run frontend
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📂 Project Structure

```
GRIHO/
├── frontend/                   # Vite + React Frontend
│   ├── src/
│   │   ├── components/         # Navbar, HeroSearch, FilterBar, PropertyCard, Modals, AuthModal
│   │   ├── context/            # AuthContext (login, register, session)
│   │   ├── api.js              # Frontend REST API client
│   │   ├── App.jsx             # Main Application Component
│   │   ├── translations.js     # English & Bengali Dictionary
│   │   ├── index.css           # Glassmorphism & Bangladesh UI Tokens
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── backend/                    # Express + Mongoose Backend
│   ├── config/
│   │   └── db.js               # MongoDB Atlas connection
│   ├── middleware/
│   │   └── auth.js             # JWT Protect Middleware
│   ├── models/
│   │   ├── User.js             # Tenant & Landlord User Model
│   │   ├── Property.js         # Bangladesh Property Schema
│   │   ├── Inquiry.js          # Visit Booking Schema
│   │   ├── Review.js           # Tenant Rating Schema
│   │   └── Roommate.js         # Sublet / Flatmate Schema
│   ├── routes/
│   │   ├── auth.js             # Register, Login, Profile & Save API
│   │   ├── properties.js       # Property CRUD & Search Filters API
│   │   ├── inquiries.js        # Visit Inquiries API
│   │   ├── reviews.js          # Property Reviews API
│   │   ├── roommates.js        # Flatmate Matching API
│   │   └── lease.js            # Lease Generator API
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
