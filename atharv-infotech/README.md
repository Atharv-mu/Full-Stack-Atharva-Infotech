# Atharv Infotech - Full Stack Electronics Website

## Stack
- Frontend: HTML, CSS, Vanilla JavaScript
- Backend: Node.js + Express
- Database: MongoDB + Mongoose

## 1. Install
Open a terminal in `backend`:

```bash
npm install
```

Install MongoDB locally, or create a MongoDB Atlas database.

## 2. Configure environment

Copy `.env.example` to `.env` and change:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/atharv_infotech
ADMIN_TOKEN=put-a-long-random-secret-here
FRONTEND_URL=http://127.0.0.1:5500
```

## 3. Seed sample products

```bash
npm run seed
```

## 4. Start backend

```bash
npm run dev
```

API:
`http://localhost:5000/api`

Health check:
`http://localhost:5000/api/health`

## 5. Start frontend

From the `frontend` folder, use VS Code Live Server or another static server.

For example:

```bash
npx serve .
```

Then open the URL shown by the command.

Do not open `index.html` directly with `file://` because browser CORS rules can prevent API requests.

## API endpoints

### Public
GET `/api/products`
GET `/api/products?category=Printers`
GET `/api/products?search=hp`
GET `/api/products/:id`
POST `/api/enquiries`

### Admin
Send the header:

`x-admin-token: YOUR_ADMIN_TOKEN`

POST `/api/products`
PUT `/api/products/:id`
DELETE `/api/products/:id`
GET `/api/enquiries`
PATCH `/api/enquiries/:id`
DELETE `/api/enquiries/:id`

## Important before production

1. Replace demo phone/email/location in `frontend/index.html`.
2. Replace the WhatsApp number.
3. Change `ADMIN_TOKEN`.
4. Use HTTPS.
5. Restrict CORS to the real frontend domain.
6. Add an actual admin login/JWT system before exposing admin operations publicly.
7. Add real product images.
8. Add payment/order functionality only if the client wants full e-commerce checkout.
