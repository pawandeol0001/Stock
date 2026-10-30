# Stock Simplified — Vercel Demo Version

A student project built with a React + Vite frontend, Express API, MongoDB Atlas and JWT authentication. The Premium page includes a fully interactive **mock checkout UI** for classroom demonstrations.

## What is included

- Responsive stock-market learning website
- Registration/login, saved episodes and admin episode management
- Six sample plans: Free, Starter, Plus, Pro, Pro Annual and Lifetime
- Selectable UPI, card, net banking and wallet display options
- Demo checkout confirmation and local demo receipt
- Vercel deployment configuration for frontend and serverless API

## Important: payment is simulated

This version intentionally has **no payment gateway integration**. It does not connect to Razorpay, banks, UPI apps or card networks; it does not collect payment details; and it does not charge money. The “Simulate successful payment” button only stores a sample subscription/receipt in the current browser's local storage (`ss_demo_subscription`). This is suitable for a college project presentation. Do not describe a demo checkout as a real transaction.

No Razorpay account, PAN verification, Razorpay API keys or payment secrets are needed.

## Local setup (Windows PowerShell)

1. Install Node.js LTS and create a MongoDB Atlas database.
2. Copy `backend/.env.example` to `backend/.env` and set `MONGODB_URI`, `JWT_SECRET`, `CLIENT_URL`, `ADMIN_EMAIL` and `ADMIN_PASSWORD`.
3. In Terminal 1:
   ```powershell
   cd backend
   npm install
   npm run dev
   ```
4. In Terminal 2:
   ```powershell
   cd frontend
   npm install
   npm run dev
   ```
5. Open `http://localhost:5173`.

## Deploy on Vercel

1. Upload the complete extracted project to GitHub. Keep `backend/`, `frontend/` and the root `vercel.json` at the repository root.
2. In Vercel, import the GitHub repository. Set **Root Directory** to `./` (repository root), not `frontend`.
3. The root `vercel.json` installs both packages, builds `frontend`, serves `frontend/dist`, and routes `/api/*` to the Express serverless function.
4. Add these Vercel Environment Variables:
   - `MONGODB_URI` — your MongoDB Atlas connection string
   - `JWT_SECRET` — a long random secret (32+ characters)
   - `ADMIN_EMAIL` — your admin email
   - `ADMIN_PASSWORD` — a strong admin password
   - `CLIENT_URL` — your deployed Vercel URL, e.g. `https://your-project.vercel.app`
5. In MongoDB Atlas Network Access, allow access from your deployment environment as appropriate.
6. Deploy and test `https://your-project.vercel.app/api/health`, registration/login and the Premium demo checkout.

## Notes

- Do not upload `.env` files or commit secrets to GitHub.
- The frontend uses same-origin `/api` on Vercel; no `VITE_API_URL` is required for this setup.
- Demo checkout data is stored only in the visitor's browser and is not proof of payment or a server-side subscription.
- This is a learning product, not financial advice.
