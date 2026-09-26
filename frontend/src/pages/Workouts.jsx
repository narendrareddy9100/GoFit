import React, { useEffect, useMemo, useState } from 'react';
import api from '../services/api';
import { fmt, today } from '../utils/date';

export default function Workouts() {
  const [items, setItems] = useState([]);

  const [form, setForm] = useState({
    workoutName: '',
    workoutType: 'Strength',
    duration: '',
    calories: '',
    date: today()
  });

  const [msg, setMsg] = useState('');

  const load = () =>
    api
      .get('/workouts')
      .then((r) => setItems(r.data))
      .catch(console.error);

  useEffect(() => {
    load();
  }, []);

  const submit = async (e) => {
    e.preventDefault();

    try {
      await api.post('/workouts', form);

      setForm({
        ...form,
        workoutName: '',
        duration: '',
        calories: ''
      });

      setMsg('Workout added successfully ✓');

      load();

      setTimeout(() => {
        setMsg('');
      }, 3000);
    } catch (x) {
      setMsg(
        x.response?.data?.message || 'Unable to add workout'
      );
    }
  };

  const del = async (id) => {
    try {
      await api.delete('/workouts/' + id);
      setMsg('Workout deleted');
      load();

      setTimeout(() => {
        setMsg('');
      }, 2500);
    } catch (error) {
      console.error(error);
    }
  };

  /* =========================
     STATISTICS
  ========================= */

  const totalCalories = useMemo(
    () =>
      items.reduce(
        (sum, x) => sum + Number(x.calories || 0),
        0
      ),
    [items]
  );

  const totalMinutes = useMemo(
    () =>
      items.reduce(
        (sum, x) => sum + Number(x.duration || 0),
        0
      ),
    [items]
  );

  const averageDuration = items.length
    ? Math.round(totalMinutes / items.length)
    : 0;

  return (
    <Page
      title="Workouts"
      sub="Log your workouts and build consistency."
    >

      {/* =========================
          STAT CARDS
      ========================= */}

      <div className="workout-stats">

        <div className="workout-stat">
          <div className="workout-stat-icon">
            🏋️
          </div>

          <div>
            <small>Total Workouts</small>
            <strong>{items.length}</strong>
          </div>
        </div>

        <div className="workout-stat">
          <div className="workout-stat-icon">
            🔥
          </div>

          <div>
            <small>Total Calories</small>
            <strong>{totalCalories}</strong>
            <span>kcal</span>
          </div>
        </div>

        <div className="workout-stat">
          <div className="workout-stat-icon">
            ⏱️
          </div>

          <div>
            <small>Total Time</small>
            <strong>{totalMinutes}</strong>
            <span>minutes</span>
          </div>
        </div>

        <div className="workout-stat">
          <div className="workout-stat-icon">
            📊
          </div>

          <div>
            <small>Avg. Duration</small>
            <strong>{averageDuration}</strong>
            <span>min / workout</span>
          </div>
        </div>

      </div>

      {/* =========================
          ADD WORKOUT
      ========================= */}

      <section className="panel workout-form-panel">

        <div className="section-heading">
          <div>
            <h3>➕ Add Workout</h3>

            <p>
              Record your latest workout activity.
            </p>
          </div>
        </div>

        <form
          className="workout-form"
          onSubmit={submit}
        >

          <div className="workout-field workout-name-field">
            <label>Workout Name</label>

            <input
              placeholder="e.g. Morning Run"
              required
              value={form.workoutName}
              onChange={(e) =>
                setForm({
                  ...form,
                  workoutName: e.target.value
                })
              }
            />
          </div>

          <div className="workout-field">
            <label>Type</label>

            <select
              value={form.workoutType}
              onChange={(e) =>
                setForm({
                  ...form,
                  workoutType: e.target.value
                })
              }
            >
              <option>Strength</option>
              <option>Cardio</option>
              <option>Flexibility</option>
              <option>Sports</option>
              <option>Other</option>
            </select>
          </div>

          <div className="workout-field">
            <label>Duration</label>

            <div className="input-with-unit">
              <input
                type="number"
                min="1"
                placeholder="30"
                required
                value={form.duration}
                onChange={(e) =>
                  setForm({
                    ...form,
                    duration: e.target.value
                  })
                }
              />

              <span>min</span>
            </div>
          </div>

          <div className="workout-field">
            <label>Calories</label>

            <div className="input-with-unit">
              <input
                type="number"
                min="0"
                placeholder="250"
                value={form.calories}
                onChange={(e) =>
                  setForm({
                    ...form,
                    calories: e.target.value
                  })
                }
              />

              <span>kcal</span>
            </div>
          </div>

          <div className="workout-field">
            <label>Date</label>

            <input
              type="date"
              value={form.date}
              onChange={(e) =>
                setForm({
                  ...form,
                  date: e.target.value
                })
              }
            />
          </div>

          <div className="workout-submit">
            <button
              className="primary"
              type="submit"
            >
              Add Workout
            </button>
          </div>

        </form>

        {msg && (
          <p className="success workout-message">
            {msg}
          </p>
        )}

      </section>

      {/* =========================
          WORKOUT HISTORY
      ========================= */}

      <section className="panel">

        <div className="panel-head">
          <div>
            <h3>Workout History</h3>

            <p className="panel-subtitle">
              {items.length
                ? `${items.length} workout${items.length > 1 ? 's' : ''} recorded`
                : 'Your workout history will appear here.'}
            </p>
          </div>

          <span className="history-count">
            {items.length}
          </span>
        </div>

        {items.length ? (

          <div className="workout-list">

            {items.map((x) => (

              <div
                className="workout-item"
                key={x._id}
              >

                <div className="workout-icon">
                  {getWorkoutIcon(x.workoutType)}
                </div>

                <div className="workout-info">

                  <strong>
                    {x.workoutName}
                  </strong>

                  <span>
                    {x.workoutType}
                  </span>

                </div>

                <div className="workout-detail">
                  <small>Duration</small>
                  <strong>
                    {x.duration} min
                  </strong>
                </div>

                <div className="workout-detail">
                  <small>Calories</small>
                  <strong>
                    {x.calories || 0} kcal
                  </strong>
                </div>

                <div className="workout-date">
                  <small>Date</small>
                  <strong>
                    {fmt(x.date)}
                  </strong>
                </div>

                <button
                  className="delete-workout"
                  onClick={() => del(x._id)}
                  title="Delete workout"
                >
                  🗑️
                </button>

              </div>

            ))}

          </div>

        ) : (

          <div className="workout-empty">

            <div className="empty-icon">
              🏋️
            </div>

            <h4>No workouts yet</h4>

            <p>
              Add your first workout above to start
              tracking your fitness journey.
            </p>

          </div>

        )}

      </section>

    </Page>
  );
}


/* =========================
   HELPERS
========================= */

function getWorkoutIcon(type) {
  switch (type) {
    case 'Cardio':
      return '🏃';

    case 'Strength':
      return '🏋️';

    case 'Flexibility':
      return '🧘';

    case 'Sports':
      return '⚽';

    default:
      return '💪';
  }
}


/* =========================
   PAGE
========================= */

function Page({ title, sub, children }) {
  return (
    <>
      <header className="page-head">
        <div>
          <h2>{title}</h2>
          <p>{sub}</p>
        </div>
      </header>

      {children}
    </>
  );
}