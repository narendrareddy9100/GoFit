import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();

  const [data, setData] = useState({
    workouts: [],
    water: [],
    weight: [],
    goals: []
  });

  useEffect(() => {
    Promise.all([
      api.get('/workouts'),
      api.get('/water'),
      api.get('/weight'),
      api.get('/goals')
    ])
      .then(([w, wa, we, g]) => {
        setData({
          workouts: w.data,
          water: wa.data,
          weight: we.data,
          goals: g.data
        });
      })
      .catch(console.error);
  }, []);

  const today = new Date();
  const todayString = today.toDateString();

  /* =========================
     TODAY'S DATA
  ========================= */

  const todayWater = data.water
    .filter(
      (x) => new Date(x.date).toDateString() === todayString
    )
    .reduce((sum, x) => sum + Number(x.amount || 0), 0);

  const todayWorkouts = data.workouts.filter(
    (x) => new Date(x.date).toDateString() === todayString
  );

  const todayCalories = todayWorkouts.reduce(
    (sum, x) => sum + Number(x.calories || 0),
    0
  );

  const todayMinutes = todayWorkouts.reduce(
    (sum, x) => sum + Number(x.duration || 0),
    0
  );

  /* =========================
     WEIGHT + BMI
  ========================= */

  const latest =
    data.weight.at(-1)?.weight ??
    user?.weight ??
    '-';

  const bmi =
    user?.height &&
    latest &&
    latest !== '-'
      ? (latest / ((user.height / 100) ** 2)).toFixed(1)
      : '-';

  /* =========================
     WATER TARGET
  ========================= */

  const waterGoal =
    data.goals.find(
      (g) =>
        String(g.type).toLowerCase().includes('water')
    )?.target ||
    user?.dailyWater ||
    2500;

  const waterPercent =
    waterGoal > 0
      ? Math.min(100, Math.round((todayWater / waterGoal) * 100))
      : 0;

  /* =========================
     WEIGHT CHART
  ========================= */

  const chart = data.weight.map((x) => ({
    date: new Date(x.date).toLocaleDateString(
      undefined,
      {
        day: '2-digit',
        month: 'short'
      }
    ),
    weight: Number(x.weight)
  }));

  /* =========================
     WEEKLY DATA
  ========================= */

  const weekStart = new Date();
  weekStart.setDate(today.getDate() - 6);
  weekStart.setHours(0, 0, 0, 0);

  const weeklyWorkouts = data.workouts.filter(
    (x) => new Date(x.date) >= weekStart
  );

  const weeklyCalories = weeklyWorkouts.reduce(
    (sum, x) => sum + Number(x.calories || 0),
    0
  );

  /* =========================
     WORKOUT STREAK
  ========================= */

  const workoutDays = new Set(
    data.workouts.map((x) =>
      new Date(x.date).toDateString()
    )
  );

  let streak = 0;
  const streakDate = new Date();

  while (workoutDays.has(streakDate.toDateString())) {
    streak++;
    streakDate.setDate(streakDate.getDate() - 1);
  }

  /* =========================
     GOAL PROGRESS
  ========================= */

  const goalProgress = useMemo(() => {
    if (!data.goals.length) return 0;

    const total = data.goals.reduce(
      (sum, goal) => sum + Number(goal.progress || 0),
      0
    );

    const target = data.goals.reduce(
      (sum, goal) => sum + Number(goal.target || 0),
      0
    );

    return target
      ? Math.min(100, Math.round((total / target) * 100))
      : 0;
  }, [data.goals]);

  /* =========================
     FITNESS INSIGHT
  ========================= */

  let insight =
    'Start your fitness journey today 💚';

  if (todayWorkouts.length > 0 && waterPercent >= 70) {
    insight =
      'Great work! Your activity and hydration are looking strong today 🔥';
  } else if (todayWorkouts.length > 0) {
    insight =
      'Workout complete! Keep your hydration on track 💧';
  } else if (waterPercent >= 70) {
    insight =
      'Nice hydration! Add a workout to complete your day 💪';
  } else if (weeklyWorkouts.length >= 3) {
    insight =
      'You are building great consistency this week 🔥';
  }

  return (
    <div className="dashboard">

      {/* =========================
          HEADER
      ========================= */}

      <header className="page-head">
        <div>
          <h2>
            Welcome back, {user?.name?.split(' ')[0] || 'there'} 👋
          </h2>

          <p>
            Here's your fitness overview for today.
          </p>
        </div>

        <Link
          className="primary small"
          to="/workouts"
        >
          + Add Workout
        </Link>
      </header>

      {/* =========================
          TOP STATS
      ========================= */}

      <div className="cards">

        <Card
          label="Current Weight"
          value={`${latest} kg`}
          icon="⚖️"
        />

        <Card
          label="Today's Workouts"
          value={todayWorkouts.length}
          icon="🏋️"
        />

        <Card
          label="Calories Burned"
          value={`${todayCalories} kcal`}
          icon="🔥"
        />

        <Card
          label="BMI"
          value={bmi}
          icon="📊"
        />

      </div>

      {/* =========================
          SECOND ROW
      ========================= */}

      <div className="dashboard-grid">

        {/* WATER */}

        <section className="panel stat-panel">
          <div className="panel-head">
            <h3>💧 Water Intake</h3>

            <Link to="/water">
              Manage
            </Link>
          </div>

          <div className="big-stat">
            {todayWater}
            <span> ml</span>
          </div>

          <p className="muted">
            Daily target: {waterGoal} ml
          </p>

          <div className="progress-large">
            <i
              style={{
                width: `${waterPercent}%`
              }}
            />
          </div>

          <div className="progress-info">
            <span>{waterPercent}% completed</span>

            <span>
              {Math.max(0, waterGoal - todayWater)} ml left
            </span>
          </div>
        </section>

        {/* WEEKLY ACTIVITY */}

        <section className="panel stat-panel">
          <div className="panel-head">
            <h3>🔥 Weekly Activity</h3>

            <span className="green-text">
              Last 7 days
            </span>
          </div>

          <div className="weekly-number">
            {weeklyWorkouts.length}
            <span> workouts</span>
          </div>

          <div className="mini-stats">

            <div>
              <strong>{weeklyCalories}</strong>
              <span>Calories</span>
            </div>

            <div>
              <strong>
                {weeklyWorkouts.reduce(
                  (sum, x) =>
                    sum + Number(x.duration || 0),
                  0
                )}
              </strong>
              <span>Minutes</span>
            </div>

            <div>
              <strong>{streak}</strong>
              <span>Day Streak</span>
            </div>

          </div>
        </section>

      </div>

      {/* =========================
          CHART + GOALS
      ========================= */}

      <div className="two">

        {/* WEIGHT */}

        <section className="panel">

          <div className="panel-head">
            <h3>📈 Weight Progress</h3>

            <Link to="/weight">
              Manage
            </Link>
          </div>

          {chart.length ? (
            <ResponsiveContainer
              width="100%"
              height={280}
            >
              <LineChart data={chart}>

                <CartesianGrid />

                <XAxis dataKey="date" />

                <YAxis />

                <Tooltip />

                <Line
                  type="monotone"
                  dataKey="weight"
                  stroke="#22c55e"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  activeDot={{ r: 7 }}
                />

              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="empty-chart">
              <span>📈</span>

              <p>
                Add weight entries to see your progress.
              </p>

              <Link to="/weight">
                Add Weight →
              </Link>
            </div>
          )}

        </section>

        {/* GOALS */}

        <section className="panel">

          <div className="panel-head">
            <h3>🎯 Fitness Goals</h3>

            <span className="goal-percent">
              {goalProgress}%
            </span>
          </div>

          {data.goals.length ? (
            data.goals
              .slice(0, 4)
              .map((g) => {

                const target = Number(g.target || 0);
                const progress = Number(g.progress || 0);

                const percent =
                  target > 0
                    ? Math.min(
                        100,
                        Math.round(
                          (progress / target) * 100
                        )
                      )
                    : 0;

                return (
                  <div
                    className="goal"
                    key={g._id}
                  >

                    <div>
                      <b>{g.type}</b>

                      <span>
                        {g.progress} / {g.target}
                      </span>
                    </div>

                    <div className="bar">
                      <i
                        style={{
                          width: `${percent}%`
                        }}
                      />
                    </div>

                    <small className="goal-percent-small">
                      {percent}% complete
                    </small>

                  </div>
                );
              })
          ) : (
            <div className="empty-goal">
              <span>🎯</span>

              <p>No goals yet.</p>

              <Link to="/goals">
                Create your first goal →
              </Link>
            </div>
          )}

          <Link
            className="text-link"
            to="/goals"
          >
            View all goals →
          </Link>

        </section>

      </div>

      {/* =========================
          TODAY'S ACTIVITY
      ========================= */}

      <section className="panel">

        <div className="panel-head">
          <h3>🏋️ Today's Activity</h3>

          <Link to="/history">
            View History
          </Link>
        </div>

        {todayWorkouts.length ? (

          <div className="activity-list">

            {todayWorkouts
              .slice()
              .reverse()
              .slice(0, 5)
              .map((workout) => (

                <div
                  className="activity-item"
                  key={workout._id}
                >

                  <div className="activity-icon">
                    🏋️
                  </div>

                  <div className="activity-info">

                    <strong>
                      {workout.workoutName}
                    </strong>

                    <span>
                      {workout.workoutType || 'Workout'}
                    </span>

                  </div>

                  <div className="activity-value">
                    <strong>
                      {workout.duration} min
                    </strong>

                    <span>
                      {workout.calories || 0} kcal
                    </span>
                  </div>

                </div>

              ))}

          </div>

        ) : (

          <div className="empty-activity">

            <span>🏃</span>

            <h4>No workout logged today</h4>

            <p>
              Start your workout and keep the streak alive!
            </p>

            <Link
              className="primary small"
              to="/workouts"
            >
              Add Workout
            </Link>

          </div>

        )}

      </section>

      {/* =========================
          INSIGHT
      ========================= */}

      <section className="insight">

        <div className="insight-icon">
          💡
        </div>

        <div>
          <strong>GoFit Insight</strong>

          <p>{insight}</p>
        </div>

      </section>

    </div>
  );
}


/* =========================
   CARD COMPONENT
========================= */

function Card({
  label,
  value,
  icon
}) {
  return (
    <div className="card">

      <span>{icon}</span>

      <small>{label}</small>

      <strong>{value}</strong>

    </div>
  );
}