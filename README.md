# CodeAlpha E-Commerce Store

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-v20%2B-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19.2-blue.svg)](https://react.dev/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-orange.svg)](https://www.mysql.com/)

A modern, full-stack e-commerce web application developed as part of the **CodeAlpha Internship**. Built with **React 19**, **TypeScript**, **Vite**, **Express.js**, and **MySQL**, this application delivers a high-performance shopping experience complete with user authentication, category browsing, product search & filtering, real-time cart management, seamless checkout, order tracking, wishlist support, and secure admin authorization.

---

## Features

- **User Authentication & Authorization**: Secure user registration, login, JWT token authentication, and bcrypt password hashing.
- **Role-Based Access Control (RBAC)**: Role separation between standard customers (`user`) and administrators (`admin`) with dedicated backend authorization middleware (`requireAdmin`).
- **Product Catalog Browsing**: Explore model-accurate products categorized under 7 major departments with badges (*Bestseller*, *Top Rated*, *Amazon Choice*, *Hot Deal*).
- **Search & Filtering System**: Multi-parameter search by title, brand, or description alongside price range filtering, category selection, rating filters, and sorting (price low/high, rating, recency).
- **Interactive Shopping Cart**: Dynamic cart management with stock limits, item quantity updates, real-time subtotal calculation, and persistence via MySQL backend.
- **Order Placement & Tracking**: Integrated checkout with shipping address inputs, payment method selection, auto-generated order numbers, order summary calculation, and user order history tracking.
- **Wishlist & Favorites**: Persistent wishlist toggle allowing users to save items across sessions.
- **Admin Management API**: Protected administrative endpoints (`/api/admin/stats`, `/api/admin/orders`) for system metrics and order oversight.
- **Responsive UI & Aesthetics**: Dark/light themed modern layout engineered with Tailwind CSS, custom glassmorphism effects, smooth animations, and Lucide React iconography.

---

## Technology Stack

### Frontend
- **React 19** – UI library for declarative component design
- **TypeScript** – Static type safety across components and contexts
- **Vite** – Next-generation fast frontend tooling and dev server
- **React Router DOM v7** – Declarative client-side routing
- **Tailwind CSS v4** – Utility-first CSS framework for custom responsive styling
- **Lucide React** – Clean, modern icon set

### Backend
- **Node.js** – JavaScript runtime environment
- **Express.js** – Flexible Web framework for REST API development
- **JSON Web Token (jwt)** – Stateless authentication and authorization
- **bcryptjs** – Secure password hashing
- **cors** – Cross-Origin Resource Sharing middleware
- **dotenv** – Environment variable management

### Database
- **MySQL 8.0** – Relational database management system
- **mysql2** – Fast, async/await MySQL driver with connection pooling

### Development Tooling
- **concurrently** – Parallel execution of frontend and backend servers
- **ESLint** – Code linting and style enforcement
- **npm** – Node package manager

---

## Project Structure

```text
CodeAlpha_EcommerceStore/
│
├── public/                  # Static assets and favicons
├── src/                     # React frontend source code
│   ├── assets/              # Static images and icons
│   ├── components/          # Reusable UI components (Navbar, Footer, ProductCard, etc.)
│   ├── contexts/            # React Context providers (AuthContext, StoreContext)
│   ├── lib/                 # Type definitions, utilities, and helpers
│   ├── pages/               # Application page views (Home, Products, Categories, Cart, Orders, etc.)
│   ├── App.css              # Custom styling definitions
│   ├── App.tsx              # Root component with page routes
│   ├── index.css            # Tailwind directives and theme configuration
│   └── main.tsx             # React application entry point
│
├── server/                  # Express backend source code
│   ├── db.js                # MySQL database connection pool & table initialization
│   ├── index.js             # Express API endpoints & authentication middleware
│   └── seedMySQL.js         # Auto-seeding script for categories and products
│
├── .env.example             # Template for required environment variables
├── .gitignore               # Excluded files for Git version control
├── package.json             # NPM dependencies and project scripts
├── package-lock.json        # Exact dependency lockfile
├── tsconfig.json            # TypeScript compiler configuration
├── vite.config.ts           # Vite dev server and API proxy configuration
└── README.md                # Project documentation
```

---

## Installation & Setup

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **MySQL Server**: v8.0 or higher running locally (default port `3306`)

### Step 1: Clone Repository
```powershell
git clone https://github.com/SanjayMurugan2025/CodeAlpha_EcommerceStore.git
cd CodeAlpha_EcommerceStore
```

### Step 2: Install Dependencies
```powershell
npm install
```

---

## Database Setup

1. Ensure your local **MySQL Server** service is active.
2. Create the target database (or allow auto-creation on server start):
   ```sql
   CREATE DATABASE IF NOT EXISTS codealpha_ecommerce;
   ```
3. The backend automatically initializes all required tables (`users`, `categories`, `products`, `cart`, `orders`) and seeds verified initial data if the tables are empty when starting the server.

---

## Environment Configuration

Copy the sample environment file to create your `.env` file:

```powershell
copy .env.example .env
```

Configure your local MySQL credentials and secret key in `.env`:

```env
PORT=5000

JWT_SECRET=your_jwt_secret_here

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password_here
DB_NAME=codealpha_ecommerce
```

> **Security Note**: Never commit your actual `.env` file to version control. It is listed in `.gitignore`.

---

## Running the Application

### Start Both Frontend and Backend (Recommended)
```powershell
npm run dev
```
This runs `node server/index.js` and `vite` concurrently.
- **Frontend App**: `http://localhost:5173`
- **Backend REST API**: `http://localhost:5000`

### Start Backend Only
```powershell
npm run server
```

### Start Frontend Only
```powershell
npm run client
```

---

## API Endpoints

### Authentication
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register a new user account | No |
| `POST` | `/api/auth/login` | Authenticate user & return JWT token | No |
| `GET` | `/api/auth/me` | Fetch authenticated user profile | Yes (User) |

### Categories & Products
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/categories` | List all product categories | No |
| `GET` | `/api/products` | Query products with filters, search, & pagination | No |
| `GET` | `/api/products/:id` | Get details for a specific product by ID | No |

### Shopping Cart
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/cart` | Get current user's shopping cart | Yes (User) |
| `POST` | `/api/cart` | Add product item to cart | Yes (User) |
| `PUT` | `/api/cart` | Update item quantity in cart | Yes (User) |
| `DELETE` | `/api/cart` | Remove item or clear cart | Yes (User) |

### Orders & Checkout
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/orders` | Place a new order and clear cart | Yes (User) |
| `GET` | `/api/orders` | Get user order history | Yes (User) |
| `GET` | `/api/orders/:id` | Get specific order details | Yes (User) |

### Admin Operations
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/admin/stats` | Get overview metrics (users, orders, sales) | Yes (Admin) |
| `GET` | `/api/admin/orders` | Fetch all orders across system | Yes (Admin) |

---

## Demo Credentials

The database auto-seeds default user accounts for quick testing and demonstration:

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Demo Customer** | `demo@codealpha.com` | `password123` | Standard Customer Shopping & Checkout |
| **Administrator** | `admin@codealpha.com` | `password123` | Full Admin API & Operational Access |

---

## Security Best Practices

- **Password Safety**: User passwords are encrypted using `bcryptjs` with a salt round factor of 10 prior to persistence.
- **JWT Authorization**: Requests to protected routes require a valid `Bearer` JSON Web Token.
- **Role Verification**: Admin endpoints enforce strict role checks via custom `requireAdmin` middleware.
- **Secret Isolation**: All credentials and tokens are injected via environment variables.

---

## Screenshots

*(Screenshots showcasing the Home Page, Products Catalog, Categories, and Cart Checkout can be viewed in the project repository artifacts).*

---

## Author & Acknowledgments

- **Author**: Sanjay Murugan
- **Project**: CodeAlpha Internship Project
- **Repository**: [https://github.com/SanjayMurugan2025/CodeAlpha_EcommerceStore](https://github.com/SanjayMurugan2025/CodeAlpha_EcommerceStore)
