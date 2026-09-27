import React, { useEffect, useMemo, useState } from 'react';
import api from '../services/api';

export default function Goals() {
  const [items, setItems] = useState([]);
  const [msg, setMsg] = useState('');

  const [form, setForm] = useState({
    type: 'Weekly workouts',
    target: '',
    progress: 0
  });

  const load = () =>
    api
      .get('/goals')
      .then((r) => setItems(r.data))
      .catch(console.error);

  useEffect(() => {
    load();
  }, []);

  const add = async (e) => {
    e.preventDefault();

    try {
      await api.post('/goals', form);

      setForm({
        type: 'Weekly workouts',
        target: '',
        progress: 0
      });

      setMsg('Goal created successfully ✓');
      load();

      setTimeout(() => setMsg(''), 3000);
    } catch (error) {
      console.error(error);
      setMsg(
        error.response?.data?.message ||
        'Unable to create goal'
      );
    }
  };

  const completed = items.filter(
    (g) =>
      Number(g.target) > 0 &&
      Number(g.progress) >= Number(g.target)
  ).length;

  const overallProgress = useMemo(() => {
    if (!items.length) return 0;

    const totalTarget = items.reduce(
      (sum, g) => sum + Number(g.target || 0),
      0
    );

    const totalProgress = items.reduce(
      (sum, g) => sum + Number(g.progress || 0),
      0
    );

    return totalTarget
      ? Math.min(
          100,
          Math.round(
            (totalProgress / totalTarget) * 100
          )
        )
      : 0;
  }, [items]);

  return (
    <Page
      title="Goals"
      sub="Set measurable targets and update your progress."
    >

      {/* =========================
          GOAL OVERVIEW
      ========================= */}

      <div className="goal-overview">

        <div className="goal-overview-main">
          <div>
            <span className="goal-label">
              🎯 YOUR PROGRESS
            </span>

            <h1>
              {overallProgress}
              <span>%</span>
            </h1>

            <p>
              {items.length
                ? 'Overall progress across your active goals.'
                : 'Create your first goal to start tracking.'}
            </p>
          </div>

          <div className="goal-circle">
            <div>
              <strong>{completed}</strong>
              <span>completed</span>
            </div>
          </div>
        </div>

        <div className="goal-progress">
          <i
            style={{
              width: `${overallProgress}%`
            }}
          />
        </div>
      </div>

      {/* =========================
          STATS
      ========================= */}

      <div className="goal-stats">

        <div className="goal-stat">
          <div className="goal-stat-icon">
            🎯
          </div>

          <div>
            <small>Total Goals</small>
            <strong>{items.length}</strong>
          </div>
        </div>

        <div className="goal-stat">
          <div className="goal-stat-icon">
            ✅
          </div>

          <div>
            <small>Completed</small>
            <strong>{completed}</strong>
          </div>
        </div>

        <div className="goal-stat">
          <div className="goal-stat-icon">
            🔥
          </div>

          <div>
            <small>Active Goals</small>
            <strong>
              {Math.max(0, items.length - completed)}
            </strong>
          </div>
        </div>

        <div className="goal-stat">
          <div className="goal-stat-icon">
            📈
          </div>

          <div>
            <small>Overall Progress</small>
            <strong>{overallProgress}%</strong>
          </div>
        </div>

      </div>

      {/* =========================
          CREATE GOAL
      ========================= */}

      <section className="panel goal-form-panel">

        <div className="section-heading">
          <div>
            <h3>➕ Create New Goal</h3>

            <p>
              Set a target and track your progress.
            </p>
          </div>
        </div>

        <form
          className="goal-form"
          onSubmit={add}
        >

          <div className="goal-field">
            <label>Goal Type</label>

            <input
              placeholder="e.g. Weekly workouts"
              required
              value={form.type}
              onChange={(e) =>
                setForm({
                  ...form,
                  type: e.target.value
                })
              }
            />
          </div>

          <div className="goal-field">
            <label>Target</label>

            <input
              type="number"
              min="0"
              step="0.1"
              placeholder="10"
              required
              value={form.target}
              onChange={(e) =>
                setForm({
                  ...form,
                  target: e.target.value
                })
              }
            />
          </div>

          <div className="goal-field">
            <label>Starting Progress</label>

            <input
              type="number"
              min="0"
              step="0.1"
              placeholder="0"
              value={form.progress}
              onChange={(e) =>
                setForm({
                  ...form,
                  progress: e.target.value
                })
              }
            />
          </div>

          <button
            className="primary"
            type="submit"
          >
            Create Goal
          </button>

        </form>

        {msg && (
          <p className="success goal-message">
            {msg}
          </p>
        )}

      </section>

      {/* =========================
          GOAL CARDS
      ========================= */}

      {items.length ? (

        <div className="goal-grid premium-goal-grid">

          {items.map((g) => (
            <Goal
              key={g._id}
              g={g}
              reload={load}
              setMsg={setMsg}
            />
          ))}

        </div>

      ) : (

        <section className="panel goal-empty">

          <div className="goal-empty-icon">
            🎯
          </div>

          <h3>No goals yet</h3>

          <p>
            Create your first goal above and start
            building consistency.
          </p>

        </section>

      )}

    </Page>
  );
}

