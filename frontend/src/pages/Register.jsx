import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    mobile: '',
    gender: 'Prefer not to say',
    age: '',
    height: '',
    weight: '',
    fitnessGoal: 'General fitness'
  });

  const [err, setErr] = useState('');

  const { register } = useAuth();
  const nav = useNavigate();

  const change = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const submit = async (e) => {
    e.preventDefault();
    setErr('');

    try {
      await register(form);
      nav('/dashboard');
    } catch (x) {
      setErr(
        x.response?.data?.message || 'Registration failed'
      );
    }
  };

  return (
    <div className="auth">
      <div className="auth-card wide">

        <h1>
          Go<span>Fit</span>
        </h1>

        <h2>Create your account</h2>

        <p>Start tracking your fitness progress.</p>

        {err && (
          <div className="error">
            {err}
          </div>
        )}

        <form onSubmit={submit} className="grid-form">

          <input
            name="name"
            placeholder="Full name"
            required
            value={form.name}
            onChange={change}
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            required
            value={form.email}
            onChange={change}
          />

          <input
            name="password"
            type="password"
            placeholder="Password (min 6 chars)"
            required
            minLength="6"
            value={form.password}
            onChange={change}
          />

          <input
            name="mobile"
            placeholder="Mobile"
            value={form.mobile}
            onChange={change}
          />

          <input
            name="age"
            type="number"
            placeholder="Age"
            value={form.age}
            onChange={change}
          />

          <input
            name="height"
            type="number"
            placeholder="Height (cm)"
            value={form.height}
            onChange={change}
          />

          <input
            name="weight"
            type="number"
            placeholder="Weight (kg)"
            value={form.weight}
            onChange={change}
          />

          <select
            name="gender"
            value={form.gender}
            onChange={change}
          >
            <option>Prefer not to say</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>

          <input
            name="fitnessGoal"
            placeholder="Fitness goal"
            value={form.fitnessGoal}
            onChange={change}
          />

          <button
            className="primary full"
            type="submit"
          >
            Register
          </button>

        </form>

        <p>
          Already have an account?{' '}
          <Link to="/login">Login</Link>
        </p>

      </div>
    </div>
  );
}