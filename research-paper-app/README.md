# 📚 ResearchHub — Research Paper Management App

A full-stack web application for managing academic research papers, built with **Express.js**, **MongoDB**, and **EJS**.

---

## 🗂️ Project Structure

```
research-paper-app/
├── app.js                      # Express entry point
├── package.json
├── .env                        # Environment variables (do not commit)
├── .env.example                # Template for .env
├── .gitignore
│
├── config/
│   ├── db.js                   # MongoDB connection
│   └── session.js              # express-session + connect-mongo
│
├── controllers/
│   ├── authController.js       # Login, register, logout
│   ├── dashboardController.js  # Dashboard stats & charts
│   ├── paperController.js      # CRUD for research papers
│   ├── userController.js       # Admin user management
│   └── profileController.js   # Profile & password settings
│
├── middleware/
│   ├── auth.js                 # isAuthenticated, isAdmin guards
│   └── multer.js               # PDF & image upload config
│
├── models/
│   ├── User.js                 # Mongoose User schema
│   └── Paper.js                # Mongoose Paper schema
│
├── routes/
│   ├── auth.js                 # /auth/*
│   ├── dashboard.js            # /dashboard
│   ├── papers.js               # /papers/*
│   ├── users.js                # /users/*
│   └── profile.js              # /profile
│
├── views/
│   ├── partials/
│   │   ├── head.ejs            # HTML <head>
│   │   ├── sidebar.ejs         # Left navigation
│   │   ├── navbar.ejs          # Top bar
│   │   └── flash.ejs           # Alert messages
│   ├── auth/
│   │   ├── login.ejs
│   │   └── register.ejs
│   ├── dashboard/
│   │   └── index.ejs
│   ├── papers/
│   │   ├── index.ejs
│   │   ├── create.ejs
│   │   ├── show.ejs
│   │   └── edit.ejs
│   ├── users/
│   │   ├── index.ejs
│   │   └── edit.ejs
│   ├── profile/
│   │   └── index.ejs
│   ├── 404.ejs
│   └── 500.ejs
│
└── public/
    ├── css/main.css
    ├── js/
    │   ├── app.js
    │   └── dashboard.js
    └── uploads/               # Uploaded PDFs & profile pics
```

---

## ⚙️ Prerequisites

- **Node.js** v18+ — https://nodejs.org
- **npm** v9+
- A **MongoDB Atlas** account (free tier works perfectly) — https://mongodb.com/atlas

---

## 🌐 MongoDB Atlas Setup

1. Go to https://mongodb.com/atlas and sign in (or create a free account).
2. Click **"Build a Database"** → choose the **Free (M0)** shared tier.
3. Choose a cloud provider & region, then click **"Create Cluster"**.
4. Under **Security → Database Access**, click **"Add New Database User"**:
   - Username: e.g. `researchhub`
   - Password: generate a strong password
   - Role: **"Read and write to any database"**
   - Click **Add User**
5. Under **Security → Network Access**, click **"Add IP Address"**:
   - For development, click **"Allow Access From Anywhere"** (0.0.0.0/0)
   - For production, add only your server's IP
6. Under **Deployment → Database**, click **"Connect"** on your cluster:
   - Choose **"Drivers"** → Node.js
   - Copy the connection string, e.g.:
     ```
     mongodb+srv://researchhub:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
     ```
   - Replace `<password>` with your database user password
   - Add the database name before `?`, e.g.:
     ```
     mongodb+srv://researchhub:yourpass@cluster0.xxxxx.mongodb.net/research_papers?retryWrites=true&w=majority
     ```

---

## 🚀 Running Locally

### 1. Clone or download the project

```bash
git clone https://github.com/yourusername/research-paper-app.git
cd research-paper-app
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create your `.env` file

```bash
cp .env.example .env
```

Edit `.env` with your values:

```env
PORT=3000
MONGODB_URI=mongodb+srv://researchhub:yourpass@cluster0.xxxxx.mongodb.net/research_papers?retryWrites=true&w=majority
SESSION_SECRET=change_this_to_a_long_random_string_at_least_32_chars
NODE_ENV=development
```

> 💡 To generate a strong SESSION_SECRET, run:
> ```bash
> node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
> ```

### 4. Start the server

```bash
# Production mode
npm start

