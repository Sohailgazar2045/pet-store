# 🐄 PasturePro Global Marketplace

> The gold standard for premium livestock and pet trading.

PasturePro is a state-of-the-art digital marketplace designed for verified traders, commercial livestock producers, and discerning pet lovers. Built with a focus on **trust**, **transparency**, and **premium aesthetics**, it provides a secure environment for high-value asset trading.

![PasturePro Banner](public/og-image.jpg)

## ✨ Key Features

- **🏆 Premium Design System**: A custom-built UI leveraging glassmorphism, OKLCH color spaces, and modern typography for a million-dollar feel.
- **🛡️ Secure Verification Protocol**: Integrated seller verification and identity matrix to ensure marketplace integrity.
- **📊 Real-time Market Intelligence**: Live analytics and trends for cattle and pet markets.
- **💬 Secure Messaging**: Direct, encrypted-style communication between verified buyers and sellers.
- **⚡ Pro Inventory Management**: Advanced dashboard for managing asset lifecycles, from submission to sale.
- **🔍 Intelligent Search**: High-performance filtering and keyword search powered by MongoDB indexing.

## 🛠️ Technical Architecture

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS with custom Glassmorphism utilities
- **Database**: MongoDB with Mongoose ODM
- **State Management**: Zustand & TanStack Query (React Query)
- **Authentication**: JWT with secure Middleware protection
- **Validation**: Zod Schema validation (API & Form level)
- **Icons**: Lucide React (Premium stroke-width)

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
CLOUDINARY_URL=your_cloudinary_url
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
- [x] SEO Optimization & Dynamic Metadata
- [x] Standardized Component Library
- [ ] Real-time Socket.io Notifications (In-progress)
- [ ] Multi-currency Institutional Support
- [ ] Mobile App (React Native) Integration

## ⚖️ License

Distributed under the MIT License. See `LICENSE` for more information.

---
© 2024 PasturePro Global Ltd. All rights reserved.
