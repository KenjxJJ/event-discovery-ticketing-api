# Event Discovery & Ticketing API

A robust, concurrent-safe RESTful API for discovering local events, managing event schedules, and booking venue tickets with guaranteed zero-overbooking concurrency control.

[![Node.js Version](https://img.shields.io/badge/Node.js-v18+-green.svg)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-4.x-blue.svg)](https://expressjs.com/)
[![Database](https://img.shields.io/badge/MongoDB-Atlas-success.svg)](https://www.mongodb.com/atlas)


## Overview

The **Event Discovery & Ticketing API** serves as the backend engine for local event discovery and ticketing platforms. It empowers event organizers to create, update, and manage event schedules, while providing attendees with fast search, rich multi-criteria filtering, and seamless ticket reservation.

The platform guarantees strict venue capacity enforcement, ensuring that even under high concurrent traffic, no event can ever be overbooked.

---

## Technology Stack

- **Runtime**: [Node.js](https://nodejs.org/) (CommonJS)
- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: [MongoDB Atlas](https://www.mongodb.com/atlas) with [Mongoose ODM](https://mongoosejs.com/)
- **Validation**: [Joi](https://joi.dev/) / Mongoose Schema Validation
- **Environment Management**: `dotenv`
- **Deployment**: [Render.com](https://render.com/) (Web Service)

---

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/KenjxJJ/event-discovery-ticketing-api.git
   cd event-discovery-ticketing-api
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

## Environment Variables

Create a `.env` file in the root directory:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/event-ticketing?retryWrites=true&w=majority
```

## Running Locally

```bash
# Start in development mode (with nodemon or node --watch)
npm run dev

# Start in production mode
npm start
```

---

## API

All request and response bodies use JSON. Event dates must be valid future dates when creating an event or changing its date. Event creation accepts `title`, `category`, `city`, `venue`, `date`, `price`, and `capacity`; `description` and `status` are optional. Updates accept one or more of those fields, but `seatsBooked` is managed only by bookings. Capacity cannot be reduced below the number of seats already booked.

### Events

| Method | Path | Description |
| --- | --- | --- |
| `POST` | `/api/events` | Create an event; returns `201` and the event. |
| `GET` | `/api/events` | List events with pagination, sorting, search, and filters. |
| `GET` | `/api/events/:id` | Get an event, including `seatsRemaining`. |
| `PUT` | `/api/events/:id` | Update an event. |
| `DELETE` | `/api/events/:id` | Delete an event and its bookings. |
| `POST` | `/api/events/:id/book` | Reserve seats. |
| `GET` | `/api/events/:id/bookings` | List an event's bookings with pagination. |

List query parameters: `page` (default `1`), `limit` (default `10`, maximum `100`), `sort` (`date`, `-date`, `price`, `-price`, `title`, `-title`, `createdAt`, or `-createdAt`), `search` (matches event title and description), `city`, `category`, `from`, and `to`. Date-only `to` values include the full day. Results contain `data` and a `pagination` object with `page`, `limit`, `total`, and `totalPages`.

```http
GET /api/events?page=1&limit=10&sort=date&search=design&city=Lagos&from=2026-10-01&to=2026-10-31
```

```json
{
   "data": [],
   "pagination": { "page": 1, "limit": 10, "total": 0, "totalPages": 0 }
}
```

Create an event:

```json
{
   "title": "Lagos Product Meetup",
   "description": "Talks and networking for product teams.",
   "category": "Tech",
   "city": "Lagos",
   "venue": "Civic Centre",
   "date": "2027-05-20T17:00:00.000Z",
   "price": 5000,
   "capacity": 120
}
```

Book seats with `POST /api/events/:id/book`:

```json
{
   "attendeeName": "Ada Okafor",
   "attendeeEmail": "ada@example.com",
   "seats": 2
}
```

A successful booking returns `201` with the `booking` and updated `seatsRemaining`. Booking a cancelled or past event returns `400`, an unknown event returns `404`, and insufficient capacity returns `409`. Reservations use a conditional atomic MongoDB update, so concurrent requests cannot oversell the venue. Invalid input returns `400` with a `message` and field-level `errors` array.

## Deployment

### Deploying to Render.com

1. Create a new **Web Service** on [Render](https://render.com/).
2. Connect your GitHub repository: `KenjxJJ/event-discovery-ticketing-api`.
3. Configure the service settings:
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. In the **Environment Variables** tab, define:
   - `NODE_ENV`: `production`
   - `MONGODB_URI`: `<Your MongoDB Atlas Connection String>`
   - `PORT`: `3100` (or leave default to let Render bind to its port)

---
