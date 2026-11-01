# UniFind — Backend API

### Campus Lost & Found System | Project 2

> **DecodeLabs Full Stack Internship — Batch 2026**

---

## 📌 About

This repository contains the **REST API backend** for UniFind — a university Lost & Found platform. Built with Node.js and Express, using in-memory data storage (no database).

---

## 🗂️ Project Structure

```
project2/
├── server.js           → Express server entry point (Port 3000)
├── package.json        → Dependencies
├── test.http           → REST Client test file
└── routes/
    ├── items.js        → Items CRUD endpoints
    ├── auth.js         → Login & Register endpoints
    └── contact.js      → Contact message endpoint
```

---

## 🔌 API Endpoints

### Items

| Method | Endpoint         | Description     |
| ------ | ---------------- | --------------- |
| GET    | `/api/items`     | Get all items   |
| GET    | `/api/items/:id` | Get single item |
| POST   | `/api/items`     | Add new item    |

### Auth

| Method | Endpoint             | Description       |
| ------ | -------------------- | ----------------- |
| POST   | `/api/auth/register` | Register new user |
| POST   | `/api/auth/login`    | Login user        |

### Contact

| Method | Endpoint       | Description          |
| ------ | -------------- | -------------------- |
| POST   | `/api/contact` | Send contact message |

---

## 📦 Request Examples

**Register:**

```json
POST /api/auth/register
{
  "name": "Ahmed Khan",
  "email": "ahmed@university.edu",
  "password": "123456"
}
```

**Add Item:**

```json
POST /api/items
{
  "title": "Black iPhone 14",
  "category": "electronics",
  "status": "lost",
  "location": "Science Block",
  "description": "Lost near physics lab"
}
```

---

## ✅ Validation

- All required fields checked
- Email format validated
- Password minimum length enforced
- Duplicate email check on register
- Proper HTTP status codes (200, 201, 400, 401, 404, 500)

---

## 🚀 How to Run

```bash
# Install dependencies
npm install

# Start server
node server.js

# Server runs on
http://localhost:3000
```

---

## 🛠️ Tech Stack

- Node.js
- Express.js
- CORS
- In-memory data store (arrays)

---

## 👩‍💻 Built By

**Fareeha** — DecodeLabs Full Stack Internship, Batch 2026
