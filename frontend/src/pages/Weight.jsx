import React, { useEffect, useMemo, useState } from 'react';
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
import { fmt, today } from '../utils/date';

export default function Weight() {
  const { user } = useAuth();

  const [items, setItems] = useState([]);
  const [weight, setWeight] = useState('');
  const [date, setDate] = useState(today());
  const [msg, setMsg] = useState('');

  const load = () =>
    api
      .get('/weight')
      .then((r) => setItems(r.data))
      .catch(console.error);

  useEffect(() => {
    load();
  }, []);

  const add = async (e) => {
    e.preventDefault();

    try {
      await api.post('/weight', {
        weight,
        date
      });

      setWeight('');
      setMsg('Weight added successfully ✓');

      load();

      setTimeout(() => {
        setMsg('');
      }, 3000);
    } catch (error) {
      console.error(error);
      setMsg('Unable to save weight');
    }
  };

  const latest =
    items.at(-1)?.weight ??
    user?.weight ??
    null;

  const previous =
    items.length > 1
      ? items.at(-2)?.weight
      : null;

  const weightChange =
    latest !== null && previous !== null
      ? (Number(latest) - Number(previous)).toFixed(1)
      : null;

  const bmi =
    user?.height && latest
      ? (
          latest /
          ((user.height / 100) ** 2)
        ).toFixed(1)
      : '-';

  const getBmiStatus = () => {
    if (bmi === '-') return 'Add height to calculate';

    if (bmi < 18.5) return 'Below normal range';
    if (bmi < 25) return 'Healthy range';
    if (bmi < 30) return 'Above normal range';

    return 'High range';
  };

  const chart = items.map((x) => ({
    date: new Date(x.date).toLocaleDateString(
      undefined,
      {
        day: '2-digit',
        month: 'short'
      }
    ),
    weight: Number(x.weight)
  }));

  const averageWeight = useMemo(() => {
    if (!items.length) return 0;

    const total = items.reduce(
      (sum, x) => sum + Number(x.weight || 0),
      0
    );

    return (total / items.length).toFixed(1);
  }, [items]);

  const highestWeight = useMemo(() => {
    if (!items.length) return 0;

    return Math.max(
      ...items.map((x) => Number(x.weight))
    ).toFixed(1);
  }, [items]);

  return (
    <Page
      title="Weight & BMI"
      sub="Track weight changes and calculate BMI from your profile height."
    >

      {/* =========================
          OVERVIEW
      ========================= */}

      <div className="weight-stats">

        <div className="weight-stat">
          <div className="weight-stat-icon">
            ⚖️
          </div>

          <div>
            <small>Latest Weight</small>

            <strong>
              {latest ? latest : '-'}
            </strong>

            <span>kg</span>
          </div>
        </div>

        <div className="weight-stat">
          <div className="weight-stat-icon">
            📊
          </div>

          <div>
            <small>BMI</small>

            <strong>{bmi}</strong>

            <span>
              {bmi !== '-' ? getBmiStatus() : ''}
            </span>
          </div>
        </div>

        <div className="weight-stat">
          <div className="weight-stat-icon">
            📈
          </div>

          <div>
            <small>Average Weight</small>

            <strong>
              {items.length ? averageWeight : '-'}
            </strong>

            <span>kg</span>
          </div>
        </div>

        <div className="weight-stat">
          <div className="weight-stat-icon">
            📝
          </div>

          <div>
            <small>Total Entries</small>

            <strong>{items.length}</strong>

            <span>records</span>
          </div>
        </div>

      </div>

      {/* =========================
          ADD + BMI
      ========================= */}

      <div className="weight-grid">

        <section className="panel weight-form-panel">

          <div className="section-heading">
            <div>
              <h3>➕ Add Weight</h3>

              <p>
                Record your latest weight measurement.
              </p>
            </div>
          </div>

          <form
            className="weight-form"
            onSubmit={add}
          >

            <div className="weight-field">
              <label>Weight</label>

              <div className="weight-input-unit">
                <input
                  type="number"
                  step="0.1"
                  min="1"
                  required
                  placeholder="70.0"
                  value={weight}
                  onChange={(e) =>
                    setWeight(e.target.value)
                  }
                />

                <span>kg</span>
              </div>
            </div>

            <div className="weight-field">
              <label>Date</label>

              <input
                type="date"
                value={date}
                onChange={(e) =>
                  setDate(e.target.value)
                }
              />
            </div>

            <button
              className="primary"
              type="submit"
            >
              Save Weight
            </button>

          </form>

          {msg && (
            <p className="success weight-message">
              {msg}
            </p>
          )}

        </section>

        <section className="panel bmi-panel">

          <div className="panel-head">
            <h3>📊 BMI Overview</h3>
          </div>

          <div className="bmi-display">

            <div className="bmi-number">
              {bmi}
            </div>

            <div>
              <strong>
                {getBmiStatus()}
              </strong>

              <p>
                Based on your current weight
                and profile height.
              </p>
            </div>

          </div>

          <div className="bmi-scale">

            <span>
              <i />
              Below
            </span>

            <span>
              <i />
              Healthy
            </span>

            <span>
              <i />
              Above
            </span>

            <span>
              <i />
              High
            </span>

          </div>

        </section>

      </div>

      {/* =========================
          CHART
      ========================= */}

      <section className="panel weight-chart-panel">

        <div className="panel-head">

          <div>
            <h3>📈 Weight Progress</h3>

            <p className="panel-subtitle">
              Track your weight changes over time.
            </p>
          </div>

          {weightChange !== null && (
            <span
              className={
                Number(weightChange) > 0
                  ? 'weight-change up'
                  : Number(weightChange) < 0
                  ? 'weight-change down'
                  : 'weight-change'
              }
            >
              {Number(weightChange) > 0 ? '+' : ''}
              {weightChange} kg
            </span>
          )}

        </div>

        {chart.length ? (

          <ResponsiveContainer
            width="100%"
            height={300}
          >
            <LineChart data={chart}>

              <CartesianGrid />

              <XAxis
                dataKey="date"
              />

              <YAxis
                domain={['dataMin - 2', 'dataMax + 2']}
              />

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

          <div className="weight-empty-chart">

            <div>
              📈
            </div>

            <h4>
              No weight data yet
            </h4>

            <p>
              Add your first weight entry to
              start seeing your progress.
            </p>

          </div>

        )}

      </section>

      {/* =========================
          HISTORY
      ========================= */}

      <section className="panel">

        <div className="panel-head">

          <div>
            <h3>Weight History</h3>

            <p className="panel-subtitle">
              {items.length
                ? `${items.length} weight ${
                    items.length > 1
                      ? 'entries'
                      : 'entry'
                  } recorded`
                : 'Your weight history will appear here.'}
            </p>
          </div>

          <span className="history-count">
            {items.length}
          </span>

        </div>

        {items.length ? (

          <div className="weight-history">

            {items
              .slice()
              .reverse()
              .map((x) => (

                <div
                  className="weight-history-item"
                  key={x._id}
                >

                  <div className="weight-history-icon">
                    ⚖️
                  </div>

                  <div className="weight-history-info">

                    <strong>
                      {x.weight} kg
                    </strong>

                    <span>
                      Weight measurement
                    </span>

                  </div>

                  <div className="weight-history-date">

                    <small>Date</small>

                    <strong>
                      {fmt(x.date)}
                    </strong>

                  </div>

                  <button
                    className="delete-weight"
                    onClick={async () => {
                      try {
                        await api.delete(
                          '/weight/' + x._id
                        );

                        setMsg(
                          'Weight entry deleted'
                        );

                        load();

                        setTimeout(() => {
                          setMsg('');
                        }, 2500);
                      } catch (error) {
                        console.error(error);
                      }
                    }}
                    title="Delete weight entry"
                  >
                    🗑️
                  </button>

                </div>

              ))}

          </div>

        ) : (

          <div className="weight-empty">

            <div className="weight-empty-icon">
              ⚖️
            </div>

            <h4>
              No weight entries yet
            </h4>

            <p>
              Add your first measurement above
              to begin tracking your progress.
            </p>

          </div>

        )}

      </section>

    </Page>
  );
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
