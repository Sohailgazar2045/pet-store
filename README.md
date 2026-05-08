# 🐄 PasturePro Global Marketplace

> The gold standard for premium livestock and pet trading.

PasturePro is a state-of-the-art digital marketplace designed for verified traders, commercial livestock producers, and discerning pet lovers. Built with a focus on **trust**, **transparency**, and **premium aesthetics**, it provides a secure environment for high-value asset trading.

## ✨ Key Features

- **🏆 Premium Design System**: A "million-dollar" UI leveraging glassmorphism, OKLCH color spaces, and **Outfit** typography for an institutional-grade feel.
- **🛡️ Secure Verification Protocol**: Integrated seller verification and identity matrix to ensure marketplace integrity.
- **📊 Real-time Market Intelligence**: Live analytics visuals and trends for cattle and pet markets.
- **📁 Self-Contained Media Pipeline**: Professional local filesystem storage architecture, decoupled from third-party dependencies like Cloudinary.
- **⚡ Pro Inventory Management**: Advanced dashboard for managing asset lifecycles, from submission to sale.
- **🔍 Intelligent Search**: High-performance filtering and keyword search powered by MongoDB indexing.

## 🛠️ Technical Architecture

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS + Custom Design System tokens
- **Database**: MongoDB with Mongoose ODM
- **Storage**: Local Filesystem (Optimized Next.js Image Serving)
- **State Management**: Zustand & TanStack Query (React Query)
- **Authentication**: JWT with secure Middleware protection
- **Validation**: Zod Schema validation (API & Form level)

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/Sohailgazar2045/pet-store.git
cd pet-store
```

### 2. Configure Environment
Create a `.env.local` file in the root and add the following:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_ACCESS_SECRET=your_secret_key
JWT_REFRESH_SECRET=your_refresh_key
# No external media providers required - fully self-hosted
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Run Development Environment
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to access the marketplace.

## 📈 Production Roadmap

- [x] Premium Visual Identity & Glassmorphism
- [x] Admin Moderation & Analytics
- [x] Local Storage Media Architecture
- [x] SEO Optimization & Dynamic Metadata
- [x] Standardized Component Library
- [ ] Multi-currency Institutional Support
- [ ] AI-powered Livestock Assessment Integration
- [ ] Mobile App (React Native) Bridge

## ⚖️ License

Distributed under the MIT License. See `LICENSE` for more information.

---
© 2026 PasturePro Global Ltd. All rights reserved.
