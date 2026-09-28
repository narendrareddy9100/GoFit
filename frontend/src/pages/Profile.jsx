import React, { useEffect, useState } from 'react';
import api from '../services/api';

export default function Profile() {
  const [form, setForm] = useState({});
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/user/profile')
      .then((r) => setForm(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const save = async (e) => {
    e.preventDefault();

    try {
      const {
        name,
        mobile,
        gender,
        age,
        height,
        weight,
        fitnessGoal
      } = form;

      const r = await api.put('/user/profile', {
        name,
        mobile,
        gender,
        age,
        height,
        weight,
        fitnessGoal
      });

      setForm(r.data);
      setMsg('Profile updated successfully ✓');

      setTimeout(() => {
        setMsg('');
      }, 3000);
    } catch (error) {
      console.error(error);
      setMsg('Unable to update profile');
    }
  };

  const bmi =
    form.height &&
    form.weight
      ? (
          form.weight /
          ((form.height / 100) ** 2)
        ).toFixed(1)
      : null;

  const getBmiStatus = () => {
    if (!bmi) return 'Add your height and weight';

    if (bmi < 18.5) return 'Below normal range';
    if (bmi < 25) return 'Healthy range';
    if (bmi < 30) return 'Above normal range';

    return 'High range';
  };

  if (loading) {
    return (
      <div className="center">
        <p className="muted">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="profile-page">

      {/* =========================
          HEADER
      ========================= */}

      <header className="page-head">
        <div>
          <h2>Profile</h2>

          <p>
            Manage your personal fitness information.
          </p>
        </div>
      </header>

      {/* =========================
          PROFILE HERO
      ========================= */}

      <section className="profile-hero">

        <div className="profile-avatar">
          {form.name?.charAt(0)?.toUpperCase() || 'U'}
        </div>

        <div className="profile-identity">
          <h2>{form.name || 'User'}</h2>

          <p>{form.email || 'No email available'}</p>

          <span>
            {form.fitnessGoal || 'Fitness journey'}
          </span>
        </div>

      </section>

      {/* =========================
          QUICK STATS
      ========================= */}

      <div className="profile-stats">

        <div className="profile-stat">
          <span>🎂</span>
          <small>Age</small>
          <strong>
            {form.age ? `${form.age} yrs` : '-'}
          </strong>
        </div>

        <div className="profile-stat">
          <span>📏</span>
          <small>Height</small>
          <strong>
            {form.height ? `${form.height} cm` : '-'}
          </strong>
        </div>

        <div className="profile-stat">
          <span>⚖️</span>
          <small>Weight</small>
          <strong>
            {form.weight ? `${form.weight} kg` : '-'}
          </strong>
        </div>

        <div className="profile-stat">
          <span>📊</span>
          <small>BMI</small>
          <strong>
            {bmi || '-'}
          </strong>
        </div>

      </div>

      {/* =========================
          MAIN PROFILE GRID
      ========================= */}

      <div className="profile-grid">

        {/* EDIT PROFILE */}

        <section className="panel">

          <div className="panel-head">
            <div>
              <h3>Edit Profile</h3>

              <p className="panel-subtitle">
                Update your personal information.
              </p>
            </div>
          </div>

          <form
            className="profile-form"
            onSubmit={save}
          >

            <div className="form-field">
              <label>Full Name</label>

              <input
                type="text"
                value={form.name ?? ''}
                onChange={(e) =>
                  setForm({
                    ...form,
                    name: e.target.value
                  })
                }
                placeholder="Enter your name"
              />
            </div>

            <div className="form-field">
              <label>Email</label>

              <input
                type="email"
                value={form.email ?? ''}
                disabled
              />

              <small>
                Email cannot be changed.
              </small>
            </div>

            <div className="form-field">
              <label>Mobile</label>

              <input
                type="text"
                value={form.mobile ?? ''}
                onChange={(e) =>
                  setForm({
                    ...form,
                    mobile: e.target.value
                  })
                }
                placeholder="Enter mobile number"
              />
            </div>

            <div className="form-field">
              <label>Gender</label>

              <select
                value={
                  form.gender || 'Prefer not to say'
                }
                onChange={(e) =>
                  setForm({
                    ...form,
                    gender: e.target.value
                  })
                }
              >
                <option>Prefer not to say</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>

            <div className="form-field">
              <label>Age</label>

              <input
                type="number"
                value={form.age ?? ''}
                onChange={(e) =>
                  setForm({
                    ...form,
                    age: e.target.value
                  })
                }
                placeholder="Age"
              />
            </div>

            <div className="form-field">
              <label>Height (cm)</label>

              <input
                type="number"
                value={form.height ?? ''}
                onChange={(e) =>
                  setForm({
                    ...form,
                    height: e.target.value
                  })
                }
                placeholder="Height"
              />
            </div>

            <div className="form-field">
              <label>Weight (kg)</label>

              <input
                type="number"
                value={form.weight ?? ''}
                onChange={(e) =>
                  setForm({
                    ...form,
                    weight: e.target.value
                  })
                }
                placeholder="Weight"
              />
            </div>

            <div className="form-field">
              <label>Fitness Goal</label>

              <input
                type="text"
                value={form.fitnessGoal ?? ''}
                onChange={(e) =>
                  setForm({
                    ...form,
                    fitnessGoal: e.target.value
                  })
                }
                placeholder="e.g. Build muscle"
              />
            </div>

            <button
              className="primary full"
              type="submit"
            >
              Save Changes
            </button>

          </form>

          {msg && (
            <p
              className={
                msg.includes('successfully')
                  ? 'success profile-message'
                  : 'error profile-message'
              }
            >
              {msg}
            </p>
          )}

        </section>

        {/* FITNESS SUMMARY */}

        <section className="panel profile-summary">

          <h3>Fitness Summary</h3>

          <div className="summary-card">

            <div className="summary-icon">
              🎯
            </div>

            <div>
              <small>Fitness Goal</small>

              <strong>
                {form.fitnessGoal ||
                  'Not specified'}
              </strong>
            </div>

          </div>

          <div className="summary-card">

            <div className="summary-icon">
              📊
            </div>

            <div>
              <small>BMI</small>

              <strong>
                {bmi || 'Not available'}
              </strong>

              <span>
                {getBmiStatus()}
              </span>
            </div>

          </div>

          <div className="summary-card">

            <div className="summary-icon">
              ⚖️
            </div>

            <div>
              <small>Current Weight</small>

              <strong>
                {form.weight
                  ? `${form.weight} kg`
                  : 'Not added'}
              </strong>
            </div>

          </div>

          <div className="profile-tip">
            <span>💡</span>

            <div>
              <strong>Keep it updated</strong>

              <p>
                Accurate profile data helps GoFit
                provide better fitness insights.
              </p>
            </div>
          </div>

        </section>

      </div>

    </div>
  );
}