# Atharva Infotech | IT Products & Services Storefront

A full-stack web project for **Atharva Infotech**, an IT hardware and services business. It has two parts: a feature-rich single-page storefront (product catalog, PC builder, service booking and cart), and a REST API built with Node.js, Express and MongoDB for managing products and customer enquiries.

> **Project status:** Both the frontend and the backend work, but they are not connected yet. The storefront runs on built-in sample data and doesn't call the API. See [Current limitations](#current-limitations) and [Roadmap](#roadmap) for details.

---

## Contents

- [Features](#features)
- [Tech stack](#tech-stack)
- [Project structure](#project-structure)
- [Getting started](#getting-started)
- [Environment variables](#environment-variables)
- [Scripts](#scripts)
- [API reference](#api-reference)
- [Data models](#data-models)
- [Security](#security)
- [Current limitations](#current-limitations)
- [Roadmap](#roadmap)
- [Production checklist](#production-checklist)
- [License](#license)

---

## Features

### Storefront (`frontend/`)

- **Product catalog** with category and brand filters, a price slider, an in-stock toggle, text search, sorting, and grid or list views
- **Price comparison** that shows the store price next to a competitor's price
- **Cart** with quantity controls and promo code support
- **Wishlist** and **side-by-side product comparison**
- **EMI calculator** for financing a purchase (assumes 14% p.a., with a selectable tenure)
- **Custom PC Builder:** choose a CPU, GPU, RAM and storage, see the total price and estimated power draw, then add the build to your cart
- **IT services booking** that generates a ticket ID on confirmation
- **Service tracking** to look up a booking by its ticket ID
- **Multi-currency display** in INR, USD and EUR
- **WhatsApp and phone links** for quick quotes
- **Admin tab** for adding products to the in-browser catalog

### Backend API (`backend/`)

- Product endpoints with search, category and featured filters
- Public enquiry submission and admin-only enquiry management
- Token-protected admin routes
- Request hardening with Helmet, CORS and rate limiting
- Schema validation with Mongoose
- A seeding script that loads sample products

---

## Tech stack

| Layer    | Technology                                                                         |
| -------- | ---------------------------------------------------------------------------------- |
| Frontend | React 18 (UMD build via CDN), Babel Standalone, Tailwind CSS (CDN), Font Awesome   |
| Backend  | Node.js, Express 4                                                                 |
| Database | MongoDB with Mongoose 8                                                            |
| Security | Helmet, CORS, express-rate-limit                                                   |
| Tooling  | dotenv, nodemon                                                                    |

The frontend is a single `index.html` file with no build step, so any static file server can host it.

---

## Project structure

```
atharv-infotech/
├── backend/
│   ├── models/
│   │   ├── Enquiry.js        # Customer enquiry schema
│   │   └── Product.js        # Product schema
│   ├── routes/
│   │   ├── enquiries.js      # /api/enquiries routes
│   │   └── products.js       # /api/products routes
│   ├── seed.js               # Loads sample products into MongoDB
│   ├── server.js             # Express app entry point
│   └── package.json
├── frontend/
│   └── index.html            # Complete React storefront (single file)
└── README.md
```

---

## Getting started

### Prerequisites

- [Node.js](https://nodejs.org/) 18 or later
- MongoDB, either installed locally or hosted on a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster

### 1. Install backend dependencies

```bash
cd backend
npm install
```

### 2. Configure environment variables

Create a `.env` file inside `backend/`:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/atharv_infotech
ADMIN_TOKEN=replace-with-a-long-random-secret
FRONTEND_URL=http://127.0.0.1:5500
```

The server won't start if `MONGODB_URI` or `ADMIN_TOKEN` is missing. See [Environment variables](#environment-variables) for details.

### 3. Seed sample data (optional)

```bash
npm run seed
```

> **Warning:** The seed script deletes **all existing products** before inserting the sample set. Never run it against a database that holds real data.

### 4. Start the API

```bash
npm run dev      # development, restarts automatically with nodemon
# or
npm start        # production
```

To confirm it's running:

```bash
curl http://localhost:5000/api/health
# {"status":"ok","service":"Atharv Infotech API"}
```

### 5. Run the storefront

From the `frontend/` folder, serve the file with any static server:

```bash
npx serve .
```

The VS Code **Live Server** extension works too. Then open the URL printed in your terminal.

> The storefront loads React, Tailwind and Babel from public CDNs, so it needs an internet connection.

---

## Environment variables

| Variable       | Required | Default | Description                                                              |
| -------------- | :------: | ------- | ------------------------------------------------------------------------ |
| `MONGODB_URI`  | Yes      | None    | MongoDB connection string                                                |
| `ADMIN_TOKEN`  | Yes      | None    | Secret sent in the `x-admin-token` header to authorise admin requests    |
| `PORT`         | No       | `5000`  | Port the API listens on                                                  |
| `FRONTEND_URL` | No       | `*`     | Allowed CORS origin. Set it to your real frontend domain in production   |

---

## Scripts

Run these from the `backend/` directory.

| Command        | Description                                    |
| -------------- | ---------------------------------------------- |
| `npm start`    | Start the API with Node                        |
| `npm run dev`  | Start the API with nodemon (auto-reload)       |
| `npm run seed` | Replace all products with the sample data set  |

---

## API reference

**Base URL:** `http://localhost:5000/api`

Admin routes require this header:

```
x-admin-token: YOUR_ADMIN_TOKEN
```

### Health

| Method | Endpoint  | Access | Description          |
| ------ | --------- | ------ | -------------------- |
| GET    | `/health` | Public | Service health check |

### Products

| Method | Endpoint        | Access | Description                      |
| ------ | --------------- | ------ | -------------------------------- |
| GET    | `/products`     | Public | List products (supports filters) |
| GET    | `/products/:id` | Public | Get a single product             |
| POST   | `/products`     | Admin  | Create a product                 |
| PUT    | `/products/:id` | Admin  | Update a product                 |
| DELETE | `/products/:id` | Admin  | Delete a product                 |

**Query parameters for `GET /products`**

| Parameter  | Example              | Behaviour                                         |
| ---------- | -------------------- | ------------------------------------------------- |
| `category` | `?category=Printers` | Exact category match                              |
| `search`   | `?search=hp`         | Case-insensitive match on name, brand or category |
| `featured` | `?featured=true`     | Returns only featured products                    |

Results are sorted newest first.

### Enquiries

| Method | Endpoint         | Access | Description                      |
| ------ | ---------------- | ------ | -------------------------------- |
| POST   | `/enquiries`     | Public | Submit a customer enquiry        |
| GET    | `/enquiries`     | Admin  | List all enquiries, newest first |
| PATCH  | `/enquiries/:id` | Admin  | Update an enquiry's `status`     |
| DELETE | `/enquiries/:id` | Admin  | Delete an enquiry                |

**Example: submit an enquiry**

```bash
curl -X POST http://localhost:5000/api/enquiries \
  -H "Content-Type: application/json" \
  -d '{
        "name": "Rahul Sharma",
        "phone": "9876543210",
        "email": "rahul@example.com",
        "product": "HP LaserJet Pro Printer",
        "message": "Please share a bulk pricing quote."
      }'
```

`name`, `phone` and `message` are required.

**Example: create a product (admin)**

```bash
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -H "x-admin-token: YOUR_ADMIN_TOKEN" \
  -d '{
        "name": "1TB External HDD",
        "category": "Storage",
        "brand": "Seagate",
        "price": 4499,
        "description": "Portable USB 3.0 hard drive."
      }'
```

### Error responses

Errors are returned as JSON in the form `{ "message": "..." }`.

| Status | Meaning                                           |
| ------ | ------------------------------------------------- |
| 400    | Validation failed or invalid ID                   |
| 401    | Missing or incorrect admin token                  |
| 404    | Resource or route not found                       |
| 429    | Rate limit exceeded (300 requests per 15 minutes) |
| 500    | Server error                                      |

---

## Data models

### Product

| Field         | Type    | Notes                                                                                        |
| ------------- | ------- | -------------------------------------------------------------------------------------------- |
| `name`        | String  | Required                                                                                     |
| `category`    | String  | Required. One of `Printers`, `Monitors`, `Computers`, `Accessories`, `Storage`, `Networking` |
| `brand`       | String  | Optional                                                                                     |
| `price`       | Number  | Minimum 0                                                                                    |
| `description` | String  | Optional                                                                                     |
| `image`       | String  | Image URL. Defaults to empty                                                                 |
| `stock`       | Boolean | Defaults to `true`                                                                           |
| `featured`    | Boolean | Defaults to `false`                                                                          |

### Enquiry

| Field     | Type   | Notes                                    |
| --------- | ------ | ---------------------------------------- |
| `name`    | String | Required, max 100 characters             |
| `phone`   | String | Required, max 20 characters              |
| `email`   | String | Optional, lowercased, max 150 characters |
| `product` | String | Optional, max 200 characters             |
| `message` | String | Required, max 2000 characters            |
| `status`  | String | `new` (default), `contacted` or `closed` |

Both models include automatic `createdAt` and `updatedAt` timestamps.

---

## Security

Already in place:

- **Helmet** sets secure HTTP headers
- **Rate limiting** of 300 requests per 15 minutes per IP on all `/api/` routes
- **Request size limit** of 100 KB on JSON bodies
- **Schema validation** and field length limits through Mongoose
- **Required secrets:** the server won't start without `ADMIN_TOKEN` and `MONGODB_URI`

The gaps that remain are covered in the [Production checklist](#production-checklist).

---

## Current limitations

To be upfront about where the project stands today:

1. **The frontend doesn't call the backend.** Products, cart, wishlist, service tickets and the admin tab all run on in-memory data inside `index.html`, so anything added in the browser is lost on refresh.
2. **Category lists differ.** The storefront uses categories such as *Monitors & Displays* and *Projectors & Screens*, while the API accepts only `Printers`, `Monitors`, `Computers`, `Accessories`, `Storage` and `Networking`. They need to be aligned before the two are connected.
3. **Data shapes differ.** The storefront uses fields like `inStock` and `competitorPrice`, while the API uses `stock` and has no competitor price field.
4. **Checkout and service booking are simulated.** No orders or bookings are saved and no payment is processed.
5. **The in-app admin tab has no authentication** and is visible to every visitor.
6. **The "Supplier Integration API" dialog is a placeholder.** It shows example environment variables, but no distributor integration exists.
7. **Promo codes are hard-coded** in the frontend (a 10% discount) and validated only in the browser.
8. **The admin token is a single shared secret** compared as a plain string.
9. **The frontend compiles JSX in the browser** using Babel Standalone. That's convenient for prototyping, but it is slow and not recommended for production.

---

## Roadmap

Planned next steps, roughly in priority order:

- [ ] Connect the storefront to the API (fetch products, submit enquiries and service bookings)
- [ ] Align product categories and field names between the frontend and backend
- [ ] Add proper admin authentication (JWT or session-based login) and remove the public admin tab
- [ ] Store orders and service tickets in MongoDB
- [ ] Add a `.env.example` file to the backend
- [ ] Move the frontend to a build tool such as Vite, with Tailwind compiled locally
- [ ] Sanitise the `search` parameter, which is currently passed into a MongoDB regex
- [ ] Add automated tests for the API
- [ ] Integrate a payment gateway if online checkout is needed

---

## Production checklist

Before deploying publicly:

- [ ] Replace the demo phone number, email and location in `frontend/index.html`
- [ ] Replace the WhatsApp number (`919820055588`) with the business number everywhere it appears
- [ ] Set a long, random `ADMIN_TOKEN`
- [ ] Set `FRONTEND_URL` to the real frontend domain (the default `*` allows any origin)
- [ ] Serve everything over HTTPS
- [ ] Add a real admin login before exposing admin operations
- [ ] Add real product images
- [ ] Review the rate limit values against your expected traffic
- [ ] Back up the MongoDB database, and never run `npm run seed` against production data

---

## License

This repository doesn't include a license file yet. If you plan to share or open-source the project, add one (for example, MIT).
