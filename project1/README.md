# UniFind — Frontend

### Campus Lost & Found System | Project 1

> **DecodeLabs Full Stack Internship — Batch 2026**

---

## 📌 About

UniFind is a university-based Lost & Found web platform. This repository contains the **frontend interface** built with pure HTML, CSS, and JavaScript — no heavy frameworks required.

---

## 🗂️ Project Structure

```
project1/
├── index.html          → Home page (Browse items, Hero, How It Works)
├── report.html         → Report lost or found item (Multer drag-and-drop preview)
├── item-detail.html    → Single item detail + Live Chat simulation + Claim modal
├── dashboard.html      → Student dashboard (listings, claims, stats)
├── login.html          → Login page with validation
├── register.html       → Register page with department & ID fields
├── css/
│   ├── style.css       → Global design system, components, layout
│   ├── pages.css       → Page-specific styles (dashboard, detail, report)
│   └── auth.css        → Login & Register styles
└── js/
    ├── config.js       → Central API base URL & dynamic session navbar
    ├── main.js         → Nav toggle, search, filter chips, API items load
    ├── report.js       → Report form validation + image upload
    ├── item-detail.js  → Item detail load, chat, claim modal
    ├── dashboard.js    → Dashboard data, delete, claims moderation
    └── auth.js         → Login & Register form + Bcrypt API connect
```

---

## ✨ Features

- 🔍 Browse & search lost/found items with category filters
- 📝 Report lost or found items with image uploads
- 💬 Real-time chat with item reporter
- 🙋 Claim system — "This is mine" or "I found this"
- 📊 Dashboard with real stats (items, users, returned counts)
- 🔐 Login & Register with client-side & server-side validation
- 📱 Fully responsive (mobile-first)
- ♿ Accessible (WCAG compliant, semantic HTML5)

---

## 🎨 Design

| Token | Value |
|---|---|
| Primary Color | Mocha Mousse `#A5856F` |
| Secondary Color | Ethereal Blue `#A0D4E0` |
| Background | Moonlit Grey `#F2F0EA` |
| Heading Font | Playfair Display |
| Body Font | DM Sans |

---

## 🔗 Backend Connection

This frontend connects dynamically to the **UniFind Database API** via `js/config.js`:
- **Local:** `http://localhost:4000` (auto-detected on localhost/127.0.0.1)
- **Live / Production:** Automatically uses `window.location.origin` (when deployed together with backend) or custom `PRODUCTION_BACKEND_URL` in `js/config.js`.

---

## 🚀 How to Run

1. Make sure the backend server (`project3`) is running on port `4000`
2. Open `index.html` in your browser (or use Live Server)

> No build tools or installations needed — pure HTML/CSS/JS!

---

## 🛠️ Tech Stack

- HTML5 (Semantic)
- CSS3 (Grid, Flexbox, CSS Variables)
- JavaScript (Vanilla, Async/Await, Fetch API)
- Lucide Icons

---

## 👩‍💻 Built By

**Fareeha** — DecodeLabs Full Stack Internship, Batch 2026
