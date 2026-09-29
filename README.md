# GoFit – MERN Fitness Tracking App

A full-stack fitness tracking application built with MongoDB, Express, React, and Node.js.

## Developer Information
- **Author:** Kandula Hema Narendra Reddy
- **Email:** kandhulanarendrareddy@gmail.com
- **GitHub:** [narendrareddy9100](https://github.com/narendrareddy9100)
- **LinkedIn:** [Kandula Hema Narendra Reddy](https://www.linkedin.com/in/kandhula-narendra-reddy-87615a421/)

---

## Features
- User registration/login/logout with bcrypt and JWT
- Protected user-specific routes
- Profile management (weight, height, age, fitness goals)
- Workout CRUD with history, calories burned, and duration
- Workout streak tracking (current streak & best streak)
- Daily water intake tracking with visual progress
- Weight tracking with dynamic progress chart and BMI calculator
- Fitness goals with customizable targets and progress bars
- Comprehensive Dashboard with summary metrics, recent activity, and insights
- Responsive, dark-themed modern UI

---

## Requirements
- **Node.js** (v18 or higher recommended)
- **npm** (v9 or higher)
- **MongoDB** (Local MongoDB instance or MongoDB Atlas cluster)

---

## Setup & Running Locally

### 1. Backend Setup
Open a terminal and navigate to the `backend` folder:
```bash
cd backend
npm install
```

Configure your environment file:
- On Windows:
  ```cmd
  copy .env.example .env
  ```
- On macOS / Linux:
  ```bash
  cp .env.example .env
  ```

Start the backend server:
```bash
npm run dev
# or: npm start
```
The backend will run on `http://localhost:5000`.

### 2. Frontend Setup
Open a second terminal and navigate to the `frontend` folder:
```bash
cd frontend
npm install
```

Configure your environment file (optional for local running, defaults to `http://localhost:5000/api`):
- On Windows:
  ```cmd
  copy .env.example .env
  ```
- On macOS / Linux:
  ```bash
  cp .env.example .env
  ```

Start the frontend Vite development server:
```bash
npm run dev
```
The frontend will run on `http://localhost:5173`.

---

## Environment Variables

### Backend (`backend/.env`)
| Variable | Description | Default / Example |
| :--- | :--- | :--- |
| `PORT` | Port for the Express server | `5000` |
| `MONGO_URI` | MongoDB connection URI | `mongodb://127.0.0.1:27017/gofit` |
| `JWT_SECRET` | Secret key used for signing JWT authentication tokens | `your_jwt_secret_key_here` |
| `JWT_EXPIRES_IN` | Expiration time for JWT tokens | `7d` |
| `CLIENT_URL` | Allowed client origin for CORS | `http://localhost:5173` |

### Frontend (`frontend/.env`)
| Variable | Description | Default / Example |
| :--- | :--- | :--- |
| `VITE_API_URL` | Base API URL for backend requests | `http://localhost:5000/api` |

---

## Project Structure
```text
GoFit/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── goalController.js
│   │   ├── userController.js
│   │   ├── waterController.js
│   │   ├── weightController.js
│   │   └── workoutController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── Goal.js
│   │   ├── User.js
│   │   ├── Water.js
│   │   ├── Weight.js
│   │   └── Workout.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── goalRoutes.js
│   │   ├── userRoutes.js
│   │   ├── waterRoutes.js
│   │   ├── weightRoutes.js
│   │   └── workoutRoutes.js
│   ├── .env.example
│   ├── package.json
│   ├── server.js
│   └── vercel.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Goals.jsx
│   │   │   ├── History.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Water.jsx
│   │   │   ├── Weight.jsx
│   │   │   └── Workouts.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── utils/
│   │   │   └── date.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── styles.css
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── .gitignore
└── README.md
```

---

## License
MIT
