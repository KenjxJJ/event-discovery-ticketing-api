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

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/KenjxJJ/event-discovery-ticketing-api.git
   cd event-discovery-ticketing-api
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

### Environment Variables

Create a `.env` file in the root directory:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/event-ticketing?retryWrites=true&w=majority
```

### Running Locally

```bash
# Start in development mode (with nodemon or node --watch)
npm run dev

# Start in production mode
npm start
```

---

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
