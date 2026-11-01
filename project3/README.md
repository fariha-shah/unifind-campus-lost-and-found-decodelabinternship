# UniFind — Production Backend API

### Campus Lost & Found System | Project 3

> **DecodeLabs Full Stack Internship — Batch 2026**

---

## 📌 About

This repository contains the **production-ready database backend** for UniFind. Built with Node.js, Express, and MongoDB (Mongoose), featuring Bcrypt password encryption, Multer multipart image handling, and dynamic REST endpoints.

---

## 🗂️ Project Structure

```
project3/
├── server.js           → Express server entry point (Port 4000 / process.env.PORT)
├── db.js               → MongoDB connection handler with Mongoose
├── seed.js             → Database seeder with realistic demo data
├── package.json        → Dependencies & scripts (start, dev, seed)
├── .env.example        → Environment variable template
├── uploads/            → Uploaded item images storage
├── models/
│   ├── Item.js         → Item schema (title, category, status, location, image)
│   ├── User.js         → User schema (name, email, password, studentId, dept)
│   ├── Message.js      → Chat message schema (itemId, sender, text, type)
│   └── Claim.js        → Claim request schema (itemId, message, status)
└── routes/
    ├── items.js        → Items CRUD + Multer image upload & search
    ├── auth.js         → Register, Login (Bcrypt), User counts
    ├── messages.js     → Chat messages (save & load)
    └── claims.js       → Claim requests (submit, approve, reject)
```

---

## 🔌 API Endpoints

### Items
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/items` | Get all items (supports search, category, status queries) |
| `GET` | `/api/items/:id` | Get single item by ID |
| `POST` | `/api/items` | Add new item with image upload |
| `DELETE`| `/api/items/:id` | Delete item and associated image |

### Auth
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register new user with hashed password (Bcrypt) |
| `POST` | `/api/auth/login` | Login user & verify password |
| `GET` | `/api/auth/users/count` | Get total registered users |

### Messages
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/messages/:itemId`| Get chat history for item |
| `POST` | `/api/messages` | Save new chat message |

### Claims
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/claims` | Get all claims |
| `POST` | `/api/claims` | Submit new claim |
| `PUT` | `/api/claims/:id` | Approve or reject claim (approving updates item to 'returned') |

---

## 🚀 How to Run

```bash
# 1. Install dependencies
npm install

# 2. Seed realistic demo data
npm run seed

# 3. Start server
npm start

# Server runs on:
http://localhost:4000
```

---

## 🛠️ Tech Stack

- Node.js & Express.js
- MongoDB & Mongoose
- Bcrypt.js (Password hashing)
- Multer (Image file uploads)
- Dotenv (Environment configuration)
- CORS

---

## 👩‍💻 Built By

**Fareeha** — DecodeLabs Full Stack Internship, Batch 2026
