import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';

import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Workouts from './pages/Workouts';
import Water from './pages/Water';
import Weight from './pages/Weight';
import Goals from './pages/Goals';
import Profile from './pages/Profile';
import History from './pages/History';

import './styles.css';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>

          {/* Public Routes */}
          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />

          {/* Default Route */}
          <Route
            path="/"
            element={<Navigate to="/dashboard" replace />}
          />

          {/* Protected Routes */}
          <Route
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route
              path="/dashboard"
              element={<Dashboard />}
            />

            <Route
              path="/workouts"
              element={<Workouts />}
            />

            <Route
              path="/water"
              element={<Water />}
            />

            <Route
              path="/weight"
              element={<Weight />}
            />

            <Route
              path="/goals"
              element={<Goals />}
            />

            <Route
              path="/profile"
              element={<Profile />}
            />

            <Route
              path="/history"
              element={<History />}
            />
          </Route>

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}