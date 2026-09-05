# Amazon SecStore - International E-Commerce Platform

Enterprise-grade international e-commerce web application inspired by Amazon's layout and design systems. Built specifically for commercial security, surveillance, telecom, access control, and energy systems with dual-currency conversion (USD & NGN), Paystack live payment, Supabase database storage, admin dashboard, and bulk Excel product ingestion.

---

## 🚀 Key Features

- **Amazon-Styled UI & Layout Architecture**:
  - Amazon dark top navigation (`#131921`) with `.secstore` branding, location picker modal, category-filtered search bar, 1-dropdown currency switcher, Account & Lists hover menu, Returns & Orders, and shopping cart counter badge.
  - Secondary navigation (`#232f3e`) with "All" hamburger drawer displaying all 16 enterprise security categories and sub-categories.
  - Amazon homepage featuring a rotating hero carousel, 4 overlapping quad cards, horizontal best-sellers carousel, 16-department directory, and enterprise shipping guarantees.
  - Amazon-style product detail view with multi-image gallery, specs, bullet points, and the Amazon Buy Box ("Add to Cart" and "Buy Now").
  - Filterable catalog with Amazon left sidebar filters (departments, sub-categories, star ratings, brands, price sorting, and pagination).
  
- **Dual-Currency Support (USD & NGN 1-Dropdown)**:
  - Default prices in US Dollars (`$ USD`) with a single dropdown to switch to Nigerian Naira (`₦ NGN`).
  - Exchange rate parsed dynamically on the server via `USD_TO_NGN_RATE` environment variable.

- **Automated Commercial PDF Invoices**:
  - Itemized electronic commercial tax invoice generation using `jspdf`.
  - Includes Amazon SecStore branding, order number, Paystack reference, customer billing/shipping details, SKU breakdown, VAT, and official authorization stamp.
  - Instant download upon checkout completion and accessible anytime via the **Orders** view.

- **Restricted Admin Technical Portal (`/admin` and `/admin/dashboard`)**:
  - **Login Route**: `/admin`
  - **Dashboard Route**: `/admin/dashboard`
  - Access secured via **Technical Email ID** and **Access Key** validated against server environment variables (`ADMIN_TECHNICAL_EMAIL` and `ADMIN_ACCESS_KEY`).
  - **Total Products Metric**: Stored products count is displayed only in the admin dashboard and hidden from the public storefront.
  - **Bulk Excel Upload**: Drag-and-drop ingestion of `.xlsx` and `.csv` files supporting thousands of products across 16 categories, complete with error reporting and downloadable template.
  - **Order & Product Management**: Real-time order fulfillment updates, catalog inventory editing, and system connectivity monitoring.

- **Supabase & Paystack Integrations**:
  - Designed for live Supabase database and authentication persistence with a resilient local JSON database fallback.
  - Live Paystack payment gateway initialization and reference verification.

---

## 🛠️ Technology Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS, Lucide React, Motion
- **Backend**: Node.js, Express, TypeScript (`tsx` / `esbuild`)
- **Persistence**: Supabase (`@supabase/supabase-js`) & local JSON fallback
- **Payments**: Paystack API (Dual-currency NGN / USD)
- **Utilities**: `jspdf` (PDF generation), `xlsx` (Excel spreadsheet parser), `bcryptjs`, `jsonwebtoken`

---

## ⚙️ Environment Variables

Configure these variables in your deployment environment or `.env`:

```env
# Gemini API Key (managed by AI Studio)
GEMINI_API_KEY=

# Hosted Application URL
APP_URL=

# Admin Technical Portal Credentials
ADMIN_TECHNICAL_EMAIL="admin@enterprise.sec"
ADMIN_ACCESS_KEY="YOUR_ADMIN_ACCESS_KEY"

# JWT Authentication Secret
JWT_SECRET="your-strong-jwt-secret-key-min-32-chars"

# Exchange Rate (USD to NGN)
USD_TO_NGN_RATE="1550"

# Supabase Integration (Optional - Falls back to local database)
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_ANON_KEY="your-supabase-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-supabase-service-role-key"

# Paystack Payment Gateway
PAYSTACK_SECRET_KEY="your-paystack-secret-key"
PAYSTACK_PUBLIC_KEY="your-paystack-public-key"
```

---

## 📦 Scripts

- `npm run dev`: Start local development server on port 3000
- `npm run build`: Compile client SPA and bundle backend into `dist/server.cjs`
- `npm run start`: Launch compiled production server
- `npm run lint`: Run TypeScript type-checking (`tsc --noEmit`)

---

## 📄 License

Apache-2.0
