# 🚀 DevConnect

> **A full-stack MERN e-commerce platform built for developers** — featuring a developer marketplace, AI-powered assistant, Razorpay payment integration, role-based access (Buyer / Seller), and a modern React frontend.

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Data Models](#-data-models)
- [API Endpoints](#-api-endpoints)
- [Frontend Pages & Components](#-frontend-pages--components)
- [AI Chat (RAG Mode)](#-ai-chat-rag-mode)
- [Payment Flow (Razorpay)](#-payment-flow-razorpay)
- [Authentication & Authorization](#-authentication--authorization)
- [Environment Variables](#-environment-variables)
- [Getting Started](#-getting-started)

---

## 🌐 Overview

DevConnect is a **full-stack developer-focused e-commerce platform** where developers can both **buy and sell** products (tools, templates, packages, digital assets, etc.). The platform supports:

- **Role-based accounts** — every user is either a `buyer` or a `seller`
- **Seller Dashboard** — sellers can list, manage, update, and delete their products
- **Marketplace** — buyers can browse products, filter by category, and add items to cart
- **Cart & Orders** — full cart management with order placement and lifecycle tracking
- **Razorpay Payments** — real payment gateway integration with signature verification
- **AI Chat Assistant** — powered by Google Gemini; supports both general questions and RAG (Retrieval-Augmented Generation) mode using live database context
- **JWT Auth** — stateless, cookie-based authentication with bcrypt password hashing

---

## ✨ Features

| Feature | Details |
|---|---|
| 🔐 Authentication | Register, Login, Logout with JWT stored in HTTP-only cookies |
| 👤 User Roles | `buyer` and `seller` roles with role-based route protection |
| 🛒 Marketplace | Browse, search, and filter developer products |
| 🛍️ Cart System | Add/remove/update items; cart persists per user in MongoDB |
| 📦 Orders | Place orders from cart; track status: `pending → confirmed → shipped → delivered → cancelled` |
| 💳 Payments | Razorpay integration — create payment orders, verify HMAC signatures, update order status |
| 🤖 AI Assistant | Google Gemini-powered chat — general mode + RAG mode (answers using live DB data) |
| 🏪 Seller Dashboard | Full CRUD on products, revenue analytics, order management |
| 👤 Profile Page | View and update user profile (name, username, bio, avatar) |
| 🏥 Health Check | `GET /api/health` endpoint for server status monitoring |

---

## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| **Node.js** + **Express v5** | REST API server |
| **MongoDB** + **Mongoose** | Database & ODM |
| **JWT** (`jsonwebtoken`) | Stateless authentication tokens |
| **bcryptjs** | Password hashing (salt rounds: 10) |
| **Razorpay** (`razorpay`) | Payment gateway SDK |
| **@google/genai** | Google Gemini AI integration |
| **cookie-parser** | Parse HTTP-only JWT cookies |
| **cors** | Cross-origin resource sharing |
| **nodemon** | Auto-restart during development |

### Frontend
| Technology | Purpose |
|---|---|
| **React 19** | UI library |
| **Vite 8** | Lightning-fast build tool & dev server |
| **React Router DOM v7** | Client-side routing |
| **Axios** | HTTP client for API calls |
| **Lucide React** | Icon library |
| **Vanilla CSS** | Custom styling with CSS variables & animations |
| **oxlint** | Fast JavaScript linter |

---

## 📁 Project Structure

```
Dev_Connect/
├── client/                         # React Frontend (Vite)
│   ├── src/
│   │   ├── components/
│   │   │   ├── AiChat.jsx          # Floating AI chat widget (Gemini)
│   │   │   ├── AuthModal.jsx       # Login / Register modal
│   │   │   ├── Navbar.jsx          # Top navigation bar
│   │   │   ├── Payment.jsx         # Razorpay checkout component
│   │   │   └── ProductCard.jsx     # Reusable product card UI
│   │   ├── context/
│   │   │   ├── AuthContext.jsx     # Global auth state (user, token)
│   │   │   └── CartContext.jsx     # Global cart state
│   │   ├── pages/
│   │   │   ├── Marketplace.jsx     # Product listing & search page
│   │   │   ├── CartPage.jsx        # Shopping cart page
│   │   │   ├── OrdersPage.jsx      # User orders history & status
│   │   │   ├── ProfilePage.jsx     # User profile management
│   │   │   └── SellerDashboard.jsx # Seller product & order management
│   │   ├── App.jsx                 # Root component & route definitions
│   │   ├── api.js                  # Axios instance (base URL config)
│   │   ├── index.css               # Global styles & design system
│   │   └── main.jsx                # React entry point
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
└── server/                         # Node.js / Express Backend
    └── src/
        ├── ai/
        │   └── gemini.js           # Google Gemini AI client setup
        ├── config/
        │   ├── db.js               # MongoDB connection
        │   ├── env.js              # dotenv configuration loader
        │   └── razorpay.js         # Razorpay SDK initialization
        ├── controllers/
        │   ├── auth.controller.js  # Register, Login, Logout
        │   ├── cart.controller.js  # Add/remove/update cart items
        │   ├── chat.controller.js  # AI chat handler
        │   ├── order.controller.js # Place & manage orders
        │   ├── payment.controller.js # Razorpay order creation & verification
        │   ├── product.controller.js # Product CRUD
        │   └── user.controller.js  # Profile read & update
        ├── middlewares/
        │   ├── verifyToken.js      # JWT auth middleware
        │   └── sellerVerify.js     # Seller-only route guard
        ├── models/
        │   ├── User.js             # User schema
        │   ├── product.js          # Product schema
        │   ├── cart.js             # Cart schema
        │   ├── order.js            # Order schema
        │   └── payment.js          # Payment record schema
        ├── routes/
        │   ├── auth.routes.js      # /api/auth/*
        │   ├── user.routes.js      # /api/users/*
        │   ├── product.routes.js   # /api/products/*
        │   ├── cart.routes.js      # /api/cart/*
        │   ├── order.routes.js     # /api/orders/*
        │   ├── chat.routes.js      # /api/ai/*
        │   └── payment.route.js    # /api/payment/*
        ├── services/
        │   ├── chat.service.js     # Gemini prompt builder (RAG + General)
        │   └── payment.service.js  # HMAC-SHA256 signature verifier
        ├── utils/                  # Shared utility functions
        ├── app.js                  # Express app (middleware + routes)
        └── server.js               # Entry point — DB connect + server start
```

---

## 🗄️ Data Models

### User
| Field | Type | Rules |
|---|---|---|
| `name` | String | Required, 3–50 chars |
| `username` | String | Required, unique, 3–20 chars, lowercase |
| `email` | String | Required, unique, lowercase |
| `password` | String | Required, min 8 chars (bcrypt hashed) |
| `role` | String | `buyer` \| `seller`, default: `buyer` |
| `avatar` | Object | `{ public_id, url }` |
| `bio` | String | Max 200 chars |

> 🔑 Methods: `comparePassword()`, `generateToken()` (JWT)

---

### Product
| Field | Type | Rules |
|---|---|---|
| `productName` | String | Required, 2–50 chars |
| `productCode` | String | Required, unique, 2–20 chars |
| `productPrice` | Number | Required, ≥ 0 |
| `productImage` | Object | `{ Image_id, Image_url }` |
| `productDescription` | String | Required, 2–200 chars |
| `productDisscount` | Number | 0–100, default: 0 |
| `productCategory` | String | Required |
| `productStock` | Number | Required, ≥ 0 |
| `sellerId` | ObjectId | Ref: `User` |

---

### Order
| Field | Type | Rules |
|---|---|---|
| `userId` | ObjectId | Ref: `User`, Required |
| `items` | Array | `[{ productId, quantity, price }]` |
| `totalAmount` | Number | Required, ≥ 0 |
| `status` | String | `pending` → `confirmed` → `shipped` → `delivered` → `cancelled` |

---

### Payment
| Field | Type | Notes |
|---|---|---|
| `userId` | ObjectId | Ref: `User` |
| `orderId` | ObjectId | Ref: `Order` |
| `razorpayOrderId` | String | Razorpay-generated order ID |
| `razorpayPaymentId` | String | Populated after successful payment |
| `amount` | Number | In INR |
| `status` | String | `created` → `paid` |

---

### Cart
| Field | Type | Notes |
|---|---|---|
| `userId` | ObjectId | Ref: `User`, unique |
| `items` | Array | `[{ productId, quantity }]` |

---

## 🔌 API Endpoints

### Auth — `/api/auth`
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/register` | Create new user account | ❌ |
| POST | `/login` | Login & receive JWT cookie | ❌ |
| POST | `/logout` | Clear JWT cookie | ✅ |

### Users — `/api/users`
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/profile` | Get current user profile | ✅ |
| PUT | `/profile` | Update profile info | ✅ |

### Products — `/api/products`
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/` | Get all products (marketplace) | ❌ |
| GET | `/:id` | Get single product | ❌ |
| POST | `/` | Create product | ✅ Seller only |
| PUT | `/:id` | Update product | ✅ Seller only |
| DELETE | `/:id` | Delete product | ✅ Seller only |

### Cart — `/api/cart`
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/` | Get user's cart | ✅ |
| POST | `/add` | Add item to cart | ✅ |
| PUT | `/update` | Update item quantity | ✅ |
| DELETE | `/remove/:productId` | Remove item from cart | ✅ |

### Orders — `/api/orders`
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/place` | Place order from cart | ✅ |
| GET | `/my-orders` | Get user's orders | ✅ |
| GET | `/seller-orders` | Get orders for seller's products | ✅ Seller |
| PUT | `/:id/status` | Update order status | ✅ Seller |
| DELETE | `/:id` | Cancel order | ✅ |

### AI Chat — `/api/ai`
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/chat` | Send message to Gemini AI | ✅ |

### Payment — `/api/payment`
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/create-order` | Create Razorpay payment order | ✅ |
| POST | `/verify` | Verify Razorpay payment signature | ✅ |

### Health Check
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Server status check |

---

## 🖥️ Frontend Pages & Components

### Pages
| Page | Route | Description |
|---|---|---|
| `Marketplace` | `/` | Browse all products, search & filter by category |
| `CartPage` | `/cart` | View cart, update quantities, proceed to checkout |
| `OrdersPage` | `/orders` | View all personal orders and their statuses |
| `SellerDashboard` | `/seller` | Manage products, view seller-specific orders, analytics |
| `ProfilePage` | `/profile` | View & edit user profile |
| `Payment` | `/payment` | Razorpay checkout page |

### Components
| Component | Description |
|---|---|
| `Navbar` | Top bar with nav links, auth state, cart icon |
| `AuthModal` | Slide-in login/register form modal |
| `ProductCard` | Reusable card showing product info, price, discount, and add-to-cart |
| `AiChat` | Floating chat bubble — opens a full AI chat panel powered by Gemini |
| `Payment` | Handles Razorpay SDK loading, order creation, and payment callback |

### Context (Global State)
| Context | Provides |
|---|---|
| `AuthContext` | `user`, `isAuthenticated`, `login()`, `logout()`, `register()` |
| `CartContext` | `cart`, `addToCart()`, `removeFromCart()`, `updateQuantity()`, `clearCart()` |

---

## 🤖 AI Chat (RAG Mode)

The AI assistant uses **Google Gemini** (`@google/genai`) with two operating modes:

```
┌─────────────────────────────────────────┐
│              AI Chat Modes              │
├───────────────────┬─────────────────────┤
│  General Mode     │  RAG Mode           │
│  (no DB context)  │  (DB context injected) │
│                   │                     │
│  Answers general  │  Uses live user/    │
│  coding, shopping │  order/product data │
│  & platform Qs   │  from MongoDB to    │
│                   │  answer accurately  │
└───────────────────┴─────────────────────┘
```

- **RAG Mode** is triggered when database context (orders, products, cart) is fetched and passed along with the prompt.
- The AI is scoped to the **DevConnect platform** and formats currency as ₹ (INR).
- Model used: `gemini-3.6-flash`

---

## 💳 Payment Flow (Razorpay)

```
1. User places order  →  Order created in DB (status: "pending")
         ↓
2. POST /api/payment/create-order
   └─ Creates Razorpay order (amount × 100 for paise)
   └─ Payment record upserted in DB (status: "created")
         ↓
3. Razorpay SDK opens checkout on frontend
         ↓
4. POST /api/payment/verify
   └─ HMAC-SHA256 signature verified
   └─ Payment record updated (status: "paid")
   └─ Order status updated → "confirmed"
   └─ Cart cleared for the user
```

---

## 🔒 Authentication & Authorization

- **JWT** tokens are issued on login and stored in **HTTP-only cookies** (not accessible via JavaScript — XSS safe).
- `verifyToken.js` middleware decodes the JWT and attaches `req.user` to every protected request.
- `sellerVerify.js` middleware checks `req.user.role === "seller"` for seller-only routes.
- Passwords are hashed using **bcryptjs** with a salt factor of **10**.

```
Request → verifyToken middleware → req.user = { id, role }
                                        ↓
                              sellerVerify (if needed)
                                        ↓
                                   Controller
```

---

## 🔑 Environment Variables

Create a `.env` file inside the `server/` directory:

```env
# Server
PORT=5000
CLIENT_URL=http://localhost:5173

# MongoDB
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/devconnect

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d

# Razorpay
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_razorpay_secret

# Google Gemini
GEMINI_API_KEY=your_gemini_api_key
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js ≥ 18
- MongoDB Atlas account (or local MongoDB)
- Razorpay account (test mode keys)
- Google AI Studio API key (Gemini)

### 1. Clone & Install

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Configure Environment

Create `server/.env` with the variables listed above.

### 3. Run in Development

```bash
# Terminal 1 — Start backend (with nodemon)
cd server
npm run dev

# Terminal 2 — Start frontend (Vite dev server)
cd client
npm run dev
```

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/api/health

### 4. Build for Production

```bash
cd client
npm run build        # Outputs to client/dist/
```

---

## 👨‍💻 Author

**Himanshu Bhatt** — Full-stack Developer

---

## 📄 License

ISC License
