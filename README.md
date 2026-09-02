# ⚡ Employee Management JWT System

A full-stack, secure Employee Management web application featuring **User Registration**, **User Login**, **Personalized User Welcome Dashboard**, **Logout**, **JWT Token Authentication**, **Password Hashing (bcrypt)**, and **Input Validation**.

Built with **Node.js, Express, SQLite, and Vite + React**.

---

## 🌟 Features & Highlights

1. **User Registration**
   - Interactive registration form with real-time validation (Full Name, Email, Password, Department).
   - Enforces unique email constraint to prevent duplicate accounts.
   - Secure password hashing with `bcryptjs` (salt factor 10) before database persistence.

2. **User Login**
   - Authenticates credentials against hashed passwords in SQLite database.
   - Generates signed JWT (JSON Web Token) sessions.
   - Comprehensive error messaging for invalid email or incorrect password.
   - Quick-fill demo credentials helper on the login page for effortless testing.

3. **Personalized Welcome Dashboard (`"Welcome, Omkar"`)**
   - Redirects to user-specific dashboard upon successful authentication.
   - Dynamically displays personalized welcome greeting: **"Welcome, Omkar"** (or logged-in user name).
   - Displays user profile metrics: Account ID, Email, Role, Department, Account Created Date.
   - Enforces user data privacy: Each logged-in user sees only their authorized information.

4. **Logout & Route Security**
   - Instant logout action clears stored JWT state.
   - Protected Route guards prevent unauthenticated users from accessing protected pages.

5. **Clean & Modern UI/UX**
   - Custom Glassmorphism design system using modern HSL color tokens.
   - Subtle micro-animations, loading spinners, responsive card layout.

---

## 🛠️ Technology Stack

- **Frontend**: Vite 5 + React 18, Lucide React Icons, Modern Vanilla CSS.
- **Backend**: Node.js + Express.js REST API.
- **Database**: SQLite (`sqlite3`) - Zero-config embedded SQL database engine.
- **Security & Auth**: `jsonwebtoken` (JWT), `bcryptjs` password hashing, CORS policies.

---

## 🔑 Test Credentials

The database is pre-seeded with sample test users. You can log in using any of the following credentials or register a new user:

| Name | Email Address | Password | Role / Department |
| :--- | :--- | :--- | :--- |
| **Omkar** | `omkar@example.com` | `password123` | Senior Engineer (Engineering) |
| **Alice Smith** | `alice@example.com` | `password123` | Product Manager (Product Dev) |
| **Bob Manager** | `bob@example.com` | `password123` | HR Director (Human Resources) |

*(Note: On the login page, you can also click the quick-fill buttons to test instantly!)*

---

## 🚀 How to Setup and Run

### Prerequisites
- **Node.js** (v18 or higher recommended)
- **npm** (v9 or higher)

---

### Step 1: Install Dependencies

From the root directory of the project, run:

```bash
npm run setup
```
*(This command installs node dependencies for both the backend server and frontend client automatically).*

Alternatively, install individually:
```bash
# Install root tools
npm install

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

---

### Step 2: Database Setup & Seeding

**No extra database installation is required!** 

The application uses an embedded SQLite database (`server/db/database.sqlite`). 
The database tables and pre-seeded test users are automatically generated when starting the backend server.

If you ever want to re-seed the database manually:
```bash
npm run seed
```

---

### Step 3: Run the Application

You can start both backend & frontend concurrently with a single command from the root directory:

```bash
npm run dev
```

This starts:
- **Backend Express Server**: `http://localhost:5000`
- **Frontend Vite Application**: `http://localhost:3000`

Now open `http://localhost:3000` in your web browser!

---

### Alternative: Running Backend and Frontend Separately

If you prefer running terminals separately:

**Terminal 1 (Backend Server):**
```bash
npm run server
```

**Terminal 2 (Frontend Client):**
```bash
npm run client
```

---

## 🌐 API Endpoints Reference

| Method | Endpoint | Protection | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register new user account with hashed password |
| `POST` | `/api/auth/login` | Public | Authenticate user & return JWT token |
| `GET` | `/api/auth/me` | Protected (JWT) | Return current logged-in user details |
| `GET` | `/api/user/dashboard` | Protected (JWT) | Return personalized dashboard stats & logs |
| `GET` | `/api/health` | Public | Backend health check endpoint |

---

## 📦 How to Push to Git Repository (GitHub / GitLab / Bitbucket)

To submit your project via a Git repository link:

1. **Initialize Git repository** (already initialized):
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Employee Management JWT System"
   ```

2. **Create a new repository on GitHub / GitLab / Bitbucket**.

3. **Link and push to remote repository**:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/employee-management-jwt-system.git
   git branch -M main
   git push -u origin main
   ```

---

## 🔐 Security & Best Practices Implemented

- **No Plaintext Passwords**: Passwords are salted and hashed using `bcryptjs` with 10 salt rounds prior to storing in the SQLite database.
- **JWT Authorization**: Requests to protected routes must supply a valid `Authorization: Bearer <TOKEN>` header.
- **Input Sanitization**: Email lowercasing and trimming prevents whitespace duplicates.
- **Protected Client Routes**: Unauthenticated users trying to access protected views are automatically redirected to Login.
