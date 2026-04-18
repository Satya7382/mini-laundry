# Mini-Laundry Management System 🧺

A lightweight, premium full-stack application engineered to streamline daily operations for a dry cleaning and laundry business.

## 🔹 Setup Instructions

**Prerequisites:**
- Node.js (v18+)
- MongoDB running locally on `mongodb://127.0.0.1:27017`

### 1. Backend API configuration
1. Open a terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the node server (Runs on port `5001`):
   ```bash
   node server.js
   ```

### 2. Frontend Client configuration
1. Open a separate terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server (Runs on port `3000`):
   ```bash
   npm run dev
   ```

---

## 🔹 Features Implemented

- **Point-of-Sale Order System**: A dynamic form allowing operators to add varying garments (Shirts, Pants, etc.) along with quantity counters. It auto-calculates total billing amounts and guarantees a mathematically unrepeated `ORD-` ID.
- **Order Lifecycle Status Tracking**: Track laundry states sequentially (`RECEIVED`, `PROCESSING`, `READY`, `DELIVERED`).
- **Data Tables & Dual-Filtering**: Robust view encapsulating a table to list all orders natively filterable via regex status matching or customer profile text search (Name / Phone / ID).
- **Executive Dashboarding**: Automatically handles aggregation mathematically mapping sums of total revenue and order capacities into beautifully separated Glassmorphic analytics cards.
- **Premium Glassmorphic UI Aesthetics**: Engineered without heavy framework utilities (Vanilla CSS). Leverages deep, soft-pink linear gradients combined with translucid backdrop-filters, modern typography, hover transform cards, and dark slate legible typography.

---

## 🔹 AI Usage Report

**Which tools used:**
- Gemini (via the DeepMind Antigravity Coding Assistant context)
- GitHub Copilot / Cursor AI integrations (for minor ideation and autocomplete validation)
- ChatGPT (for minor ideation and autocomplete validation)

**Sample Prompts:**
- *"A dry cleaning store needs a lightweight system to manage daily orders..."*
- *"Okay, for the front end, use React-vite. For backend, use Node.js and Express.js, and for database use MongoDB"*
- *"change the port for frontend to 3000"*
- *"Now connect this website to Mongodb"*
- *"🧪 CRITICAL TEST (do this now) Open browser and go to: http://localhost:5000/api/orders ... Wait, I got HTTP ERROR 403"*
- *"Change the background colour to something attractive like light pink"*

**What AI Got Wrong:**
1. **JSX Template Escaping Syntax:** The AI coding agent over-escaped standard backticks (`\``) into string evaluations when scaffolding initial React Router `<NavLink />` elements due to internal generation processing, which crashed ESLint.
2. **Apple ControlCenter Port Conflict:** The AI originally scaffolded the application using `http://localhost:5000`. However, on macOS, port 5000 is occupied by Apple's AirPlay Receiver resulting in bizarre CORS and `HTTP 403 Forbidden` intercepts.
3. **Data Mutation Breakdown:** As human requirements modified the route returning an object (`{ data: [...] }`) instead of a raw array, the AI needed prompting to adapt the frontend React mapped states preventing `.map is not a function` faults.

**What we Improved:**
- Promptly removed backslashes enabling perfect React interpolation rendering.
- Dynamically migrated backend servers safely to Port `5001`.
- Adapted the `axios.get` call explicitly resolving `data.data` ensuring object wrapping discrepancies didn't break iteration mapping.

---

## 🔹 Tradeoffs

**What was skipped:**
- **User Authentication / RBAC (Role-Based Access):** Skipped adding JWT/OAuth. Anyone who accesses the console has full administrative permissions right now since the goal was specifically a lightweight MVP management console.
- **Redux / Complex State Management:** Intentionally omitted React Context / Redux to keep things light. Passing properties or straightforward `useState` effectively managed this application's scope efficiently.
- **Production Hosted Deployment Setup:** Intentionally kept `mongodb://127.0.0.1` locally rather than routing towards Mongo Atlas and generating Heroku/Vercel pipelines. 

**What I'd improve with more time:**
- Add SMS Notification triggers (Twilio integration) specifically when Operators flag an order as `READY`.
- Generate PDF / Printable invoices dynamically for physical paper trail matching the `ORD-` ticket ID.
- Create automated End-To-End (E2E) UI testing workflows using Cypress / Jest suites to lock route consistency.
- Implement true Docker Containerization via `docker-compose.yaml` streamlining absolute 1-click boot processes.
