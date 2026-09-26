import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { fmt, today } from '../utils/date';

export default function Water() {
  const [items, setItems] = useState([]);
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(today());

  const load = () =>
    api.get('/water').then((r) => setItems(r.data));

  useEffect(() => {
    load();
  }, []);

  const add = async (e) => {
    e.preventDefault();

    await api.post('/water', {
      amount,
      date
    });

    setAmount('');
    load();
  };

  const total = items
    .filter(
      (x) =>
        new Date(x.date).toDateString() ===
        new Date().toDateString()
    )
    .reduce((s, x) => s + x.amount, 0);

  return (
    <Page
      title="Water Tracking"
      sub="Keep your daily hydration history organized."
    >
      <div className="cards">

        <div className="card">
          <span>💧</span>
          <small>Today's Intake</small>
          <strong>{total} ml</strong>
        </div>

        <div className="card">
          <span>🎯</span>
          <small>Suggested Target</small>
          <strong>2000 ml</strong>
        </div>

        <div className="card">
          <span>📈</span>
          <small>Progress</small>
          <strong>
            {Math.min(100, Math.round(total / 20))}%
          </strong>
        </div>

      </div>

      <div className="panel">
        <form
          className="inline-form"
          onSubmit={add}
        >
          <input
            type="number"
            min="1"
            required
            placeholder="Amount in ml"
            value={amount}
            onChange={(e) =>
              setAmount(e.target.value)
            }
          />

          <input
            type="date"
            value={date}
            onChange={(e) =>
              setDate(e.target.value)
            }
          />

          <button
            className="primary"
            type="submit"
          >
            Add Water
          </button>
        </form>
      </div>

      <div className="panel">
        <h3>Water History</h3>

        {items.length ? (
          <table>
            <thead>
              <tr>
                <th>Amount</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>
              {items.map((x) => (
                <tr key={x._id}>
                  <td>{x.amount} ml</td>
                  <td>{fmt(x.date)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="muted">
            No water entries yet.
          </p>
        )}
      </div>
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