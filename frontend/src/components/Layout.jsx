import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Layout() {
  const { user, logout } = useAuth();
  const nav = useNavigate();

  const links = [
    ['/dashboard', 'Dashboard', '⌂'],
    ['/workouts', 'Workouts', '🏋️'],
    ['/water', 'Water', '💧'],
    ['/weight', 'Weight & BMI', '⚖️'],
    ['/goals', 'Goals', '🎯'],
    ['/history', 'History', '📜'],
    ['/profile', 'Profile', '👤']
  ];

  const firstName =
    user?.name?.split(' ')[0] || 'there';

  const handleLogout = () => {
    logout();
    nav('/login');
  };

  return (
    <div className="app">

      {/* =========================
          SIDEBAR
      ========================= */}

      <aside className="sidebar">

        <div className="sidebar-top">

          {/* BRAND */}

          <div className="brand">
            <div className="brand-mark">
              GF
            </div>

            <div>
              <h1>
                Go<span>Fit</span>
              </h1>

              <small>
                FITNESS COMPANION
              </small>
            </div>
          </div>

          {/* USER */}

          <div className="sidebar-user">

            <div className="sidebar-avatar">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>

            <div className="sidebar-user-info">
              <strong>{firstName}</strong>
              <span>Fitness Journey</span>
            </div>

            <div className="online-dot" />

          </div>

          {/* NAVIGATION */}

          <div className="nav-label">
            MAIN MENU
          </div>

          <nav className="sidebar-nav">

            {links.map(([to, label, icon]) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  isActive ? 'active' : ''
                }
              >
                <span className="nav-icon">
                  {icon}
                </span>

                <span className="nav-text">
                  {label}
                </span>

                <span className="nav-arrow">
                  →
                </span>
              </NavLink>
            ))}

          </nav>

        </div>

        {/* BOTTOM */}

        <div className="sidebar-bottom">

          <div className="sidebar-motivation">
            <span>🔥</span>

            <div>
              <strong>
                Keep going!
              </strong>

              <p>
                Small steps, big results.
              </p>
            </div>
          </div>

          <button
            className="logout"
            onClick={handleLogout}
          >
            <span>↪</span>
            Logout
          </button>

          <div className="sidebar-footer">
            GoFit • Your fitness companion
          </div>

        </div>

      </aside>

      {/* =========================
          MAIN CONTENT
      ========================= */}

      <main className="main-content">
        <Outlet />
      </main>

    </div>
  );
}