# Development mode (auto-restart on file changes — requires nodemon)
npm run dev
```

### 5. Open in browser

```
http://localhost:3000
```

You'll be redirected to the login page. Register your first account (choose **Admin** role to unlock all features), then log in.

---

## 📦 Dependencies

| Package | Purpose |
|---|---|
| `express` | Web framework |
| `mongoose` | MongoDB ODM |
| `express-session` | Session management |
| `connect-mongo` | Store sessions in MongoDB |
| `bcryptjs` | Password hashing |
| `multer` | File upload handling |
| `ejs` | Server-side templating |
| `dotenv` | Environment variables |
| `method-override` | PUT/DELETE in HTML forms |
| `express-flash` | Flash messages |

Dev dependency: `nodemon` for auto-restart during development.

---

## 🐙 GitHub Upload Instructions

### First time setup

```bash
# 1. Initialize git repository (inside your project folder)
cd research-paper-app
git init

# 2. Add all files (respects .gitignore — excludes node_modules, .env, uploads)
git add .

# 3. Make the initial commit
git commit -m "Initial commit: ResearchHub app"

# 4. Create a new repository on GitHub (via github.com — do NOT initialize with README)
#    Then copy the remote URL, e.g.: https://github.com/yourusername/research-paper-app.git

# 5. Add the remote
git remote add origin https://github.com/yourusername/research-paper-app.git

# 6. Rename branch to main and push
git branch -M main
git push -u origin main
```

### Subsequent pushes

```bash
git add .
git commit -m "Your commit message"
git push
```

---

## 🔐 Authentication & Roles

| Feature | User | Admin |
|---|---|---|
| Login / Register | ✅ | ✅ |
| View all papers | ✅ | ✅ |
| Upload papers | ✅ | ✅ |
| Edit/Delete own papers | ✅ | ✅ |
| Edit/Delete any paper | ❌ | ✅ |
| View user list | ❌ | ✅ |
| Change user roles | ❌ | ✅ |
| Delete users | ❌ | ✅ |
| Edit own profile | ✅ | ✅ |

---

## 📄 Paper Categories

- Artificial Intelligence
- Machine Learning
- Data Science
- Computer Vision
- Natural Language Processing
- Cybersecurity
- Networking
- Software Engineering
- Database Systems
- Human-Computer Interaction
- Other

---

## 📁 File Upload Limits

| Type | Max Size | Formats |
|---|---|---|
| Research PDF | 50 MB | `.pdf` only |
| Profile Picture | 5 MB | JPG, PNG, GIF, WEBP |

Uploaded files are stored in `public/uploads/` (PDFs) and `public/uploads/profiles/` (avatars). These directories are excluded from git via `.gitignore`.

---

## 🛡️ Security Notes

- Passwords are hashed with **bcryptjs** (12 salt rounds) — never stored in plaintext.
- Sessions are stored server-side in MongoDB — session IDs in cookies only.
- `httpOnly` cookies prevent JavaScript access to session cookies.
- Protected routes redirect to login if no valid session exists.
- Admin-only routes return 403 / redirect if the user isn't an admin.
- File uploads validate MIME type — PDFs and images only.
- For production, set `NODE_ENV=production` so cookies are `secure: true` (HTTPS only).

---

## 🔧 Common Issues

**MongoDB connection fails**
- Check your `MONGODB_URI` is correct in `.env`
- Confirm your IP is whitelisted in Atlas Network Access
- Make sure the database user credentials are correct

**"Cannot find module" errors**
- Run `npm install` again

**PDF not displaying in preview**
- Some browsers block inline PDFs; users can open in a new tab
- Check that `public/uploads/` is writable

**Sessions not persisting**
- Ensure `SESSION_SECRET` is set in `.env`
- Check MongoDB connection is healthy (sessions stored in Atlas)

---

## 📊 Dashboard Charts

The dashboard uses **Chart.js v4** (loaded from CDN) to render:
- **Bar chart** — papers uploaded per month (last 12 months)
- **Doughnut chart** — distribution of papers by category

Both charts update automatically as papers are added to the database.