function Goal({ g, reload, setMsg }) {
  const target = Number(g.target || 0);
  const progress = Number(g.progress || 0);

  const pct = target
    ? Math.min(
        100,
        Math.round(
          (progress / target) * 100
        )
      )
    : 0;

  const completed = pct >= 100;

  const update = async () => {
    const p = prompt(
      'Enter new progress',
      g.progress
    );

    if (p === null) return;

    const newProgress = Number(p);

    if (Number.isNaN(newProgress) || newProgress < 0) {
      setMsg('Please enter a valid progress value');
      return;
    }

    try {
      await api.put('/goals/' + g._id, {
        type: g.type,
        target: g.target,
        progress: newProgress
      });

      setMsg('Goal progress updated ✓');
      reload();

      setTimeout(() => setMsg(''), 2500);
    } catch (error) {
      console.error(error);
      setMsg('Unable to update goal');
    }
  };

  const del = async () => {
    try {
      await api.delete('/goals/' + g._id);

      setMsg('Goal deleted');
      reload();

      setTimeout(() => setMsg(''), 2500);
    } catch (error) {
      console.error(error);
      setMsg('Unable to delete goal');
    }
  };

  return (
    <section className="panel premium-goal-card">

      <div className="goal-card-top">

        <div className="goal-card-icon">
          {getGoalIcon(g.type)}
        </div>

        <div className="goal-card-title">
          <h3>{g.type}</h3>

          <span>
            {completed
              ? 'Goal completed'
              : 'Goal in progress'}
          </span>
        </div>

        <div
          className={
            completed
              ? 'goal-percent completed'
              : 'goal-percent'
          }
        >
          {pct}%
        </div>

      </div>

      <div className="goal-progress-large">
        <i
          style={{
            width: `${pct}%`
          }}
        />
      </div>

      <div className="goal-values">

        <span>
          Progress
          <strong>{progress}</strong>
        </span>

        <span>
          Target
          <strong>{target}</strong>
        </span>

      </div>

      {completed && (
        <div className="goal-complete">
          ✓ Target achieved — great work!
        </div>
      )}

      <div className="goal-actions">

        <button
          className="goal-update"
          onClick={update}
        >
          Update Progress
        </button>

        <button
          className="goal-delete"
          onClick={del}
        >
          Delete
        </button>

      </div>

    </section>
  );
}

function getGoalIcon(type) {
  const value = String(type).toLowerCase();

  if (value.includes('workout')) return '🏋️';
  if (value.includes('water')) return '💧';
  if (value.includes('weight')) return '⚖️';
  if (value.includes('run')) return '🏃';
  if (value.includes('calorie')) return '🔥';

  return '🎯';
}

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