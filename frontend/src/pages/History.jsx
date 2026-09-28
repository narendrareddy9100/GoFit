import React, { useEffect, useMemo, useState } from 'react';
import api from '../services/api';
import { fmt } from '../utils/date';

export default function History() {
  const [d, setD] = useState({
    w: [],
    wa: [],
    we: [],
    g: []
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/workouts'),
      api.get('/water'),
      api.get('/weight'),
      api.get('/goals')
    ])
      .then(([w, wa, we, g]) => {
        setD({
          w: w.data,
          wa: wa.data,
          we: we.data,
          g: g.data
        });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const totalCalories = useMemo(
    () =>
      d.w.reduce(
        (sum, x) => sum + Number(x.calories || 0),
        0
      ),
    [d.w]
  );

  const totalWater = useMemo(
    () =>
      d.wa.reduce(
        (sum, x) => sum + Number(x.amount || 0),
        0
      ),
    [d.wa]
  );

  const latestWeight = d.we.length
    ? d.we[d.we.length - 1].weight
    : '-';

  const completedGoals = d.g.filter(
    (x) =>
      Number(x.target) > 0 &&
      Number(x.progress) >= Number(x.target)
  ).length;

  if (loading) {
    return (
      <div className="center">
        <p className="muted">Loading history...</p>
      </div>
    );
  }

  return (
    <div className="history-page">

      <header className="page-head">
        <div>
          <h2>History</h2>
          <p>
            A combined view of everything you've tracked.
          </p>
        </div>
      </header>

      {/* OVERVIEW */}

      <div className="history-stats">

        <div className="history-stat">
          <div className="history-stat-icon">🏋️</div>
          <div>
            <small>Workouts</small>
            <strong>{d.w.length}</strong>
          </div>
        </div>

        <div className="history-stat">
          <div className="history-stat-icon">💧</div>
          <div>
            <small>Water Entries</small>
            <strong>{d.wa.length}</strong>
          </div>
        </div>

        <div className="history-stat">
          <div className="history-stat-icon">⚖️</div>
          <div>
            <small>Weight Entries</small>
            <strong>{d.we.length}</strong>
          </div>
        </div>

        <div className="history-stat">
          <div className="history-stat-icon">🎯</div>
          <div>
            <small>Completed Goals</small>
            <strong>{completedGoals}</strong>
          </div>
        </div>

      </div>

      {/* QUICK SUMMARY */}

      <section className="history-summary">

        <div>
          <span>🔥 Total Calories</span>
          <strong>{totalCalories} kcal</strong>
        </div>

        <div>
          <span>💧 Total Water</span>
          <strong>{totalWater} ml</strong>
        </div>

        <div>
          <span>⚖️ Latest Weight</span>
          <strong>
            {latestWeight !== '-'
              ? `${latestWeight} kg`
              : '-'}
          </strong>
        </div>

        <div>
          <span>🎯 Total Goals</span>
          <strong>{d.g.length}</strong>
        </div>

      </section>

      {/* HISTORY GRID */}

      <div className="history-grid">

        {/* WORKOUTS */}

        <section className="panel history-card">

          <div className="history-card-head">
            <div className="history-title-icon">
              🏋️
            </div>

            <div>
              <h3>Workouts</h3>
              <p>
                {d.w.length
                  ? `${d.w.length} workout${d.w.length > 1 ? 's' : ''} recorded`
                  : 'No workout history'}
              </p>
            </div>

            <span className="history-badge">
              {d.w.length}
            </span>
          </div>

          {d.w.length ? (
            <div className="history-list">

              {d.w
                .slice()
                .reverse()
                .map((x) => (
                  <div
                    className="history-item"
                    key={x._id}
                  >
                    <div className="history-item-icon">
                      {getWorkoutIcon(
                        x.workoutType
                      )}
                    </div>

                    <div className="history-item-main">
                      <strong>
                        {x.workoutName}
                      </strong>

                      <span>
                        {x.workoutType || 'Workout'}
                      </span>
                    </div>

                    <div className="history-item-value">
                      <strong>
                        {x.duration} min
                      </strong>

                      <small>
                        {x.calories || 0} kcal
                      </small>
                    </div>

                    <div className="history-item-date">
                      {fmt(x.date)}
                    </div>
                  </div>
                ))}

            </div>
          ) : (
            <Empty
              icon="🏋️"
              text="No workout history yet."
            />
          )}

        </section>

        {/* WATER */}

        <section className="panel history-card">

          <div className="history-card-head">
            <div className="history-title-icon">
              💧
            </div>

            <div>
              <h3>Water</h3>
              <p>
                {d.wa.length
                  ? `${d.wa.length} entr${d.wa.length > 1 ? 'ies' : 'y'} recorded`
                  : 'No water history'}
              </p>
            </div>

            <span className="history-badge">
              {d.wa.length}
            </span>
          </div>

          {d.wa.length ? (
            <div className="history-list">

              {d.wa
                .slice()
                .reverse()
                .map((x) => (
                  <div
                    className="history-item"
                    key={x._id}
                  >
                    <div className="history-item-icon">
                      💧
                    </div>

                    <div className="history-item-main">
                      <strong>
                        {x.amount} ml
                      </strong>

                      <span>
                        Water intake
                      </span>
                    </div>

                    <div className="history-item-date">
                      {fmt(x.date)}
                    </div>
                  </div>
                ))}

            </div>
          ) : (
            <Empty
              icon="💧"
              text="No water history yet."
            />
          )}

        </section>

        {/* WEIGHT */}

        <section className="panel history-card">

          <div className="history-card-head">
            <div className="history-title-icon">
              ⚖️
            </div>

            <div>
              <h3>Weight</h3>
              <p>
                {d.we.length
                  ? `${d.we.length} weight ${d.we.length > 1 ? 'entries' : 'entry'}`
                  : 'No weight history'}
              </p>
            </div>

            <span className="history-badge">
              {d.we.length}
            </span>
          </div>

          {d.we.length ? (
            <div className="history-list">

              {d.we
                .slice()
                .reverse()
                .map((x) => (
                  <div
                    className="history-item"
                    key={x._id}
                  >
                    <div className="history-item-icon">
                      ⚖️
                    </div>

                    <div className="history-item-main">
                      <strong>
                        {x.weight} kg
                      </strong>

                      <span>
                        Weight measurement
                      </span>
                    </div>

                    <div className="history-item-date">
                      {fmt(x.date)}
                    </div>
                  </div>
                ))}

            </div>
          ) : (
            <Empty
              icon="⚖️"
              text="No weight history yet."
            />
          )}

        </section>

        {/* GOALS */}

        <section className="panel history-card">

          <div className="history-card-head">
            <div className="history-title-icon">
              🎯
            </div>

            <div>
              <h3>Goals</h3>
              <p>
                {d.g.length
                  ? `${d.g.length} goal${d.g.length > 1 ? 's' : ''} created`
                  : 'No goals yet'}
              </p>
            </div>

            <span className="history-badge">
              {d.g.length}
            </span>
          </div>

          {d.g.length ? (
            <div className="history-list">

              {d.g
                .slice()
                .reverse()
                .map((x) => {

                  const target = Number(
                    x.target || 0
                  );

                  const progress = Number(
                    x.progress || 0
                  );

                  const pct = target
                    ? Math.min(
                        100,
                        Math.round(
                          (progress / target) *
                            100
                        )
                      )
                    : 0;

                  return (
                    <div
                      className="history-goal-item"
                      key={x._id}
                    >

                      <div className="history-goal-top">
                        <div>
                          <strong>{x.type}</strong>

                          <span>
                            {progress} / {target}
                          </span>
                        </div>

                        <b>{pct}%</b>
                      </div>

                      <div className="history-goal-bar">
                        <i
                          style={{
                            width: `${pct}%`
                          }}
                        />
                      </div>

                    </div>
                  );
                })}

            </div>
          ) : (
            <Empty
              icon="🎯"
              text="No goals created yet."
            />
          )}

        </section>

      </div>

    </div>
  );
}

function Empty({ icon, text }) {
  return (
    <div className="history-empty">
      <div>{icon}</div>
      <p>{text}</p>
    </div>
  );
}

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