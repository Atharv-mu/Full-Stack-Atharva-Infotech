# Atharva Infotech — IT Products & Services Storefront

A full-stack web project for **Atharva Infotech**, an IT hardware and services business. It consists of a feature-rich single-page storefront (catalog, PC builder, service booking, cart) and a REST API built with Node.js, Express and MongoDB for managing products and customer enquiries.

> **Project status:** The frontend and backend are both functional, but they are currently **independent of each other**. The storefront runs on built-in sample data and does not yet call the API. See [Current Limitations](#current-limitations) and [Roadmap](#roadmap).

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Data Models](#data-models)
- [Security](#security)
- [Current Limitations](#current-limitations)
- [Roadmap](#roadmap)
- [Production Checklist](#production-checklist)

---

## Features

### Storefront (`frontend/`)

- **Product catalog** with category and brand filters, price slider, in-stock toggle, text search, sorting, and grid/list views
- **Price-savings display** showing the store price against a competitor price
- **Cart** with quantity controls and promo code support
- **Wishlist** and **side-by-side product comparison**
- **EMI calculator** for financing a purchase (14% p.a. assumed, selectable tenure)
- **Custom PC Builder** — pick a CPU, GPU, RAM and storage; see total price and estimated power draw, then add the rig to the cart
- **IT services booking** with a ticket ID generated on confirmation
- **Service tracking** — look up a booking by ticket ID
- **Multi-currency display** (INR, USD, EUR)
- **WhatsApp and phone call-to-action** links for quick quotes
- **Admin tab** for adding products to the in-browser catalog

### Backend API (`backend/`)

- Product catalog endpoints with search, category and featured filters
- Customer enquiry submission (public) and enquiry management (admin)
- Token-protected admin routes
- Request hardening with Helmet, CORS and rate limiting
- Mongoose schema validation
- Database seeding script with sample products

---

## Tech Stack

| Layer      | Technology                                                                 |
| ---------- | -------------------------------------------------------------------------- |
| Frontend   | React 18 (UMD build via CDN), Babel Standalone, Tailwind CSS (CDN), Font Awesome |
| Backend    | Node.js, Express 4                                                         |
| Database   | MongoDB with Mongoose 8                                                    |
| Security   | Helmet, CORS, express-rate-limit                                           |
| Tooling    | dotenv, nodemon                                                            |

The frontend is a single `index.html` file with no build step, so it can be served by any static file server.

---

## Project Structure

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

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18 or later
- MongoDB — either a local installation or a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster

### 1. Install backend dependencies

```bash
cd backend
npm install
```

### 2. Configure environment variables

Create a file named `.env` inside `backend/`:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/atharv_infotech
ADMIN_TOKEN=replace-with-a-long-random-secret
FRONTEND_URL=http://127.0.0.1:5500
```

The server will refuse to start if `MONGODB_URI` or `ADMIN_TOKEN` is missing. See [Environment Variables](#environment-variables) for details.

### 3. Seed sample data (optional)

```bash
npm run seed
```

> ⚠️ **Warning:** the seed script deletes **all existing products** before inserting the sample set. Do not run it against a database that holds real data.

### 4. Start the API

```bash
npm run dev      # development, auto-restarts with nodemon
# or
npm start        # production
```

Verify that it is running:

```bash
curl http://localhost:5000/api/health
# {"status":"ok","service":"Atharv Infotech API"}
```

### 5. Run the storefront

From the `frontend/` folder, serve the file with any static server:

```bash
npx serve .
```

You can also use the VS Code **Live Server** extension. Then open the URL printed in the terminal.

> The storefront loads React, Tailwind and Babel from public CDNs, so an internet connection is required.

---

## Environment Variables

| Variable       | Required | Default | Description                                                                 |
| -------------- | :------: | ------- | --------------------------------------------------------------------------- |
| `MONGODB_URI`  | Yes      | —       | MongoDB connection string                                                   |
| `ADMIN_TOKEN`  | Yes      | —       | Secret sent in the `x-admin-token` header to authorise admin requests       |
| `PORT`         | No       | `5000`  | Port the API listens on                                                     |
| `FRONTEND_URL` | No       | `*`     | Allowed CORS origin. Set this to your real frontend domain in production    |

---

## API Reference

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

| Method | Endpoint         | Access | Description                      |
| ------ | ---------------- | ------ | -------------------------------- |
| GET    | `/products`      | Public | List products (supports filters) |
| GET    | `/products/:id`  | Public | Get a single product             |
| POST   | `/products`      | Admin  | Create a product                 |
| PUT    | `/products/:id`  | Admin  | Update a product                 |
| DELETE | `/products/:id`  | Admin  | Delete a product                 |

**Query parameters for `GET /products`**

| Parameter  | Example               | Behaviour                                                    |
| ---------- | --------------------- | ------------------------------------------------------------ |
| `category` | `?category=Printers`  | Exact category match                                         |
| `search`   | `?search=hp`          | Case-insensitive match on name, brand or category            |
| `featured` | `?featured=true`      | Returns only featured products                               |

Results are sorted newest first.

### Enquiries

| Method | Endpoint          | Access | Description                         |
| ------ | ----------------- | ------ | ----------------------------------- |
| POST   | `/enquiries`      | Public | Submit a customer enquiry           |
| GET    | `/enquiries`      | Admin  | List all enquiries, newest first    |
| PATCH  | `/enquiries/:id`  | Admin  | Update an enquiry's `status`        |
| DELETE | `/enquiries/:id`  | Admin  | Delete an enquiry                   |

**Example — submit an enquiry**

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

**Example — create a product (admin)**

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

All errors return JSON in the form `{ "message": "..." }`.

| Status | Meaning                                          |
| ------ | ------------------------------------------------ |
| 400    | Validation failed or invalid ID                  |
| 401    | Missing or incorrect admin token                 |
| 404    | Resource or route not found                      |
| 429    | Rate limit exceeded (300 requests per 15 minutes) |
| 500    | Server error                                     |

---

## Data Models

### Product

| Field         | Type    | Notes                                                                           |
| ------------- | ------- | ------------------------------------------------------------------------------- |
| `name`        | String  | Required                                                                        |
| `category`    | String  | Required. One of `Printers`, `Monitors`, `Computers`, `Accessories`, `Storage`, `Networking` |
| `brand`       | String  | Optional                                                                        |
| `price`       | Number  | Minimum 0                                                                       |
| `description` | String  | Optional                                                                        |
| `image`       | String  | Image URL, defaults to empty                                                    |
| `stock`       | Boolean | Defaults to `true`                                                              |
| `featured`    | Boolean | Defaults to `false`                                                             |

### Enquiry

| Field     | Type   | Notes                                              |
| --------- | ------ | -------------------------------------------------- |
| `name`    | String | Required, max 100 characters                       |
| `phone`   | String | Required, max 20 characters                        |
| `email`   | String | Optional, lowercased, max 150 characters           |
| `product` | String | Optional, max 200 characters                       |
| `message` | String | Required, max 2000 characters                      |
| `status`  | String | `new` (default), `contacted` or `closed`           |

Both models include automatic `createdAt` and `updatedAt` timestamps.

---

## Security

Measures already in place:

- **Helmet** sets secure HTTP headers
- **Rate limiting** of 300 requests per 15 minutes per IP on all `/api/` routes
- **Request size limit** of 100 KB on JSON bodies
- **Schema validation** and field length limits through Mongoose
- **Required secrets** — the server will not start without `ADMIN_TOKEN` and `MONGODB_URI`

Known gaps to address before going live are listed in the [Production Checklist](#production-checklist).

---

## Current Limitations

Being upfront about the current state of the project:

1. **The frontend does not call the backend.** Products, cart, wishlist, service tickets and the admin tab all run on in-memory data defined inside `index.html`. Anything added in the browser is lost on refresh.
2. **Category lists differ.** The storefront uses categories such as *Monitors & Displays* and *Projectors & Screens*, while the API accepts only `Printers`, `Monitors`, `Computers`, `Accessories`, `Storage` and `Networking`. These need to be aligned when the two are connected.
3. **Data shapes differ.** The storefront uses fields such as `inStock` and `competitorPrice`, whereas the API uses `stock` and has no competitor price field.
4. **Checkout and service booking are simulated.** No orders or bookings are saved, and no payment is processed.
5. **The in-app admin tab has no authentication.** It is visible to every visitor.
6. **The "Supplier Integration API" dialog is a placeholder** that shows example environment variables; no distributor integration exists.
7. **Promo codes are hard-coded** in the frontend (a 10% discount) and validated only in the browser.
8. **The admin token is a single shared secret** compared as a plain string.
9. **The frontend compiles JSX in the browser** with Babel Standalone, which is convenient for prototyping but slow and not recommended for production.

---

## Roadmap

Suggested next steps, roughly in priority order:

- [ ] Connect the storefront to the API (fetch products, submit enquiries and service bookings)
- [ ] Align product categories and field names between frontend and backend
- [ ] Add proper admin authentication (JWT or session-based login) and remove the public admin tab
- [ ] Persist orders and service tickets in MongoDB
- [ ] Add a `.env.example` file to the backend
- [ ] Move the frontend to a build tool such as Vite, with Tailwind compiled locally
- [ ] Add input sanitisation for the `search` parameter (it is currently passed into a MongoDB regex)
- [ ] Add automated tests for the API
- [ ] Integrate a payment gateway if online checkout is required

---

## Production Checklist

Before deploying publicly:

- [ ] Replace the demo phone number, email and location in `frontend/index.html`
- [ ] Replace the WhatsApp number (`919820055588`) with the business number everywhere it appears
- [ ] Set a long, random `ADMIN_TOKEN`
- [ ] Set `FRONTEND_URL` to the real frontend domain (the default `*` allows any origin)
- [ ] Serve everything over HTTPS
- [ ] Add a real admin login before exposing admin operations
- [ ] Add real product images
- [ ] Review the rate limit values for your expected traffic
- [ ] Back up the MongoDB database, and never run `npm run seed` against production data

---

## Scripts

Run these from the `backend/` directory.

| Command         | Description                                   |
| --------------- | --------------------------------------------- |
| `npm start`     | Start the API with Node                       |
| `npm run dev`   | Start the API with nodemon (auto-reload)      |
| `npm run seed`  | Replace all products with the sample data set |

---

## License

No license file is included in this repository. Add one (for example MIT) if you plan to share or open-source the project.
