# 🍛 KHAANPAAN - Premium Food Delivery Platform

![KhaanPaan Banner](frontend/public/hero_cover.png)

KhaanPaan is a state-of-the-art, full-stack food delivery application designed for a premium user experience. Built with the MERN stack, it features a dynamic menu, real-time inventory management, and a unique loyalty rewards system.

## 🌟 Unique Features

### 🪙 Loyalty Coin System
- **Earn as you Eat**: Users earn 5% of their order value back in "KP Coins".
- **Instant Redemption**: Redeem coins at checkout for direct discounts (1 KP Coin = ₹1).
- **Gamified Experience**: Visual coin balance with animations in the navbar.

### 🔍 Smart Search Engine
- **Instant Filtering**: Real-time search across dish names and categories.
- **Auto-Scroll**: Automatically scrolls to results for a seamless UX.
- **"No Results" Intelligence**: Polished feedback when no matches are found.

### 🌓 Advanced UI/UX
- **Dynamic Themes**: Full support for Dark and Light modes.
- **Rich Aesthetics**: Glassmorphic components, smooth transitions, and premium typography.
- **Responsive Design**: Optimized for mobile, tablet, and desktop.

### 🛠️ Admin Power-Tools
- **Inventory Control**: Toggle "In-Stock" status instantly; out-of-stock items are greyed out for users.
- **Smart Order Management**: Recent orders automatically prioritized at the top.
- **Revenue Tracking**: Full visibility into platform sales and performance.

---

## 🚀 Tech Stack

- **Frontend**: React.js, Context API, Vanilla CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose)
- **Payment**: Stripe API Integration
- **Authentication**: JWT (JSON Web Tokens) & Bcrypt

---

## 🛠️ Installation & Setup

### Prerequisites
- Node.js installed
- MongoDB installed locally or a MongoDB Atlas URI

### 1. Clone the Repository
```bash
git clone https://github.com/ayushgaur475/KHAANPAAN.git
cd KHAANPAAN
```

### 2. Backend Setup
```bash
cd backend
npm install
```
- Create a `.env` file in the `backend` folder (refer to `.env.example`).
- Add your `MONGODB_URI`, `JWT_SECRET`, and `STRIPE_SECRET_KEY`.

### 3. Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
```

### 4. Admin Setup
```bash
cd ../admin
npm install
npm run dev
```

---

## 📸 Screenshots

| Customer Menu | Admin Dashboard |
|---|---|
| ![Menu](frontend/src/assets/food_1.png) | ![Admin](frontend/src/assets/parcel_icon.png) |

---

## 🤝 Contributing
Contributions are welcome! Feel free to open an issue or submit a pull request.

## 📄 License
This project is licensed under the MIT License.

---
*Built with ❤️ by Ayush Gaur & Antigravity AI*
