import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [form, setForm] = useState({
    email: '',
    password: ''
  });

  const [err, setErr] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setErr('');

    try {
      await login(form);
      nav('/dashboard');
    } catch (x) {
      setErr(x.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-background">
        <div className="auth-glow glow-one"></div>
        <div className="auth-glow glow-two"></div>
      </div>

      <div className="auth-wrapper">
        <div className="auth-brand">
          <div className="auth-brand-mark">GF</div>

          <div>
            <h1>
              Go<span>Fit</span>
            </h1>
            <p>YOUR FITNESS COMPANION</p>
          </div>
        </div>

        <div className="auth-card">
          <div className="auth-card-header">
            <div className="welcome-icon">👋</div>

            <div>
              <h2>Welcome back</h2>
              <p>Log in to continue your fitness journey.</p>
            </div>
          </div>

          {err && (
            <div className="auth-error">
              <span>!</span>
              {err}
            </div>
          )}

          <form onSubmit={submit} className="auth-form">
            <div className="auth-field">
              <label>Email address</label>

              <div className="auth-input-wrap">
                <span className="input-icon">✉</span>

                <input
                  type="email"
                  placeholder="Enter your email"
                  required
                  value={form.email}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      email: e.target.value
                    })
                  }
                />
              </div>
            </div>

            <div className="auth-field">
              <label>Password</label>

              <div className="auth-input-wrap">
                <span className="input-icon">🔒</span>

                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  required
                  value={form.password}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      password: e.target.value
                    })
                  }
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <button className="auth-submit" type="submit">
              <span>Login to GoFit</span>
              <span className="submit-arrow">→</span>
            </button>
          </form>

          <div className="auth-divider">
            <span>FITNESS • PROGRESS • CONSISTENCY</span>
          </div>

          <p className="auth-register">
            New to GoFit?
            <Link to="/register">Create an account</Link>
          </p>
        </div>

        <div className="auth-footer">
          <span>© GoFit</span>
          <span>Built for your fitness journey</span>
        </div>
      </div>
    </div>
  );
}